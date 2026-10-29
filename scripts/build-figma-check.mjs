#!/usr/bin/env node
// Builds the read-only Figma check: puts the committed snapshot into the template's SNAP line and writes the result to the path given (default /tmp/figma-snapshot-check.js).
import { readFileSync, writeFileSync } from "node:fs";
const snap = JSON.parse(readFileSync("figma-snapshot.json", "utf8"));
const keep = {};
for (const k of ["sem", "rad", "chart", "typo", "space", "brand", "shadows"]) keep[k] = snap[k] ?? {};
const out = readFileSync("scripts/figma-snapshot-check.template.js", "utf8").replace("const SNAP = __SNAPSHOT__;", "const SNAP = " + JSON.stringify(keep) + ";");
const dest = process.argv[2] || "/tmp/figma-snapshot-check.js";
writeFileSync(dest, out);
console.log(`wrote ${dest} (${out.length} chars)`);
