## ⚠️ READ FIRST — which files to touch

**DO NOT map or edit these — they are a dead copy (nothing imports them, values are stale). Delete them as part of the migration:**
- `green-admin/src/utils/designTokens/tokenDefinitions.ts` (+ `tokenExporter.ts`)
- `staginggreentogether/src/utils/designTokens/tokenDefinitions.ts` (+ `tokenExporter.ts`)

**DO map and replace these — this is where the running app actually gets its colours:**
- `green-admin/src/index.css` → the `:root` (light), `.dark`, and `.surface-b` blocks
- `green-admin/tailwind.config.ts` → the `colors` / `fontFamily` / `borderRadius` bindings (`hsl(var(--x))`)
- the **same two files in `staginggreentogether`** — same token *structure*, **not identical**: staging is **already on Geist** (sans/serif/mono + header font) and adds `--secondary-hover` / `--tertiary-hover`

# Token map — green-admin & staginggreentogether → `@greentogether/design-system`

**Source of truth for the migration (#3).** Design-eng half = this file (#24). Eng runs the per-app migration from it.
Decisions locked 26 Oct 2026. Both apps' `tokenDefinitions.ts` are byte-identical and the live `index.css` / `tailwind.config.ts` share one token structure, so **one map covers both** — with two deltas: **staging already uses Geist** (the font decision is green-admin-only), and staging adds `--secondary-hover` / `--tertiary-hover`.

## Read this first — two things the #3 card got wrong

1. **`src/utils/designTokens/tokenDefinitions.ts` is a dead copy.** No app code imports it per GitHub code search (only its own exporter does) — **eng: confirm with a local grep before deleting.** Its values are stale (primary `#01BB58` vs the live `#22B573`). **Do not map it — retire it** (and `tokenExporter.ts`). The DS `figma-tokens.json` is the Figma bridge now.
2. **The live token layer is `src/index.css`** — `:root` (light), `.dark`, and `.surface-b` — bound by `tailwind.config.ts` as `hsl(var(--x))`. **That is what gets replaced.** Both apps have dark mode (stock shadcn dark), not just staging.

## Decisions (locked)

| # | Decision | Effect |
|---|---|---|
| 1 | **Fonts → Geist.** Body/UI `--font-sans`, headings `--font-headings` (Geist). El Messiri only for the display slot (`--font-headings-serif`). **Open Sans and Inter retired.** | **green-admin only** — staging is already on Geist. Biggest visible change *for green-admin*. |
| 2 | **"Secondary" retired as a colour name.** Name by role: **`accent`** = light-blue `#29ABE2` (`--gt-blue-light` / `--color-info`) · **B primary** = dark-blue `#0B618F` (`[data-surface="b"] --color-primary`) · **`surface-soft`** = mint `#E8F8F0` (= `--gt-green-soft` / `--color-primary-soft`). | Dissolves the Figma/DS/app three-way conflict. |
| 3 | **Tertiary lilac `#7965FF` retired.** `impact-*` aliases remap (below). | — |
| 4 | **One neutral focus ring.** Light = `--gt-ink-2 #2E363E`; dark = `--text-inverse #FAFAFA`. (2-tone white-inner/dark-outer acceptable.) Replaces app green ring, Figma grey, DS light-blue. Never matches a primary on any surface/mode. | DS change: `--color-focus-ring` becomes neutral + gains a dark value. |
| 5 | **Dark-mode primaries LIFT lighter** (from the primary-colour test): A `--brand-green-400 #3CC178`, B `--brand-light-blue-400 #45B5E5`. The app currently goes *darker* in dark mode (`152 68% 38%`) — **that flips to brighter on migration. Expected, not a bug.** | Visible in dark mode. |
| 6 | **Radius is surface-scoped**: `--radius-card` = **16px on A, 8px on B** (promoted from green-admin's `--surface-radius-default`). Component scale unchanged (inputs 8 · tabs 10 · modals 24). | Promote to DS. |
| 7 | **Promote the richer scales to the DS** (surface-invariant): heading sizes, spacing scale, motion durations + easings, `elevation-5`, dark shadow variants. | DS v2 work. |
| 8 | **Retire:** climate palette (legacy), `tokenDefinitions.ts` + `tokenExporter.ts`. | — |
| 9 | **Greys on light pass AAA (7:1).** Apps' light secondary/muted greys measure 3.0 and 2.5 on white. Secondary text → `--color-fg-muted`, nudged `#4A5560` → `#4A545F` in v1.4.0 so it holds 7:1 on white, `#F7F9FA`, `#FAFAFA`, `#F5F5F5` and mint `#E8F8F0` (`#4A5560` dips to 6.9 on the last two). `--color-fg-subtle #8C97A1` (3.0:1) is never text — borders and non-text only; placeholders use `--color-fg-muted`. | Visible: secondary text darker in light mode |
| 10 | **Red = rose `#E11D48` (`--color-danger`).** Figma's `general/destructive` (red-600 `#DC2626`) is repointed to rose, light and dark. | Figma change, no app change |
| 11 | **Primary on Surface A = green 800 `#0F5C3A` (AAA, 7.7:1 with the `#FAFAFA` label).** Hover green 900, pressed green 950. Dark mode stays green 400 `#3CC178`. Figma's Button already ships this (27 Oct). | DS change in v1.4.0: `--color-primary` / `-hover` / `-active`. Visible: every green button is darker. |
| 12 | **Mint is not a default fill.** Figma's `general/secondary` and `general/accent` move from mint `#E8F8F0` to neutral `#F5F5F5` (`--color-bg-muted`), their labels to ink, `interaction/secondary hover` to `#E5E5E5`. Mint survives only as the deliberate `surface-soft` tint. `--color-secondary` (dark blue) is retired. | Figma change done 27 Oct. Visible: secondary buttons, Badge secondary and selected tabs turn grey. |
| 13 | **Radius names follow the DS scale.** `radius-xs` 4 · `-sm` 6 · `radius` 8 · `-md` 10 · `-lg` 16 · `-xl` 24 · `-full`. Figma's shadcn names (`rounded-lg` 8, `rounded-xl` 12) are renamed `legacy/*` and every component corner is rebound by pixel value. Off-scale radii (12, 18, 2, 3, 5, 999) were moved to the nearest role. Button has one shape: no `Roundness=Round`. | Figma change done 27 Oct. No app change. |
| 14 | **Surface B primary is dark blue 600 `#095378`, not 500.** AAA with white (8.0:1; 500 measured 6.5:1). Hover 700, active 800. Dark: light blue 400 `#45B5E5`. | DS change shipped in v1.4.0 (`[data-surface="b"]`). |
| 15 | **Type: one scale, El Messiri for words at 24px and up.** Heading 3 is Geist; `h1/h2/h3-serif` are the El Messiri versions; Surface B swaps 2 and 3 serif to Geist. Numbers are always Geist (`number-lg`, `number-md`). | Shipped in v1.4.0. Figma modes Surface A / Surface B carry it. |
| 16 | **Control borders are `--border-level-5` `#737373`** (4.74:1). `--gt-placeholder` and `--border-level-4` (2.98:1) are decoration only. | Shipped in v1.4.0 as guidance; contrast guardrail enforces the bars. |

Flags used below: `✅ exact` · `↔ rename` · `⚠ value drift (DS wins)` · `❌ gap in DS → promote` · `🗑 retire`

## Colour — brand & semantic (light `:root`)

| Local | Value | → DS | Flag |
|---|---|---|---|
| `--primary` | `152 68% 42%` ≈ `#22B573` | `--color-primary` | ✅ (decision 11: A primary moves to green 800 — a DS change) |
| `--primary-foreground` | white | `--color-primary-fg` | ✅ |
| `--primary-light` | `152 68% 55%` | `--brand-green-400` | ↔ |
| `--primary-hover` | `152 68% 30%` | `--color-primary-hover` (green 600) | ⚠ |
| `--primary-dark` | `152 68% 35%` | `--color-primary-active` (green 800) | ⚠ |
| `--secondary` | `197 76% 52%` ≈ `#29ABE2` | **`accent`** → `--color-info` / `--gt-blue-light` | ↔ (decision 2) |
| `--secondary-foreground` | white | `--color-primary-fg` | ✅ |
| `--tertiary` / `-foreground` | lilac `#7965FF` | — | 🗑 (decision 3) |
| `--destructive` | `347 77% 50%` = `#E11D48` | `--color-danger` | ✅ live app + DS agree on rose |
| `--destructive-foreground` | white | `#FFFFFF` | ✅ |
| `--destructive-hover` | `340 80% 28%` | — | ❌ promote `--color-danger-hover` |
| `--ring` | green (= primary) | `--color-focus-ring` **(neutral)** | ⚠ decision 4 |
| `--dark-blue` | `199 86% 30%` = `#0B618F` | `--gt-blue-dark` | ✅ |

## Colour — shadcn surfaces (light)

| Local | → DS | Flag |
|---|---|---|
| `--background` | `--color-bg` | ✅ |
| `--foreground` `220 13% 13%` | `--color-fg #1A2026` | ⚠ minor |
| `--foreground-secondary` | `--color-fg-muted` | ↔ |
| `--card` / `--card-foreground` | `--color-bg` / `--color-fg` | ↔ |
| `--popover` / `--popover-foreground` | `--color-bg` / `--color-fg` | ↔ |
| `--muted` `220 14% 96%` | `--color-bg-muted #F5F5F5` | ⚠ minor |
| `--muted-foreground` `210 10% 59%` (`#8C96A1`, **3.0:1 on white — fails AA**) | `--color-fg-muted` (**AAA**: `#4A545F` in v1.4.0, ≥7:1 on every light surface) | ⚠ DS wins — secondary text gets darker on purpose. `--color-fg-subtle` is for placeholders and non-text only |
| `--accent` `152 68% 96%` (mint tint) | `--color-primary-soft` (**surface-soft**) | ✅ |
| `--accent-foreground` | `--color-fg` | ↔ |
| `--border` `220 13% 91%` | `--color-border #D5DBE1` | ⚠ minor |
| `--input` | `--color-border` | ↔ |

## Colour — neutrals

| Local | → DS | Flag |
|---|---|---|
| `--neutral-ink` `#22272A` | `--gt-ink #1A2026` | ⚠ minor |
| `--neutral-snow` `#F9FAFB` | `--gt-surface-2 #F7F9FA` | ⚠ minor |
| `--neutral-frost` | `--color-bg-subtle` | ↔ |

## Semantic aliases

| Local | → DS | Flag |
|---|---|---|
| `--action-primary` | `--color-primary` (`interaction-*`) | ↔ |
| `--action-secondary` | **accent** `--color-info` | ↔ |
| `--action-disabled` | `--color-disabled-bg` | ✅ |
| `--action-focus` | `--color-focus-ring` | ↔ |
| `--status-success` / `-error` / `-warning` | `--color-success` / `--color-danger` / `--color-warning` | ✅ |
| `--feedback-positive` / `-informational` / `-warning` | `--color-positive` / `--color-info` / `--color-warning` | ✅ |
| `--impact-primary` (was tertiary) | `--color-positive` | ⚠ remapped (decision 3) |
| `--impact-secondary` | `--color-info` | ↔ |
| `--progress-active` / `-completed` / `-upcoming` | `--color-primary` / `--color-positive-strong` / `--color-bg-muted` | ❌ no progress tokens in DS — map as shown or promote |
| `--text-primary` / `-inverse` | `--text-primary` / `--text-inverse` | ✅ (exist in DS) |
| `--text-secondary` | `--text-secondary` | ⚠ (`#737373` vs app muted-fg) |
| `--text-muted` `220 9% 65%` (`#9EA3AE`, 2.5:1 — fails AA) | `--color-fg-muted` | ⚠ DS wins — do not use `--color-fg-subtle` for text |
| `--surface-app-background` / `-card` | `--color-bg` | ↔ |
| `--surface-elevated` `0 0% 98%` | `--gt-surface-2` | ↔ |
| `--surface-divider` | `--color-border` | ↔ |
| `--surface-bg-tint` | `--color-primary-soft` | ↔ |
| `--surface-card-shadow` | `--shadow-sm` (A) / `none` (B) | ↔ surface-scoped |
| `--surface-card-border-*` | B-only 1px `--color-border` | ↔ surface-scoped |
| `--surface-header-font` | `--font-headings` (Geist); El Messiri → `--font-headings-serif` | ⚠ decision 1 — **Inter retired** |
| `--surface-icon-color` / `-size` | `--icon-*` (v1.1) / `--icon-size` | ↔ / ❌ size |
| `--surface-radius-default` | **`--radius-card`** (16 A / 8 B) | ❌ promote (decision 6) |
| `--layout-screen-padding` 16 / `-card-padding` 16 / `-section-gap` 24 / `-stack-gap` 8 / `-inline-gap` 8 | spacing scale | ❌ promote with spacing |

## Chart (near 1:1)

| Local | → DS | Flag |
|---|---|---|
| `--chart-1..8` (light / `.surface-b`) | `--chart-a-1..8` / `--chart-b-1..8` | ✅ values match stop-for-stop |
| `--chart-seq-1..5` | `--seq-1..5` | ✅ |
| `--chart-div-neg-2` / `-neg-1` / `-neu` / `-pos-1` / `-pos-2` | `--div-negative` / `--div-warning` / `--div-neutral` / `--div-positive-1` / `--div-positive-2` | ✅ |
| `--chart-success/warning/error/neutral/target/info` | same names in DS | ✅ |

## Climate palette (legacy) — 🗑 retire

`climate-blue`→`--gt-blue-light` · `climate-green`→`--gt-green` · `climate-teal`→`--chart-a-3 #2CBFB2` · `climate-orange`→`--gt-orange` (⚠ `#F97316`→`#F54A00`) · `climate-mint`→`--gt-green-soft` · `climate-sage`→`--brand-green-50`. Replace usages, then delete.

## Type

| Local | → DS | Flag |
|---|---|---|
| sans **Open Sans** (green-admin; staging already Geist) | `--font-sans` (Geist) | ⚠ decision 1 — green-admin only |
| h1 40 / h2 32 / h3 24 / h4 20 | — | ❌ promote `--h1-size … --h4-size` |
| body 16 / caption 14 / small 12 | `--p-size` / `--p-small-size` / `--p-mini-size` | ✅ |
| weights 400 / 500 / 600 | `--p-weight` / `--p-medium-weight` / `--p-bold-weight` | ✅ (700 → gap, minor) |

## Spacing · Radius · Elevation · Motion

| Local | → DS | Flag |
|---|---|---|
| `--space-xs` 4 / `-xl` 32 | `--space-1` / `--space-6` | ✅ |
| `--space-s` 8 / `-m` 16 / `-l` 24 / `-2xl` 48 · `--spacing-4…64` | — | ❌ promote the scale |
| `--radius` 8px | `--radius` | ✅ |
| `--surface-radius-default` 16/8 | `--radius-card` (surface-scoped) | ❌ promote |
| `--elevation-1` | `--shadow-xs` | ✅ |
| `--elevation-2/3/4` | `--shadow-sm/md/lg` | ⚠ minor |
| `--elevation-5` · `.dark` elevation variants | — | ❌ promote |
| `--motion-duration-instant/fast/normal/slow/slower` (50–400ms) | — | ❌ promote |
| `--motion-easing-standard/enter/exit/spring` | `--ease` / `--ease-spring-soft` (approx) | ↔ ⚠ promote names |

## Dark mode (`.dark`) — ✅ shipped in v1.4.0 as `[data-theme="dark"]`

The DS now ships a `[data-theme="dark"]` block, composable with `[data-surface]`, built from the Figma `Surface A dark` / `Surface B dark` modes with the decided primaries layered on. The app values below map to it:

| Local `.dark` | Value | → DS dark |
|---|---|---|
| `--background` / `--card` | `222 84% 5%` `#020817` | dark `--color-bg` (branded alt: `--brand-dark-blue-950 #02131F`) |
| `--muted` / `--border` / `--input` | `217 32% 17%` | dark `--color-bg-muted` / `--color-border` |
| `--foreground` | `210 40% 98%` | dark `--color-fg` |
| `--muted-foreground` | `215 20% 65%` | dark `--color-fg-muted` |
| `--primary` | `152 68% 38%` (darker) | **A `#3CC178` · B `#45B5E5`** — lifts lighter (decision 5) |
| `--ring` | green | neutral `--text-inverse #FAFAFA` (decision 4) |
| `--destructive` | `347 77% 40%` | dark `--color-danger` |
| elevation dark variants | — | promote |

## Surface B (`.surface-b`) ↔ `[data-surface="b"]`

Already matches the DS model: primary `#0B618F` ✅, charts dark-blue-led ✅, radius 8 (→ `--radius-card`), cards 1px border/no shadow, **header font Inter → Geist** (decision 1), icons grey.

## Migration order (eng, per app)

1. Add the dependency, pinned: `"@greentogether/design-system": "github:GreenTogetherApp/green-together-design-system#v1.x"`.
2. Swap `tailwind.config.ts` colours to the DS preset (`presets: [require('@greentogether/design-system/tailwind')]`). The app binds `hsl(var(--x))` HSL triplets; the DS ships hex vars — the preset's `color-mix()` bridge keeps opacity modifiers working. Drop the HSL layer rather than shimming it.
3. Replace the `:root` / `.dark` / `.surface-b` var blocks with `@import '@greentogether/design-system/code-tokens.css'`; `.surface-b` → `data-surface="b"`, `.dark` → `data-theme="dark"`.
4. Rename classes per the tables; replace climate-palette usages; delete `tokenDefinitions.ts` + `tokenExporter.ts`.
5. Run the DS guardrails green (lockstep + no raw colour).

**Visible changes to expect:** fonts → Geist (green-admin only) · dark-mode primaries brighter · focus ring neutral · Surface B radius 8 · tertiary lilac gone.

**DS promotions that had to land first (v2).** Landed in v1.4.0: dark theme block · `--radius-card` · heading sizes and serif rules · neutral `--color-focus-ring` · "secondary" retired (now neutral). Also landed: motion durations and easings (`--dur-instant`, `--dur-slower`, `--ease-standard`, `--ease-exit`), `--shadow-xl` with dark-mode shadows (app `--elevation-1..5` → `--shadow-xs/sm/md/lg/xl`), and `--color-danger-hover`. Nothing from the v2 list is left to promote.
