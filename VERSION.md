# Version & sync

## Package releases
| Tag | Date | Notes |
|---|---|---|
| **v1.4.0** | 2026-10-28 | **Figma and code agree again.** One release for the studio→shelf port-back (all 8 open conflicts settled) and the Tailwind v4 theme. **Colour:** Surface A primary is green 800 `#0F5C3A` (AAA, 8.0:1 with white; hover 900, active 950); Surface B primary is dark blue 600 `#095378` (hover 700, active 800). Secondary text `--color-fg-muted` is `#4A545F` (7:1 on white and the page and card surfaces; 6:1+ on tinted fills such as mint, Surface B soft blue and `--surface-level-2`). Rose `#E11D48` is the one red. The focus ring is one neutral (`--gt-ink-2`, light; `#FAFAFA`, dark). `--color-secondary` is now neutral grey (mint is no longer a default fill). Control borders use `--border-level-5` `#737373` (4.74:1). **Dark theme:** `[data-theme="dark"]` composes with `[data-surface]`; dark primaries lift to green 400 (A) and light blue 400 (B). **Radius:** `--radius-card` is 16 on A, 8 on B; Tailwind gains `sm`, `md`, `xl`, `full`, `card`. **Type:** heading 3 is Geist; `h1/h2/h3-serif` add El Messiri for 24px and up, words only (Surface B uses Geist for 2 and 3); `number-lg` / `number-md` are Geist; numbers are never serif. **Guardrails:** a contrast rule now fails the build if a bar slips, and a drift check compares the code with a committed snapshot of Figma's variables (`npm run drift`; the demo page has a Drift panel). **Also promoted:** `--dur-instant` / `--dur-slower`, `--ease-standard` / `--ease-exit`, `--shadow-xl` with stronger dark-mode shadows, and `--color-danger-hover`. **Breaking for consumers:** `--focus-ring-subtle` is renamed `--focus-ring`; green buttons get darker; Tailwind `rounded-sm`, `rounded-md` and `rounded-xl` now mean 6, 10 and 24 (the DS scale); Tailwind `border-input` now uses `--border-level-5` (visible control borders, 3:1+) instead of the pale default border. **Scoping:** `data-theme` and `data-surface` can now sit on any element (not only the root), nest, and combine across elements. Tailwind v4 theme (`tailwind-v4.css`) unchanged in shape. |
| **v1.3.0** | 2026-10-15 | **Week strip adopts the employee app's five day states** (Julie's `CommuteWeekStrip`), drawn with design-system tokens: `logged` (filled + check), `changed` (filled + inner ring + arrows), `today` (green outline + date), `missed` (dashed outline + date), `future` (light outline + date). Green fills move to `--color-positive-strong` so the white icons pass contrast. Adds an optional `date`, an optional `chip` (the green "Logged" confirmation) and a list `label`. Columns follow the number of days. Icons are inline SVG (no new dependency). `upcoming`, `not-logged`, `isToday` and `onDayClick` from earlier versions still work. Figma library update pending. |
| **v1.2.0** | 2026-09-28 | **First component on the shelf.** Adds `components/week-strip.tsx` (Week strip + Week day marker, promoted from the studio per issue #9) as copyable React + Tailwind source. Extends the Tailwind preset with the v1.1.0 semantic sets — `ink` `icon` `surface` `line` `interaction` `overlay` plus the three sky gradients — so components can bind them by name. Adds `--color-positive-strong` (green 700, 5.27:1 on `--surface-level-0`; green 500 measures 2.54:1 and fails the 3:1 floor for UI marks). Adds CI guardrails: token lockstep and no-raw-colour-in-components. |
| **v1.1.0** | 2026-09-20 | **First promotion from Figma.** Adds the eight semantic sets built in Figma in August — `text/` `icon/` `surface/` `border/` `interaction/` `focus/` `destructive/` `overlay/` (38 tokens) — plus the three sky gradient paint styles. Values resolved through their Figma aliases; each token records its alias path. Existing `--color-*` / `--gt-*` tokens are untouched, so consumers upgrade without visual change. |
| **v1.0.0** | 2026-07-26 | First packaged release. Adds `package.json` (`@greentogether/design-system`) + `tailwind.cjs` preset (semantic-name → DS-var bridge via `color-mix()`, surface-aware, opacity-safe). Consume via git-URL dep pinned to `#v1.0.0` — see README Option C. Token *values* unchanged from the 2026-06-13 sync. |

## This snapshot
| | |
|---|---|
| **Last promotion** | 2026-10-28, from the Figma studio file `Tt32SnKvhoMDOB6YUw1QG3` — values re-synced for colour, radius, type and dark theme (first promotion was 2026-09-20: eight semantic sets + three sky gradients) |
| **Base token values** | 2026-06-13 sync (colours, type, spacing, radius, shadows, motion) — unchanged by the 2026-09-20 promotion |
| **Contains** | `code-tokens.css` (CSS variables, for code) **and** `figma-tokens.json` (the same values in Tokens Studio format, for designers) |

> **Not on the shelf yet:** components (they live in Figma only), the full spacing / shadow
> scales, and dark-mode shadows. Each is a promotion waiting to happen, not an oversight.
> Dark mode itself shipped in v1.4.0.

### Surface-scoped primary — settled in both places (2026-06-13; Figma caught up 2026-10-28)

The team approved **dark blue `#0B618F` as the primary action colour on Surface B** (the
admin / business SaaS), with green reserved for savings / positive delta. This repo
implements it: `--color-primary` is surface-scoped (`:root` = green = Surface A;
`[data-surface="b"]` = dark blue), plus `--color-positive` (green) and the *Surfaces*
section in `GUIDELINES.md`.

**Figma now carries the split too.** The `semantic colors` collection has four modes:
Surface A light, Surface A dark, Surface B light and Surface B dark. In v1.4.0 the Surface B
primary moved to dark blue 600 (AAA); Surface A moved to green 800.

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

## Conflicts — all settled in v1.4.0 (found during the 2026-09-20 promotion)

Each of these was a decision nobody had made. They were decided on 2026-10-26 to 2026-10-28
and written into both Figma and the shelf. Kept here as the record.

| What | Settled as |
|---|---|
| Primary hover | Figma's grey hover is gone. Hover is a darker green (A: green 900, B: dark blue 700). |
| Focus ring | One neutral ring everywhere: `--gt-ink-2` (light), `#FAFAFA` (dark). |
| Red family | Rose `#E11D48`. Figma's red-500/600 repointed to rose. |
| Muted greys | `--color-fg-muted` `#4A545F` (AAA). `--gt-placeholder` `#8C97A1` is decoration only; control borders use `--border-level-5`. |
| `border/level 1` | Left as a border token; `--gt-surface-2` stays the tinted surface. Same colour, two jobs, documented. |
| Secondary | Retired as a colour name. `--color-secondary` is neutral grey with ink text, as in Figma. Dark blue is the Surface B primary only. |
| Muted surface | Neutral grey `#F5F5F5` in both. Mint is the deliberate `--color-primary-soft` tint, not a default fill. |
| Brand dark blue not published | Published in the Figma library. |

## Guardrails (enforced in CI)

`node scripts/check-guardrails.mjs` runs on every pull request and on pushes to
`main`. It enforces two rules this file used to only assert in prose:

1. **Lockstep** — every promoted token exists in both `code-tokens.css` and
   `figma-tokens.json` with the same value. Drift, a missing twin, or a typo in
   either file fails the build, naming the token and both values.
2. **No raw colour in components** — component source binds tokens; a hex or
   `rgb()` literal fails the build with the file and line. A component that
   hardcodes a colour ignores the Surface A/B switch and drifts the moment a
   token moves.

Aliases in `figma-tokens.json` (values like `{color.brand.green.500}`) are
designer-facing references, not literals, and are skipped by the comparison.

## How to promote from Figma (the re-sync, done right)
1. Read the target set from the Figma file `Tt32SnKvhoMDOB6YUw1QG3`, resolving each
   variable through its alias chain to a literal value (each collection has its own mode —
   resolve per collection, not with one mode id).
2. Decide per set: **promote** or **studio-only**. Kit-internal groups (`obra-shadcn-docs/`,
   `sidebar/`) stay in the studio.
3. Write the promoted tokens into **`code-tokens.css`** and **`figma-tokens.json`** together —
   they are two formats of one set and must stay equal.
4. Record the Figma alias path per token, and log any value conflict in a *Conflicts* table
   above rather than silently overwriting a shelf decision.
5. Bump the version, tag a release, note what moved.
6. Consumers update their pin when ready.
