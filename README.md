# Green Together — Design System

The **single, accessible source of truth** for the Green Together brand in code. Mirrored
from the design source (claude.ai/design + Figma) into this org repo **so the whole team
can actually open it** — not locked to one person's individual plan, and not eyeballing Figma.

> **What's the source of truth?** *Design* happens upstream (claude.ai/design + Figma).
> **This repo is the canonical code form** — the full guidelines + tokens, re-synced and
> versioned (`VERSION.md`). Consumers (the prototype, the admin app, anything in Lovable)
> pin a version and bump on their own schedule. Design-system updates and product updates
> run on separate cadences.

---

## See it

- **The complete written system:** **[`GUIDELINES.md`](./GUIDELINES.md)** — every rule:
  brand language, voice, palette, type scale, spacing, radius, shadows, motion, iconography.
- **At-a-glance spec:** **[`SKILL.md`](./SKILL.md)**.
- **The components, live and in use:** the **Sam admin prototype** —
  **https://sam-r4-prototype.netlify.app** — is a full app built on this system (buttons,
  cards, badges, inputs, tabs, dialogs, tables, charts, KPI cards…). It's the best way to
  *see* the components applied, far more than static swatches.

---

## How to apply it (two ways)

### Option A — Prompt / paste (fastest, for Lovable)
1. Copy the block in **[`PROMPT.md`](./PROMPT.md)** into your Lovable prompt as the design direction.
2. Paste the contents of **`tokens.css`** so the exact colours/type/spacing are available.
3. Build screens; reference the tokens (e.g. *"cards use `--radius-lg` + `--shadow-sm`, primary buttons use `--color-primary`"*).

### Option B — Import the file (for a connected codebase)
1. Drop **`tokens.css`** into the project and import it once at the app root.
2. Load fonts + icons (see below).
3. Point Tailwind/theme at the CSS variables (`--color-primary`, `--radius-lg`, …) instead of hard-coded hex/px.

---

## The brand at a glance

**Four-colour mark — multi-colour is intentional.** Green is the *primary action* colour;
light-blue (info/focus) and dark-blue (secondary) carry equal weight in data-rich screens;
yellow is a sparing accent.

| | Hex | Token |
|---|---|---|
| Green (primary action) | `#22B573` | `--gt-green` |
| Dark blue (secondary) | `#0B618F` | `--gt-blue-dark` |
| Light blue (info / focus) | `#29ABE2` | `--gt-blue-light` |
| Yellow (accent) | `#F4A604` | `--gt-yellow` |

> **Surface A vs B.** Employee/consumer screens are green-led and may use gamification.
> The **admin / data surface is dark-blue-led**, serious, data-dense — *no gamification*.

**Type** — Geist (UI/body) · El Messiri (only the 64px display + 24px section title) · Geist Mono (data).
**Spacing** 8px base. **Radius** inputs 8 · tabs 10 · cards 16 · modals 24. **Focus** 3px light-blue ring.
**Icons** Phosphor, Regular. **No emoji**, no unicode glyphs as icons, no Lucide.
Full detail in `GUIDELINES.md`.

---

## Fonts
```bash
npm i @fontsource-variable/geist @fontsource-variable/geist-mono @fontsource/el-messiri
```
Or reference Geist / Geist Mono / El Messiri from Google Fonts.

## Icons
```bash
npm i @phosphor-icons/react
```
```jsx
import { Leaf } from '@phosphor-icons/react'
<Leaf size={20} weight="regular" />
```

---

## What's in here

| File | What it is |
|---|---|
| `GUIDELINES.md` | **The complete written design system** — every foundation + rule. |
| `SKILL.md` | At-a-glance spec / agent skill. |
| `tokens.css` | All design tokens (colours, type, spacing, radius, shadows, motion). |
| `PROMPT.md` | Paste-ready design-system block for Lovable / AI prompts. |
| `VERSION.md` | Provenance + the re-sync / cadence model. |

**Still to mirror in** (live in the claude.ai/design project; tracked in `VERSION.md`):
`tokens.json` (Figma Tokens Studio), the `ui_kits/web/` React component kit, the `preview/`
component cards, and `assets/` (logos + Phosphor icon SVGs). Fonts and icons are consumed via
npm (above), so they aren't vendored here.
