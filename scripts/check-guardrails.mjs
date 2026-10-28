#!/usr/bin/env node
/* ============================================================================
 * Green Together DS — guardrails
 * ----------------------------------------------------------------------------
 * Rules the repo already states in prose, now enforced so they can't rot:
 *
 *   1. LOCKSTEP — every token promoted from the Figma studio exists in BOTH
 *      code-tokens.css and figma-tokens.json, with the same value. VERSION.md
 *      says "they are two formats of one set and must stay equal"; this is that
 *      sentence, executable.
 *
 *   2. NO RAW COLOUR IN COMPONENTS — component source binds tokens, never hex
 *      or rgb() literals. A component that hardcodes a colour is a component
 *      that ignores the surface switch and drifts the moment a token changes.
 *
 *   3. CONTRAST — the accessibility bars the system promises, measured from the
 *      real token values: AAA (7:1) for text on light, 3:1 for control borders,
 *      4.5:1 for secondary text on dark. A token change that breaks a bar fails.
 *
 * Run: node scripts/check-guardrails.mjs
 * Exit 0 = clean, 1 = violations (printed with file and line).
 * ========================================================================== */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const failures = [];

/* ── Rule 1: the promoted sets stay in lockstep ─────────────────────────── */

const css = readFileSync("code-tokens.css", "utf8");
const json = JSON.parse(readFileSync("figma-tokens.json", "utf8"));

// Only the promoted semantic sets + gradients are under lockstep. The older
// base tokens predate the promote lane and are tracked by the snapshot instead.
const PROMOTED_GROUPS = [
  "text",
  "icon",
  "surface",
  "border",
  "interaction",
  "focus",
  "destructive",
  "overlay",
  "color", // top-level semantic leaves, e.g. --color-positive-strong
];

const cssVars = new Map();
// the promoted sets live at the end of :root — stop at its closing brace,
// so the [data-surface] override blocks below are not mistaken for tokens
const promotedBlock = (css.split("Promoted from Figma")[1] ?? "").split("\n}")[0];
for (const line of promotedBlock.split("\n")) {
  const m = line.match(/^\s*--([a-z0-9-]+):\s*([^;]+);/);
  if (m) cssVars.set(m[1], m[2].trim());
}

const flatJson = new Map();
const semantic = json.color?.semantic ?? {};
for (const [group, entries] of Object.entries(semantic)) {
  if (!entries || typeof entries !== "object") continue;
  // a leaf directly under semantic maps to --color-<name> in the CSS
  if ("value" in entries) {
    const leaf = String(entries.value).trim();
    if (!leaf.startsWith("{")) flatJson.set(`color-${group}`, leaf);
    continue;
  }
  for (const [name, token] of Object.entries(entries)) {
    if (!token || typeof token !== "object" || !("value" in token)) continue;
    // text/primary -> --text-primary ; overlay/backdrop -> --overlay-backdrop
    const value = String(token.value).trim();
    // {color.brand.green.500} is an alias for designers, not a literal to compare
    if (value.startsWith("{")) continue;
    flatJson.set(`${group}-${name}`, value);
  }
}
for (const [name, token] of Object.entries(json.color?.gradient ?? {})) {
  flatJson.set(`gradient-${name}`, String(token.value).trim());
}

for (const [cssName, cssValue] of cssVars) {
  const group = cssName.split("-")[0];
  if (!PROMOTED_GROUPS.includes(group) && group !== "gradient") continue;
  const jsonValue = flatJson.get(cssName);
  if (jsonValue === undefined) {
    failures.push(
      `lockstep: --${cssName} is in code-tokens.css but missing from figma-tokens.json`,
    );
  } else if (jsonValue !== cssValue) {
    failures.push(
      `lockstep: --${cssName} disagrees — css "${cssValue}" vs json "${jsonValue}"`,
    );
  }
}
for (const [jsonName, jsonValue] of flatJson) {
  const group = jsonName.split("-")[0];
  if (!PROMOTED_GROUPS.includes(group) && group !== "gradient") continue;
  if (!cssVars.has(jsonName)) {
    failures.push(
      `lockstep: ${jsonName} (${jsonValue}) is in figma-tokens.json but missing from code-tokens.css`,
    );
  }
}

/* ── Rule 2: component source binds tokens, never raw colour ────────────── */

const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;

function walk(dir) {
  let files = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) files = files.concat(walk(path));
    else if (/\.(tsx?|jsx?|css)$/.test(entry)) files.push(path);
  }
  return files;
}

