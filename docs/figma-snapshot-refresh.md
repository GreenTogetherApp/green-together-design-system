<!-- How the Figma snapshot stays fresh: the weekly check, by hand or by the scheduled task. -->
# Keeping `figma-snapshot.json` fresh

The drift check compares the code with a committed snapshot of Figma's variables. The snapshot only changes when someone refreshes it. This is how.

**1. Build the read-only Figma check** (puts the committed snapshot into the template):

```bash
node scripts/build-figma-check.mjs /tmp/figma-snapshot-check.js
```

**2. Run it in Figma.** Paste the file's contents as the `code` of a read-only `use_figma` call on the design-system file (`Tt32SnKvhoMDOB6YUw1QG3`). It returns `{ inStep, diffCount, diffs, missing }`. `inStep: true` means nothing changed and you are done.

**3. If something differs**, save the returned object as `diff.json` and apply it. Values come from Figma, so there is nothing to retype:

```bash
node scripts/apply-figma-diff.mjs diff.json
npm run drift:report
npm run check
```

`npm run check` may now fail with real drift (Figma moved, code did not). That is the point: fix the code, or record a reasoned `KNOWN` entry in `scripts/check-drift.mjs`.

**4. Open a PR** with the snapshot, the report and any code change. Do not merge it unreviewed.

`missing` lists variables the snapshot tracks that no longer exist in Figma (renamed or deleted). Those need a person.

**What it covers:** semantic colours (four modes), brand ramps, radii, chart colours, heading, paragraph, caption and mono type, weights, font families, spacing and shadows. It does not see new variables added to Figma, only changes to the ones already tracked.

A scheduled task runs steps 1 to 4 every Monday and opens a PR when something differs.
