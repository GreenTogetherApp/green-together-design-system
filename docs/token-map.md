## ⚠️ READ FIRST — which files to touch

**DO NOT map or edit these — they are a dead copy (nothing imports them, values are stale). Delete them as part of the migration:**
- `green-admin/src/utils/designTokens/tokenDefinitions.ts` (+ `tokenExporter.ts`)
- `staginggreentogether/src/utils/designTokens/tokenDefinitions.ts` (+ `tokenExporter.ts`)

**DO map and replace these — this is where the running app actually gets its colours:**
- `green-admin/src/index.css` → the `:root` (light), `.dark`, and `.surface-b` blocks
- `green-admin/tailwind.config.ts` → the `colors` / `fontFamily` / `borderRadius` bindings (`hsl(var(--x))`)
- the **same two files in `staginggreentogether`** (they are identical to green-admin's)

# Token map — green-admin & staginggreentogether → `@greentogether/design-system`

**Source of truth for the migration (#3).** Design-eng half = this file (#24). Eng runs the per-app migration from it.
Decisions locked 26 Oct 2026. Both apps' local token files are byte-identical, so **one map covers both.**

## Read this first — two things the #3 card got wrong

1. **`src/utils/designTokens/tokenDefinitions.ts` is a dead copy.** Nothing in app code imports it (only its own exporter does). Its values are stale (primary `#01BB58` vs the live `#22B573`). **Do not map it — retire it** (and `tokenExporter.ts`). The DS `figma-tokens.json` is the Figma bridge now.
2. **The live token layer is `src/index.css`** — `:root` (light), `.dark`, and `.surface-b` — bound by `tailwind.config.ts` as `hsl(var(--x))`. **That is what gets replaced.** Both apps have dark mode (stock shadcn dark), not just staging.

## Decisions (locked)

| # | Decision | Effect |
|---|---|---|
| 1 | **Fonts → Geist.** Body/UI `--font-sans`, headings `--font-headings` (Geist). El Messiri only for the display slot (`--font-headings-serif`). **Open Sans and Inter retired.** | Biggest visible change. |
| 2 | **"Secondary" retired as a colour name.** Name by role: **`accent`** = light-blue `#29ABE2` (`--gt-blue-light` / `--color-info`) · **B primary** = dark-blue `#0B618F` (`[data-surface="b"] --color-primary`) · **`surface-soft`** = mint `#E8F8F0` (= `--gt-green-soft` / `--color-primary-soft`). | Dissolves the Figma/DS/app three-way conflict. |
| 3 | **Tertiary lilac `#7965FF` retired.** `impact-*` aliases remap (below). | — |
| 4 | **One neutral focus ring.** Light = `--gt-ink-2 #2E363E`; dark = `--text-inverse #FAFAFA`. (2-tone white-inner/dark-outer acceptable.) Replaces app green ring, Figma grey, DS light-blue. Never matches a primary on any surface/mode. | DS change: `--color-focus-ring` becomes neutral + gains a dark value. |
| 5 | **Dark-mode primaries LIFT lighter** (from the primary-colour test): A `--brand-green-400 #3CC178`, B `--brand-light-blue-400 #45B5E5`. The app currently goes *darker* in dark mode (`152 68% 38%`) — **that flips to brighter on migration. Expected, not a bug.** | Visible in dark mode. |
| 6 | **Radius is surface-scoped**: `--radius-card` = **16px on A, 8px on B** (promoted from green-admin's `--surface-radius-default`). Component scale unchanged (inputs 8 · tabs 10 · modals 24). | Promote to DS. |
| 7 | **Promote the richer scales to the DS** (surface-invariant): heading sizes, spacing scale, motion durations + easings, `elevation-5`, dark shadow variants. | DS v2 work. |
| 8 | **Retire:** climate palette (legacy), `tokenDefinitions.ts` + `tokenExporter.ts`. | — |

Flags used below: `✅ exact` · `↔ rename` · `⚠ value drift (DS wins)` · `❌ gap in DS → promote` · `🗑 retire`

## Colour — brand & semantic (light `:root`)

| Local | Value | → DS | Flag |
|---|---|---|---|
| `--primary` | `152 68% 42%` ≈ `#22B573` | `--color-primary` | ✅ (DS green-trim later moves A primary to 700 — a DS change) |
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
| `--muted-foreground` `210 10% 59%` | `--color-fg-subtle #8C97A1` | ✅ |
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
| `--text-muted` | `--color-fg-subtle` | ↔ |
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
| sans **Open Sans** | `--font-sans` (Geist) | ⚠ decision 1 |
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

## Dark mode (`.dark`) — ❌ DS gap → promote

DS has no dark tokens; Figma has a `shadcn-dark` mode (the same stock origin as the app's). Promote it as a `[data-theme="dark"]` block, composable with `[data-surface]`, with the decided primaries layered on:

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

**Visible changes to expect:** fonts → Geist · dark-mode primaries brighter · focus ring neutral · Surface B radius 8 · tertiary lilac gone.

**DS promotions that must land first (v2):** dark theme block · `--radius-card` · heading sizes · spacing scale · motion durations · `elevation-5` + dark shadows · `--color-danger-hover` · neutral `--color-focus-ring` · "secondary" → `accent` naming.
