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

### ⚠️ Pending upstream correction — surface-scoped primary (2026-06-13)

The team approved **dark blue `#0B618F` as the primary action colour on Surface B** (the
admin / business SaaS), with green reserved for savings / positive delta. The shipped Sam
prototype already does this (its Tailwind theme sets `primary = #0B618F`). This repo has now
been corrected to match — `--color-primary` is **surface-scoped** (`:root` = green = Surface A;
`[data-surface="b"]` = dark blue), plus a new `--color-positive` (green) and the *Surfaces*
section in `GUIDELINES.md`.

**The upstream design master (claude.ai/design) still describes primary as globally green** and
needs the same correction so design and this mirror stop diverging on this point. Until that's
done, **this repo's surface-scoped model is the corrected reference.** Two follow-ups for the
team:
- Update the claude.ai/design system text + tokens to the surface-scoped primary.
- Optionally migrate the Sam prototype from its hardcoded Tailwind blue to the
  `data-surface="b"` token (visually identical; just makes it DS-driven instead of bypassed).

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
