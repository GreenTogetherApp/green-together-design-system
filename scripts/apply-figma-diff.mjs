#!/usr/bin/env node
// Applies the diff returned by the Figma check to figma-snapshot.json, value by value, keeping the file's layout.
// Usage: node scripts/apply-figma-diff.mjs diff.json   (diff.json = the {diffs:[...]} the Figma check returned)
import { readFileSync, writeFileSync } from "node:fs";
const diff = JSON.parse(readFileSync(process.argv[2], "utf8"));
let text = readFileSync("figma-snapshot.json", "utf8");

function matchEnd(t, i) { // end index of the JSON value starting at t[i]
  const c = t[i];
  if (c === "[" || c === "{") {
    let depth = 0, inStr = false;
    for (let j = i; j < t.length; j++) {
      const ch = t[j];
      if (inStr) { if (ch === "\\") j++; else if (ch === '"') inStr = false; continue; }
      if (ch === '"') inStr = true;
      else if (ch === "[" || ch === "{") depth++;
      else if (ch === "]" || ch === "}") { depth--; if (depth === 0) return j + 1; }
    }
  } else if (c === '"') {
    for (let j = i + 1; j < t.length; j++) { if (t[j] === "\\") j++; else if (t[j] === '"') return j + 1; }
  } else { const m = t.slice(i).match(/^[^,}\]\n]+/); return i + m[0].length; }
  throw new Error("cannot parse value at " + i);
}
function spaced(value) { // JSON with a space after "," and ":" outside strings, like the rest of the file
  let out = "", inStr = false;
  for (const ch of JSON.stringify(value)) {
    out += ch;
    if (ch === '"' && !out.endsWith('\\"')) inStr = !inStr;
    else if (!inStr && (ch === "," || ch === ":")) out += " ";
  }
  return out;
}
function patch(section, name, value) {
  const open = text.indexOf(`\n  "${section}": `);
  if (open < 0) throw new Error("no section " + section);
  const bStart = text.indexOf("{", open);
  const bEnd = matchEnd(text, bStart);
  const block = text.slice(bStart, bEnd);
  const key = JSON.stringify(name) + ": ";
  const at = block.indexOf(key);
  if (at < 0) throw new Error(`no key ${section}/${name}`);
  const vStart = bStart + at + key.length;
  const vEnd = matchEnd(text, vStart);
  text = text.slice(0, vStart) + spaced(value) + text.slice(vEnd);
}
for (const d of diff.diffs ?? []) patch(d.section, d.name, d.figma);
const today = new Date().toISOString().slice(0, 10);
text = text.replace(/"exportedAt": "[^"]*"/, `"exportedAt": "${today}"`);
JSON.parse(text); // must still be valid
writeFileSync("figma-snapshot.json", text);
console.log(`patched ${(diff.diffs ?? []).length} value(s); exportedAt ${today}`);
