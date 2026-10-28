# Green Together — Design System

The **single, accessible source of truth** for the Green Together brand in code — open to the
whole team, not locked to one person's plan and not eyeballed from Figma.

**▶ See the system (live):** **https://greentogetherapp.github.io/green-together-design-system/**
— colours, tokens and type rendered live from this repo. What you see is what ships.

> **Studio → shelf.** *Figma* is the **studio** — where design is explored and decided.
> **This repo is the approved *shelf*** — only the decided, named, accessible things, in code
> form (tokens + guidelines, versioned in `VERSION.md`). A **promote** step moves studio → shelf;
> **apps only consume from the shelf**, so Figma exploration never leaks into production. Design
> and product bump on separate cadences.

---

## See it

- **Live system page:** **https://greentogetherapp.github.io/green-together-design-system/** —
  the window into the shelf: colours by role with live contrast, the Surface A/B switch, install.
- **The complete written system:** **[`GUIDELINES.md`](./GUIDELINES.md)** — every rule:
  brand language, voice, palette, type scale, spacing, radius, shadows, motion, iconography.
- **At-a-glance spec:** **[`SKILL.md`](./SKILL.md)**.
- **A full app built on it:** the Sam admin prototype — **https://sam-r4-prototype.netlify.app** —
  the system applied in a real surface.

---

## How to apply it (three ways)

### Option A — Prompt / paste (fastest, for Lovable)
1. Copy the block in **[`PROMPT.md`](./PROMPT.md)** into your Lovable prompt as the design direction.
2. Paste the contents of **`code-tokens.css`** so the exact colours/type/spacing are available.
3. Build screens; reference the tokens (e.g. *"cards use `--radius-lg` + `--shadow-sm`, primary buttons use `--color-primary`"*).

### Option B — Import the file (for a connected codebase)
1. Drop **`code-tokens.css`** into the project and import it once at the app root.
2. Load fonts + icons (see below).
3. Point Tailwind/theme at the CSS variables (`--color-primary`, `--radius-lg`, …) instead of hard-coded hex/px.

### Option C — Install as a package + Tailwind preset (recommended for code prototypes/apps)
The repo is a package (`@greentogether/design-system`). Pin a version so you never drift:
```jsonc
// package.json
"@greentogether/design-system": "github:GreenTogetherApp/green-together-design-system#v1.4.0"
```
```css
/* app root css — the tokens, incl. the [data-surface] overrides */
@import '@greentogether/design-system/code-tokens.css';
```
```js
// tailwind.config.cjs — the bridge: maps primary/background/border/... to the DS vars
module.exports = { presets: [require('@greentogether/design-system/tailwind')], content: [/* ... */] };
```
Then use plain semantic classes (`bg-primary`, `text-foreground`, `bg-primary/10`) and set
`data-surface="a"|"b"` on the root to switch Surface A (Maya) ↔ Surface B (Sam). The preset
uses `color-mix()` so opacity modifiers work off the *live* token — no hardcoded hex, no drift.

**Tailwind v4?** Skip the JS preset and use the CSS-first theme instead (same names, same values):
```css
/* app root css — in this order */
@import 'tailwindcss';
@import '@greentogether/design-system/code-tokens.css';
@import '@greentogether/design-system/tailwind-v4.css';
```
Tailwind v4 adds the opacity modifiers itself, so `bg-primary/10` still follows the live token and
the `data-surface` switch. Keep `tailwind.cjs` and `tailwind-v4.css` in step: a name added to one is
added to the other.

---

## The brand at a glance

**Four-colour mark — multi-colour is intentional.** The **primary action colour is
surface-scoped** (see below): green on the individual/employee surface, **dark blue on the
admin/business surface**. Light-blue is info/focus throughout; yellow is a sparing accent.

| | Hex | Token |
|---|---|---|
| Green | `#22B573` | `--gt-green` — brand anchor, *savings / positive delta*. Surface A primary is green 800 `#0F5C3A` (AAA) |
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
**Spacing** 8px base. **Radius** inputs 8 · tabs 10 · cards 16 (8 on Surface B) · modals 24. **Focus** 3px neutral ring.
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
| `VERSION.md` | maintainers | Changelog + the studio→shelf promote cadence. |

> **`code-tokens.css` and `figma-tokens.json` hold the identical token values** — one for code,
> one for Figma. They are the **shelf** — filled by promotion, not hand-edited as a master.

**Components** aren't vendored here as a competing source yet — see the live page + the prototype
above so a partial/stale copy never drifts from the real thing. Fonts and icons are consumed via
npm (above), so they aren't vendored either.

---

## Provenance — where the truth comes from

```
Figma (studio)  ──promote: decided · named · accessible──▶  this repo (approved shelf)  ──pin a version──▶  apps
  design source of truth                 curated, manual                 what actually ships
```

Figma is the design source of truth; **this repo is what ships.** Promotion is a **curated, manual
step** (the promote lane) — never an auto-dump — so undecided/bloat work in Figma can't reach apps.
Don't hand-edit `code-tokens.css` / `figma-tokens.json` as a master; they're the shelf, filled by
promotion. Changelog + cadence in `VERSION.md`.
