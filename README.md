# Green Together — Design System (code distribution)

The **code version** of the Green Together design system, so anyone building a GT
surface — the admin app, the prototype, a new feature in Lovable — can apply the same
brand reliably, without eyeballing Figma.

> **Source of truth vs. this repo.** The *design* source of truth is the
> **Green Together design system in claude.ai/design + the Figma file**. **This repo is the
> code distribution of it** — tokens and rules in a form you can paste or import. When the
> design system changes upstream, this repo is re-synced (see `VERSION.md`); consumers pin a
> version and bump on their own schedule. *Design-system updates and product updates run on
> separate cadences — that's the point.*

---

## How to apply it (two ways — pick what fits your workflow)

### Option A — Prompt / paste (fastest, for Lovable)
1. Open **`PROMPT.md`**, copy the whole block, and paste it into your Lovable prompt as the
   design direction ("Use this design system…").
2. Then paste the contents of **`tokens.css`** so the exact colors/type/spacing are available.
3. Build screens normally — tell Lovable to use the tokens (e.g. *"cards use `--radius-lg`
   and `--shadow-sm`, primary buttons use `--color-primary`"*).

### Option B — Import the file (for a connected codebase)
1. Drop **`tokens.css`** into the project (e.g. `src/styles/tokens.css`) and import it once
   at the app root.
2. Load the fonts and icons (see **Fonts** and **Icons** below).
3. Point your Tailwind/theme config at the CSS variables (e.g. `--color-primary`,
   `--radius-lg`, `--shadow-sm`). The variables *are* the system — use them everywhere
   instead of hard-coded hex/px.

Both ways consume the **same `tokens.css`**, so they stay consistent.

---

## The brand at a glance

**Four-colour mark — multi-colour is intentional.** Green is the *primary action* colour;
light-blue (info/focus) and dark-blue (secondary) carry equal weight in data-rich screens;
yellow is a sparing accent (warnings, achievements, the mark).

| | Hex | Token |
|---|---|---|
| Green (land / primary action) | `#22B573` | `--gt-green` |
| Dark blue (water / secondary) | `#0B618F` | `--gt-blue-dark` |
| Light blue (sky / info, focus) | `#29ABE2` | `--gt-blue-light` |
| Yellow (sun / accent) | `#F4A604` | `--gt-yellow` |

> **Surface A vs Surface B.** The **employee/consumer** surface (Surface A) is green-led and
> can use gamification. The **admin / data surface (Surface B)** is **dark-blue-led**, serious
> and data-dense — *no gamification*, compliance-oriented. Pick the right palette for the surface.

**Type — three families.** **Geist** (sans) for UI/body/most headings · **El Messiri**
(serif) only for the two "this matters" tiers (64px display + 24px section title) ·
**Geist Mono** for data/numbers.

**Spacing** 8px base (4px only in dense controls). **Radius** inputs/buttons 8px ·
tabs 10px · cards 16px · modals 24px · pills/avatars full. **Focus** = 3px light-blue ring
(never yellow). **Shadows** subtle (`--shadow-sm` on cards, `--shadow-lg` on modals).

**Icons** — [Phosphor](https://phosphoricons.com), **Regular** weight. No emoji in product
UI; no unicode glyphs as icons (no ★, ›, ✓ — always a Phosphor icon).

**Voice** — direct, warm, second-person. Sentence case for everything read as a sentence;
UPPERCASE only for taxonomic labels (`STATUS`, `KG CO₂E`). Always show units (`2.4 t CO₂e`,
never bare numbers; `CO₂e` with subscript, never `CO2e`).

*(Full rationale lives in the claude.ai/design system README + Figma.)*

---

## Fonts

Use the npm packages (works in Vite/React/Lovable codebases):
```bash
npm i @fontsource-variable/geist @fontsource-variable/geist-mono @fontsource/el-messiri
```
```js
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@fontsource/el-messiri/400.css'   // + 500/600/700 as needed
```
Family names: `"Geist Variable"`, `"Geist Mono Variable"`, `"El Messiri"`.

## Icons
```bash
npm i @phosphor-icons/react
```
```jsx
import { Leaf, ChartBar } from '@phosphor-icons/react'
<Leaf size={20} weight="regular" />
```

---

## What's in here
| File | What it is |
|---|---|
| `tokens.css` | All design tokens — colours, type scale, spacing, radius, shadows, motion. The implementable core. |
| `PROMPT.md` | A paste-ready design-system block for Lovable / AI prompts. |
| `VERSION.md` | Where this snapshot came from + how to re-sync / bump it. |
| `preview.html` | **Open in any browser** (no setup) to *see* the system — colours, type, components. |

> Not yet included (add when needed): `tokens.json` (Figma Tokens Studio export), component
> recreations, and the icon SVG subset — all available in the claude.ai/design project.
