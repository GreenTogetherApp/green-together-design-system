# Version & sync

## Package releases
| Tag | Date | Notes |
|---|---|---|
| **v1.1.0** | 2026-09-20 | **First promotion from Figma.** Adds the eight semantic sets built in Figma in August — `text/` `icon/` `surface/` `border/` `interaction/` `focus/` `destructive/` `overlay/` (38 tokens) — plus the three sky gradient paint styles. Values resolved through their Figma aliases; each token records its alias path. Existing `--color-*` / `--gt-*` tokens are untouched, so consumers upgrade without visual change. |
| **v1.0.0** | 2026-07-26 | First packaged release. Adds `package.json` (`@greentogether/design-system`) + `tailwind.cjs` preset (semantic-name → DS-var bridge via `color-mix()`, surface-aware, opacity-safe). Consume via git-URL dep pinned to `#v1.0.0` — see README Option C. Token *values* unchanged from the 2026-06-13 sync. |

## This snapshot
| | |
|---|---|
| **Last promotion** | 2026-09-20, from the Figma studio file `Tt32SnKvhoMDOB6YUw1QG3` — the eight semantic sets + three sky gradients |
| **Base token values** | 2026-06-13 sync (colours, type, spacing, radius, shadows, motion) — unchanged by the 2026-09-20 promotion |
| **Contains** | `code-tokens.css` (CSS variables, for code) **and** `figma-tokens.json` (the same values in Tokens Studio format, for designers) |

> **Not on the shelf yet:** components (they live in Figma only), the full spacing / radius /
> shadow scales (Figma holds far more than the lean set here — a deliberate decision that has
> not been revisited), and dark mode (Figma's `semantic colors` has a `shadcn-dark` mode; the
> shelf ships light only). Each is a promotion waiting to happen, not an oversight.

### ⚠️ Surface-scoped primary — settled here, still open in Figma (2026-06-13, re-checked 2026-09-20)

The team approved **dark blue `#0B618F` as the primary action colour on Surface B** (the
admin / business SaaS), with green reserved for savings / positive delta. This repo
implements it: `--color-primary` is surface-scoped (`:root` = green = Surface A;
`[data-surface="b"]` = dark blue), plus `--color-positive` (green) and the *Surfaces*
section in `GUIDELINES.md`.

**Figma does not carry the surface split** — its `general/primary` is green, full stop.
Until the studio models both surfaces, **this repo's surface-scoped model is the reference**
for anything that ships. (The earlier version of this note asked for a correction in
claude.ai/design; that tool is out of the workflow, so the ask now belongs in Figma.)

## The cadence model (why this exists)

```
STUDIO (design truth)        PROMOTE            SHELF (what ships)       CONSUMERS
─────────────────────        ───────            ──────────────────       ─────────
Figma  ───────────────▶  curated decision  ─▶  this repo               ─▶  apps + prototypes
👽 [system] Green together   per token/set       code-tokens.css            (pin a version)
                                                 figma-tokens.json
```

**Figma is the studio.** It holds everything — explorations, kit leftovers, work in
progress. It is the source of truth for *design*.

**This repo is the shelf.** It holds only what has been promoted: decided, named,
accessible, and actually used. It is the source of truth for *what ships*.

**Promotion is a curated decision, never an auto-dump.** Copying Figma wholesale would
push studio bloat straight into products — the thing the shelf exists to prevent. A
promotion records the Figma alias path per token, so a later upstream change is traceable.

**Consumers pin a version** and bump deliberately, so a system update never silently
breaks product work.

> **Superseded (2026-09-20):** earlier versions of this file described a chain running
> Figma → claude.ai/design → this repo. That tool was removed from the team's workflow
> (see HISTORY.md), which left this repo with no live upstream and no promotion between
> 13 June and 20 September. The chain above replaces it.

## Open conflicts — Figma and the shelf disagree (found during the 2026-09-20 promotion)

These are **not** bugs in either place; they are decisions nobody has made yet. The shelf
keeps its existing values until each is settled, so nothing changed underfoot.

| What | Figma says | The shelf says | Why it matters |
|---|---|---|---|
| Primary hover | `interaction/primary hover` = `#404040` (a grey, inherited from the Obra/shadcn kit) | `--color-primary-hover` = green 600 `#1A9961` | Figma's value contradicts GT's green primary, and sits next to `interaction/primary active`, which *is* green. Looks like a kit leftover — likely fix upstream, not here. **Not promoted.** |
| Focus ring | `focus/ring` = `#D5DBE1` (grey) | `--color-focus-ring` = light blue `#29ABE2`, and `--shadow-focus` is a light-blue ring | Two different focus stories. Promoted as `--focus-ring-subtle` so the names don't collide while the decision is open. |
| Red family | `destructive/*` = red 500/600 `#EF4444` / `#DC2626` | `--gt-red` / `--color-danger` = rose `#E11D48` | Two reds in one system. Both now ship; one should win. |
| Muted greys | `text/secondary` + `icon/muted` = neutral `#737373` | `--color-fg-muted` = blue-grey `#4A5560`, `--gt-placeholder` = `#8C97A1` | Three greys doing one job. |
| `border/level 1` | `#F7F9FA` | same value ships as `--gt-surface-2`, a *surface* | Same colour, two categories. Worth naming once.

## How to promote from Figma (the re-sync, done right)
1. Read the target set from the Figma file `Tt32SnKvhoMDOB6YUw1QG3`, resolving each
   variable through its alias chain to a literal value (each collection has its own mode —
   resolve per collection, not with one mode id).
2. Decide per set: **promote** or **studio-only**. Kit-internal groups (`obra-shadcn-docs/`,
   `sidebar/`) stay in the studio.
3. Write the promoted tokens into **`code-tokens.css`** and **`figma-tokens.json`** together —
   they are two formats of one set and must stay equal.
4. Record the Figma alias path per token, and log any value conflict in *Open conflicts*
   above rather than silently overwriting a shelf decision.
5. Bump the version, tag a release, note what moved.
6. Consumers update their pin when ready.
