// Runs INSIDE Figma (use_figma, read-only). Template: scripts/build-figma-check.mjs puts the committed snapshot in place of the placeholder on the SNAP line.
// Returns only what differs between the live Figma variables and figma-snapshot.json (empty = still in step).
const SNAP = __SNAPSHOT__;
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const all = await figma.variables.getLocalVariablesAsync();
const byId = new Map(all.map(v => [v.id, v]));
const colById = new Map(cols.map(c => [c.id, c]));
const hx = n => Math.round(n * 255).toString(16).padStart(2, '0').toUpperCase();
function fmt(val) {
  if (val && typeof val === 'object' && 'r' in val) {
    const a = val.a === undefined ? 1 : val.a;
    return a >= 0.9995 ? '#' + hx(val.r) + hx(val.g) + hx(val.b) : `rgba(${Math.round(val.r * 255)},${Math.round(val.g * 255)},${Math.round(val.b * 255)},${+a.toFixed(2)})`;
  }
  return typeof val === 'number' ? +val.toFixed(2) : val;
}
async function resolve(v, modeId, depth = 0) {
  let val = v.valuesByMode[modeId];
  if (val === undefined) val = Object.values(v.valuesByMode)[0];
  if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS' && depth < 10) {
    const t = byId.get(val.id) || await figma.variables.getVariableByIdAsync(val.id);
    const tc = colById.get(t.variableCollectionId);
    const tm = tc && tc.modes.find(m => m.modeId === modeId) ? modeId : Object.keys(t.valuesByMode)[0];
    return resolve(t, tm, depth + 1);
  }
  return val;
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const collection = (pred) => cols.find(pred);
const SECTIONS = {
  sem: collection(c => c.name === 'semantic colors'),
  rad: collection(c => c.name === 'border radii'),
  chart: collection(c => c.name === 'chart colors'),
  typo: collection(c => c.name.startsWith('typography')),
  space: collection(c => c.name === 'spacing'),
  brand: collection(c => c.name === 'brand colors'),
};
const diffs = [], missing = [];
async function live(coll, name) {
  const v = all.find(x => x.variableCollectionId === coll.id && (x.name === name || x.name === 'Colors/' + name));
  if (!v) return undefined;
  const row = [];
  for (const m of coll.modes) row.push(fmt(await resolve(v, m.modeId)));
  return row;
}
for (const [key, coll] of Object.entries(SECTIONS)) {
  if (!coll) { missing.push('collection:' + key); continue; }
  for (const [name, snap] of Object.entries(SNAP[key] || {})) {
    const row = await live(coll, name);
    if (row === undefined) { missing.push(key + ':' + name); continue; }
    const figma = key === 'brand' || key === 'space' ? row[0] : row;
    if (!same(figma, snap)) diffs.push({ section: key, name, snapshot: snap, figma });
  }
}
// shadows: names look like "md/shadow 1/x", "md/shadow 2/spread", "sm/color"
const sh = collection(c => c.name === 'shadows');
if (!sh) missing.push('collection:shadows');
else {
  const vars = all.filter(v => v.variableCollectionId === sh.id);
  const val = async v => fmt(await resolve(v, sh.modes[0].modeId));
  for (const [size, snap] of Object.entries(SNAP.shadows || {})) {
    const mine = vars.filter(v => v.name.startsWith(size + '/'));
    const layers = {};
    let color = null;
    for (const v of mine) {
      const parts = v.name.split('/');
      const last = parts[parts.length - 1];
      if (last === 'color') { color = await val(v); continue; }
      const n = (parts.find(p => /^shadow \d+$/.test(p)) || 'shadow 1').split(' ')[1];
      const field = last.replace(/\d+$/, '');
      (layers[n] = layers[n] || {})[field] = await val(v);
    }
    const liveLayers = Object.keys(layers).sort().map(k => [layers[k].x, layers[k].y, layers[k].blur, layers[k].spread]);
    const figma = { layers: liveLayers, color };
    if (!mine.length) missing.push('shadows:' + size);
    else if (!same(figma, snap)) diffs.push({ section: 'shadows', name: size, snapshot: snap, figma });
  }
}
return { inStep: diffs.length === 0 && missing.length === 0, diffCount: diffs.length, diffs, missing };