let componentFiles = [];
try {
  componentFiles = walk("components");
} catch {
  // no components yet — rule is vacuously true
}

for (const file of componentFiles) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      const code = line.replace(/\/\*.*?\*\//g, "").replace(/\/\/.*$/, "");
      if (RAW_COLOUR.test(code)) {
        failures.push(
          `raw colour: ${file}:${i + 1} — use a DS token, not "${code.trim().slice(0, 60)}"`,
        );
      }
    });
}


/* ── Rule 3: contrast bars hold ─────────────────────────────────────────── */

// Merge the declarations of every rule whose selector LIST contains `selector`
// (so a rule written as `a, b { ... }` counts for both). Several declarations
// per line are fine. Comments are stripped first.
const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
const rules = [];
for (const m of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  rules.push({ selectors: m[1].split(",").map((x) => x.trim().replace(/\s+/g, " ")), body: m[2] });
}
function block(selector) {
  const out = new Map();
  for (const r of rules) {
    if (!r.selectors.includes(selector)) continue;
    for (const d of r.body.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) out.set(d[1], d[2].trim());
  }
  return out;
}
const DARK = '[data-theme="dark"]', DARK_B = '[data-theme="dark"][data-surface="b"]', B = '[data-surface="b"]';
const scopes = {
  a: [block(":root")],
  b: [block(":root"), block("[data-surface]"), block(B)],
  "a-dark": [block(":root"), block("[data-theme]"), block(DARK)],
  "b-dark": [block(":root"), block("[data-theme]"), block("[data-surface]"), block(B), block(DARK), block(DARK_B)],
};
function resolve(scope, name, depth = 0) {
  let v;
  for (const layer of scopes[scope]) if (layer.has(name)) v = layer.get(name);
  if (v === undefined || depth > 8) return undefined;
  const ref = v.match(/^var\(--([a-z0-9-]+)\)$/);
  return ref ? resolve(scope, ref[1], depth + 1) : v;
}
function rgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}
function luminance(hex) {
  const [r, g, b] = rgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
function need(scope, fg, bg, min, why) {
  const f = resolve(scope, fg), b = resolve(scope, bg);
  if (!/^#[0-9a-f]{6}$/i.test(f ?? "") || !/^#[0-9a-f]{6}$/i.test(b ?? "")) {
    failures.push(`contrast: [${scope}] --${fg} on --${bg} could not be resolved to hex (${f} / ${b})`);
    return;
  }
  const r = ratio(f, b);
  if (r < min) failures.push(`contrast: [${scope}] ${why} — --${fg} ${f} on --${bg} ${b} is ${r.toFixed(2)}:1, needs ${min}:1`);
}
// light surfaces: primary label AAA, secondary text AAA on every light surface
for (const sc of ["a", "b"]) need(sc, "color-primary-fg", "color-primary", 7, "primary label");
for (const bg of ["color-bg", "color-bg-subtle", "color-bg-muted", "color-primary-soft", "surface-level-0"]) {
  need("a", "color-fg-muted", bg, 7, "secondary text");
}
// tinted fills (pressed surface, Surface B soft blue) hold 6:1; documented, not 7:1
need("a", "color-fg-muted", "surface-level-2", 6, "secondary text on a tinted fill");
need("b", "color-fg-muted", "color-primary-soft", 6, "secondary text on Surface B soft blue");
need("b", "color-fg-muted", "color-bg", 7, "secondary text on Surface B white");
need("a", "text-secondary", "color-bg", 7, "secondary text token");
need("a", "border-level-5", "color-bg", 3, "control border");
need("a", "color-danger", "color-bg", 4.5, "danger on white");
// dark: primary label AAA, secondary text 4.5
for (const sc of ["a-dark", "b-dark"]) {
  need(sc, "color-primary-fg", "color-primary", 7, "dark primary label");
  need(sc, "color-fg-muted", "color-bg", 4.5, "dark secondary text");
  need(sc, "color-fg", "color-bg", 7, "dark body text");
}

/* ── Report ─────────────────────────────────────────────────────────────── */

const checked = `${cssVars.size} promoted tokens · ${componentFiles.length} component file(s) · contrast bars`;
if (failures.length) {
  console.error(`✗ guardrails failed (${checked})\n`);
  for (const f of failures) console.error(`  ${f}`);
  console.error(
    `\n${failures.length} violation(s). See VERSION.md → "How to promote from Figma".`,
  );
  process.exit(1);
}
console.log(`✓ guardrails pass — ${checked}`);
