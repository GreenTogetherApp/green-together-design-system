# Version & sync

## This snapshot
| | |
|---|---|
| **Re-synced** | 2026-06-13, directly from the live **claude.ai/design** project "Green Together Design System" (`colors_and_type.css`) |
| **Contains** | `tokens.css` (colours, type, spacing, radius, shadows, motion) |

> ✓ **Tokens confirmed current (2026-06-13).** Re-synced against the live design system —
> the token values are canonical and unchanged. (The DS project's *other* files —
> components/previews/README — may move independently; this package tracks the tokens.)

## The cadence model (why this exists)

```
DESIGN source of truth            CODE distribution            CONSUMERS (pin a version)
─────────────────────             ─────────────────            ─────────────────────────
claude.ai/design  ──re-sync──▶   green-together-design-system  ──pull/bump──▶  sam-r4-prototype
   + Figma                        (this repo)                                   the admin app (Lovable)
                                                                                future surfaces
```

- **Design changes happen upstream** (claude.ai/design + Figma), on their own schedule.
- **This repo is re-synced** from upstream at deliberate checkpoints, and **versioned**
  (tag releases, e.g. `v1.0`, `v1.1`). That's the single code source.
- **Consumers pin a version** and **bump on their own schedule** — so a design-system
  update never silently breaks product work, and product work never blocks design updates.
  (The prototype already does this: `src/design-system/VERSION.md` records which snapshot
  it's on; bumping is one deliberate, reviewable commit.)

## How to re-sync this repo (when the DS updates upstream)
1. Pull the latest `colors_and_type.css` from the claude.ai/design project.
2. Replace `tokens.css` here (strip any local `@font-face`/icon `@import`; keep `:root`).
3. Bump the version + tag a release; note what changed.
4. Consumers update their pin when they're ready.
