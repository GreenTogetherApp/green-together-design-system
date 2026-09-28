#!/usr/bin/env node
/* ============================================================================
 * Green Together DS — guardrails
 * ----------------------------------------------------------------------------
 * Two rules the repo already states in prose, now enforced so they can't rot:
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

/* ── Report ─────────────────────────────────────────────────────────────── */

const checked = `${cssVars.size} promoted tokens · ${componentFiles.length} component file(s)`;
if (failures.length) {
  console.error(`✗ guardrails failed (${checked})\n`);
  for (const f of failures) console.error(`  ${f}`);
  console.error(
    `\n${failures.length} violation(s). See VERSION.md → "How to promote from Figma".`,
  );
  process.exit(1);
}
console.log(`✓ guardrails pass — ${checked}`);
