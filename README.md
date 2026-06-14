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
2. Paste the contents of **`code-tokens.css`** so the exact colours/type/spacing are available.
3. Build screens; reference the tokens (e.g. *"cards use `--radius-lg` + `--shadow-sm`, primary buttons use `--color-primary`"*).

### Option B — Import the file (for a connected codebase)
1. Drop **`code-tokens.css`** into the project and import it once at the app root.
2. Load fonts + icons (see below).
3. Point Tailwind/theme at the CSS variables (`--color-primary`, `--radius-lg`, …) instead of hard-coded hex/px.

---

## The brand at a glance

**Four-colour mark — multi-colour is intentional.** The **primary action colour is
surface-scoped** (see below): green on the individual/employee surface, **dark blue on the
admin/business surface**. Light-blue is info/focus throughout; yellow is a sparing accent.

| | Hex | Token |
|---|---|---|
| Green | `#22B573` | `--gt-green` — Surface A primary; *savings / positive delta* everywhere |
| Dark blue | `#0B618F` | `--gt-blue-dark` — Surface B primary |
| Light blue (info / focus) | `#29ABE2` | `--gt-blue-light` |
| Yellow (accent) | `#F4A604` | `--gt-yellow` |

> **Two surfaces — split by audience/product, never by device.** A responsive admin page at
> 375px is still Surface B. Don't flip the palette on resize, only when crossing products.
> - **Surface A** — individual/employee app: **green** primary, motivational, gamification OK. (`:root` default.)
> - **Surface B** — admin/business SaaS (the CSO dashboard): **dark-blue** primary, serious, data-dense, *no gamification*. Green is reserved for savings / positive delta. Set `data-surface="b"` on the root.
>
> The four-colour logo, type, spacing, radius and icons are identical on both — that's the brand thread. Full detail in [`GUIDELINES.md`](./GUIDELINES.md) → *Surfaces*.

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

Filenames are deliberately descriptive so the **same tokens in two formats** never get
conflated — `code-tokens.css` (the developer/CSS form) vs `figma-tokens.json` (the designer/Figma form):

| File | Who it's for | What it is |
|---|---|---|
| `GUIDELINES.md` | everyone | **The complete written design system** — every foundation + rule. |
| `SKILL.md` | everyone / agents | At-a-glance spec / agent skill. |
| `code-tokens.css` | **developers** | All design tokens as **CSS variables** (CSS / Tailwind / Lovable). |
| `figma-tokens.json` | **designers** | The **same** tokens in **Figma Tokens Studio** format (import into Figma). |
| `PROMPT.md` | Lovable / AI | Paste-ready design-system block for prompts. |
| `VERSION.md` | maintainers | Provenance + the re-sync / cadence model. |

> **`code-tokens.css` and `figma-tokens.json` hold the identical token values** — one for code,
> one for Figma. Edit neither by hand as a master; both are mirrors re-synced from upstream
> (see provenance below + `VERSION.md`).

**Components** are not vendored here as a competing source — **see them live and in use in the
prototype** (link above) to avoid a partial/stale copy drifting from the real thing. Fonts and
icons are consumed via npm (above), so they aren't vendored either. Logos + Phosphor icon SVGs
live in the claude.ai/design project (tracked in `VERSION.md`).

---

## Provenance — where the truth comes from

```
Figma  ──(Figma MCP: adjust a component)──▶  claude.ai/design  ──(re-sync)──▶  this repo
 │                                            (spec + merge =                   (the CODE +
 │                                             DESIGN source of truth)           Figma-format mirror)
 └─ known gap: Figma ⇄ claude.ai sync is still manual — flagged for the team.
```

Edit **upstream**, then re-sync here — don't hand-edit `code-tokens.css` / `figma-tokens.json`
as if they were the master. The same provenance note is in the header of `code-tokens.css`.
