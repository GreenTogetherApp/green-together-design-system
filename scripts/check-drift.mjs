#!/usr/bin/env node
/* ============================================================================
 * Green Together DS — drift check
 * ----------------------------------------------------------------------------
 * Compares the code package (code-tokens.css) against a snapshot of the Figma
 * library's variable values (figma-snapshot.json) and reports every token that
 * disagrees. Pairs are matched by name rules below, per surface and per theme.
 *
 * Run:      node scripts/check-drift.mjs        (also: npm run drift)
 * Exit 0:   code and the snapshot agree, apart from the KNOWN list below.
 * Exit 1:   something drifted. Fix the code or Figma, refresh the snapshot,
 *           or add a dated, reasoned entry to KNOWN (a decision still open).
 *
 * The snapshot is a committed export of Figma's values. It only changes when
 * someone refreshes it, so this catches (a) code edits that skip Figma, and
 * (b) Figma edits once the snapshot is refreshed. See figma-snapshot.json.
 * ========================================================================== */

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const css = readFileSync("code-tokens.css", "utf8");
const snap = JSON.parse(readFileSync("figma-snapshot.json", "utf8"));

/* Differences we have looked at and are carrying on purpose. Each has a reason and the exact values it covers: if either value changes, it stops being
   known and fails again. */
export const KNOWN = [
  { key: "[a] color-border", code: "#D5DBE1", figma: "#E5E5E5", reason: "Figma general/border is neutral/200 #E5E5E5; the shelf border is --gt-line #D5DBE1 (border-level-3). Open decision: which one is the default card border." },
  { key: "[b] color-border", code: "#D5DBE1", figma: "#E5E5E5", reason: "Same open decision as Surface A: Figma #E5E5E5 vs shelf #D5DBE1." },
  { key: "[a] color-primary-fg", code: "#FFFFFF", figma: "#FAFAFA", reason: "Figma label on a primary is #FAFAFA, code uses #FFFFFF. Both pass AAA (7.7:1 and 8.0:1)." },
  { key: "[b] color-primary-fg", code: "#FFFFFF", figma: "#FAFAFA", reason: "Same as Surface A: #FAFAFA in Figma, #FFFFFF in code." },
  { key: "[a-dark] color-secondary-fg", code: "#FAFAFA", figma: "#F7F9FA", reason: "Figma secondary label in dark is #F7F9FA, code inherits --color-fg #FAFAFA. Visually the same." },
  { key: "[b-dark] color-secondary-fg", code: "#FAFAFA", figma: "#F7F9FA", reason: "Same as Surface A dark." },
  { key: "[a] chart-a-5", code: "#116841", figma: "#14784C", reason: "Figma chart 5 (light) is Green 700 #14784C; code chart-a-5 is #116841. Open decision." },
  { key: "[a] shadow-md", code: "0 4 8 0 0-0-0@0.08", figma: "0 2 4 -2 0-0-0@0.1 | 0 4 6 -1 0-0-0@0.1", reason: "Figma shadows/md is the Tailwind default (two layers); code --shadow-md is one softer layer. Open decision: which one is the elevation-3 shadow." },
  { key: "[a] shadow-lg", code: "0 8 16 0 0-0-0@0.12", figma: "0 10 15 -3 0-0-0@0.1 | 0 4 6 -4 0-0-0@0.1", reason: "Figma shadows/lg is the Tailwind default; code --shadow-lg is one layer. Same open decision as md." },
  { key: "[a] shadow-xl", code: "0 16 32 0 0-0-0@0.12 | 0 8 16 0 0-0-0@0.08", figma: "0 20 25 -5 0-0-0@0.1 | 0 8 10 -6 0-0-0@0.1", reason: "Figma shadows/xl is the Tailwind default; code --shadow-xl (added in v1.4.0) is two softer layers. Same open decision as md." },
];

/* ── read the CSS into scopes ───────────────────────────────────────────── */

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
  if (v === undefined || depth > 10) return undefined;
  const ref = v.match(/^var\(--([a-z0-9-]+)\)$/);
  return ref ? resolve(scope, ref[1], depth + 1) : v;
}

/* ── normalise values so formats do not cause false drift ───────────────── */

