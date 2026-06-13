# Version & sync

## This snapshot
| | |
|---|---|
| **Re-synced** | 2026-06-13, directly from the live **claude.ai/design** project "Green Together Design System" (`colors_and_type.css`) |
| **Contains** | `code-tokens.css` (CSS variables, for code) **and** `figma-tokens.json` (the same values in Figma Tokens Studio format, for designers) — colours, type, spacing, radius, shadows, motion |

> ✓ **Tokens confirmed current (2026-06-13).** Re-synced against the live design system —
> the token values are canonical and unchanged. **`code-tokens.css` and `figma-tokens.json`
> are two formats of the identical token set** (verified equal at this snapshot). (The DS
> project's *other* files — components/previews/README — may move independently; this package
> tracks the tokens.)

## The cadence model (why this exists)

```
DESIGN source of truth            CODE distribution            CONSUMERS (pin a version)
─────────────────────             ─────────────────            ─────────────────────────
Figma ─MCP▶ claude.ai/design ─sync▶  green-together-design-system  ─pull/bump▶  sam-r4-prototype
            (spec + merge =           (this repo: code-tokens.css                the admin app (Lovable)
             the DESIGN truth)         + figma-tokens.json)                      future surfaces
```

**The full chain:** a component is adjusted in **Figma** → pulled via **Figma MCP** into
**claude.ai/design**, where it's spec'd + merged into the system (**the design source of
truth**) → re-synced into **this repo** as the code + Figma-format mirror → consumers pin a
version.

> ⚠️ **Known gap (flagged for the team):** the **Figma ⇄ claude.ai/design** direction is still
> a *manual* round-trip — there's no automatic sync keeping the Figma library and the
> claude.ai/design system in lockstep. Today that's bridged by hand via Figma MCP. Worth
> closing later; noted here so nobody assumes it's automatic.

- **Design changes happen upstream** (Figma → claude.ai/design), on their own schedule.
- **This repo is re-synced** from upstream at deliberate checkpoints, and **versioned**
  (tag releases, e.g. `v1.0`, `v1.1`). That's the single code source.
- **Consumers pin a version** and **bump on their own schedule** — so a design-system
  update never silently breaks product work, and product work never blocks design updates.
  (The prototype already does this: `src/design-system/VERSION.md` records which snapshot
  it's on; bumping is one deliberate, reviewable commit.)

## How to re-sync this repo (when the DS updates upstream)
1. Pull the latest tokens from the claude.ai/design project — `colors_and_type.css` (CSS) and
   the Tokens Studio JSON export.
2. Replace **`code-tokens.css`** here (strip any local `@font-face`/icon `@import`; keep `:root`),
   and replace **`figma-tokens.json`** with the matching JSON export — keep the two in lockstep.
3. Bump the version + tag a release; note what changed.
4. Consumers update their pin when they're ready.