function norm(v) {
  if (v === undefined || v === null) return v;
  if (typeof v === "number") return String(+v.toFixed(2));
  let s = String(v).trim();
  const rgba = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgba) return `rgba(${rgba[1]},${rgba[2]},${rgba[3]},${+(rgba[4] ?? 1)})`;
  if (/^#[0-9a-f]{3,8}$/i.test(s)) return s.toUpperCase();
  const px = s.match(/^(-?[\d.]+)px$/);
  if (px) return String(+(+px[1]).toFixed(2));
  if (/^-?[\d.]+$/.test(s)) return String(+(+s).toFixed(2));
  // font stacks: first family, no quotes, without " Variable"
  if (s.includes(",") || /^"/.test(s)) return s.split(",")[0].replace(/["']/g, "").replace(/ Variable$/, "").trim();
  return s.replace(/ Variable$/, "");
}

const failures = [];
const knownHit = [];
let compared = 0;
const rows = []; // for the demo / report

function check(scope, cssName, figmaName, figmaValue) {
  const cssRaw = resolve(scope, cssName);
  compared++;
  const key = `[${scope}] ${cssName}`;
  const a = cssRaw === undefined ? "(missing in code)" : norm(cssRaw), b = norm(figmaValue);
  if (cssRaw !== undefined && a === b) return;
  const known = KNOWN.find((k) => k.key === key && norm(k.code) === a && norm(k.figma) === b);
  const row = { key, figma: figmaName, code: a, figmaValue: b, known: known?.reason ?? null };
  rows.push(row);
  (known ? knownHit : failures).push(row);
}

/* ── semantic colours ───────────────────────────────────────────────────── */

const SCOPE_BY_MODE = ["a", "a-dark", "b", "b-dark"];
const GENERAL = {
  "general/primary": ["color-primary"],
  "general/primary foreground": ["color-primary-fg"],
  "general/foreground": ["color-fg"],
  "general/background": ["color-bg"],
  "general/muted": ["color-bg-muted"],
  "general/muted foreground": ["color-fg-muted"],
  "general/destructive": ["color-danger"],
  "general/border": ["color-border"],
  "general/secondary": ["color-secondary"],
  "general/secondary foreground": ["color-secondary-fg"],
  "interaction/primary hover": ["color-primary-hover", "interaction-primary-hover"],
  "interaction/primary active": ["color-primary-active", "interaction-primary-active"],
};
for (const [fname, values] of Object.entries(snap.sem)) {
  const names = GENERAL[fname] ?? [fname.replace("/", "-").replace(/ /g, "-")];
  values.forEach((val, i) => {
    for (const cssName of names) check(SCOPE_BY_MODE[i], cssName, fname, val);
  });
}

/* ── brand ramps ────────────────────────────────────────────────────────── */

for (const [fname, val] of Object.entries(snap.brand)) {
  const [hue, step] = fname.split("/");
  check("a", `brand-${hue.toLowerCase().replace(/ /g, "-")}-${step}`, `Colors/${fname}`, val);
}

/* ── radius ─────────────────────────────────────────────────────────────── */

snap.rad && Object.entries(snap.rad).forEach(([fname, vals]) => {
  check("a", fname, fname, vals[0]);
  check("b", fname, fname, vals[1]);
});

/* ── charts (code carries light chart colours only) ─────────────────────── */

for (let n = 1; n <= 5; n++) {
  const v = snap.chart[`categorical/chart ${n}`];
  check("a", `chart-a-${n}`, `categorical/chart ${n} (A light)`, v[0]);
  check("b", `chart-b-${n}`, `categorical/chart ${n} (B light)`, v[2]);
}
check("a", "chart-success", "sentiment/positive", snap.chart["sentiment/positive"][0]);
check("a", "chart-error", "sentiment/negative", snap.chart["sentiment/negative"][0]);

/* ── typography ─────────────────────────────────────────────────────────── */

const HEAD = { "heading 00": "h00", "heading 1": "h1", "heading 2": "h2", "heading 3": "h3", "heading 4": "h4" };
for (const [fname, vals] of Object.entries(snap.typo)) {
  const m = fname.match(/^(heading \d+)\/(font-family|font-size|line-height|letter-spacing)$/);
  if (m) {
    const h = HEAD[m[1]];
    const css = { "font-family": `${h}-family`, "font-size": `${h}-size`, "line-height": `${h}-lh`, "letter-spacing": `${h}-tracking` }[m[2]];
    check("a", css, fname, vals[0]);
    check("b", css, fname, vals[1]);
    continue;
  }
  const s = fname.match(/^serif styles\/(display|heading (\d))$/);
  if (s) {
    const css = s[1] === "display" ? "h00-family" : `h${s[2]}-${s[2] === "1" || s[2] === "2" || s[2] === "3" ? "serif-" : ""}family`;
    check("a", css, fname, vals[0]);
    check("b", css, fname, vals[1]);
  }
}

/* ── type: paragraph, caption, mono, weights, font families ────────────── */

const WEIGHT = { Regular: 400, Medium: 500, Semibold: 600 };
const TYPE_MAP = {
  "paragraph/large/font-size": "p-large-size", "paragraph/large/line-height": "p-large-lh",
  "paragraph/regular/font-size": "p-size", "paragraph/regular/line-height": "p-lh",
  "paragraph/small/font-size": "p-small-size", "paragraph/small/line height": "p-small-lh",
  "paragraph/mini/font-size": "p-mini-size", "paragraph/mini/line height": "p-mini-lh",
  "paragraph/paragraph-weight": "p-weight", "paragraph/paragraph-medium-weight": "p-medium-weight", "paragraph/paragraph-bold-weight": "p-bold-weight",
  "caption/font-size": "caption-size", "caption/line-height": "caption-lh", "caption/letter-spacing": "caption-tracking", "caption/font-weight": "caption-weight",
  "monospaced/font-size": "mono-size", "monospaced/line-height": "mono-lh", "monospaced/letter-spacing": "mono-tracking", "monospaced/font-weight": "mono-weight",
  "heading 00/weight": "h00-weight", "heading 1/weight": "h1-weight", "heading 2/weight": "h2-weight", "heading 3/heading 3 weight": "h3-weight", "heading 4/weight": "h4-weight",
  "font definitions/font-family-sans": "font-sans", "font definitions/font-family-serif": "font-serif", "font definitions/font-family-monospace": "font-mono",
  "font definitions/font-family-headings": "font-headings", "font definitions/font-family-body": "font-body", "font definitions/font-family-headings-serif": "font-headings-serif",
};
for (const [fname, vals] of Object.entries(snap.typo)) {
  const css = TYPE_MAP[fname];
  if (!css) continue;
  const v = (x) => (typeof x === "string" && x in WEIGHT ? WEIGHT[x] : x);
  check("a", css, fname, v(vals[0]));
  check("b", css, fname, v(vals[1]));
}

/* ── spacing (Figma t-shirt scale ↔ code --space-N, matched by role) ────── */

const SPACE_MAP = { "space-1": "2xs", "space-2": "xs", "space-3": "sm", "space-4": "md", "space-5": "xl", "space-6": "2xl", "space-7": "4xl", "space-8": "5xl", "space-9": "7xl" };
for (const [cssName, fname] of Object.entries(SPACE_MAP)) {
  if (snap.space?.[fname] === undefined) { failures.push({ key: `[a] ${cssName}`, figma: `spacing/${fname}`, code: norm(resolve("a", cssName)), figmaValue: "(missing in snapshot)", known: null }); continue; }
  check("a", cssName, `spacing/${fname}`, snap.space[fname]);
}

/* ── shadows (compared layer by layer, light only) ──────────────────────── */

function splitTop(v) { // split on commas outside parentheses
  const out = []; let depth = 0, cur = "";
  for (const ch of v) { if (ch === "(") depth++; if (ch === ")") depth--; if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch; }
  if (cur.trim()) out.push(cur.trim()); return out;
}
function colourKey(c) { const m = c.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i); return m ? `${m[1]}-${m[2]}-${m[3]}@${+(m[4] ?? 1)}` : c; }
function shadowKey(layers) { return layers.map((l) => `${l[0]} ${l[1]} ${l[2]} ${l[3]} ${l[4]}`).sort().join(" | "); }
function cssShadow(v) {
  const layers = [];
  for (const part of splitTop(v)) {
    const m = part.match(/^(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(rgba?\([^)]*\)|#[0-9a-f]+)$/i);
    if (!m) return null;
    layers.push([+m[1], +m[2], +m[3], +m[4], colourKey(m[5])]);
  }
  return shadowKey(layers);
}
for (const size of ["xs", "sm", "md", "lg", "xl"]) {
  const f = snap.shadows?.[size];
  if (!f) continue;
  const key = `[a] shadow-${size}`;
  compared++;
  const raw = resolve("a", `shadow-${size}`);
  const a = raw === undefined ? "(missing in code)" : cssShadow(raw) ?? `(unreadable: ${raw})`;
  const b = shadowKey(f.layers.map((l) => [...l, colourKey(f.color)]));
  if (a === b) continue;
  const known = KNOWN.find((k) => k.key === key && k.code === a && k.figma === b);
  const row = { key, figma: `shadows/${size}`, code: a, figmaValue: b, known: known?.reason ?? null };
  rows.push(row);
  (known ? knownHit : failures).push(row);
}

/* ── report ─────────────────────────────────────────────────────────────── */

export const summary = { compared, drifted: failures.length, known: knownHit.length, snapshot: snap.exportedAt };
const reportText = JSON.stringify({ ...summary, rows }, null, 2) + "\n";
if (process.argv.includes("--json")) {
  console.log(reportText);
  process.exit(failures.length ? 1 : 0);
}
// drift-report.json feeds the "Drift" panel on the demo page.
if (process.argv.includes("--write")) {
  writeFileSync("drift-report.json", reportText);
  console.log(`wrote drift-report.json (${compared} compared, ${failures.length} drifted, ${knownHit.length} known)`);
  process.exit(failures.length ? 1 : 0);
}
if (failures.length) {
  console.error(`✗ drift: ${failures.length} token(s) differ between code and the Figma snapshot (${snap.exportedAt})\n`);
  for (const f of failures) console.error(`  ${f.key}: code ${f.code} vs Figma ${f.figmaValue}  (${f.figma})`);
  console.error(`\nFix the code or Figma and refresh figma-snapshot.json, or record a reasoned KNOWN entry.`);
  process.exit(1);
}
if (existsSync("drift-report.json") && readFileSync("drift-report.json", "utf8") !== reportText) {
  console.error("✗ drift-report.json is out of date. Run: npm run drift:report");
  process.exit(1);
}
console.log(`✓ no drift — ${compared} tokens compared against the Figma snapshot (${snap.exportedAt}); ${knownHit.length} known difference(s) carried`);
for (const k of knownHit) console.log(`    known: ${k.key}  code ${k.code} vs Figma ${k.figmaValue}`);
