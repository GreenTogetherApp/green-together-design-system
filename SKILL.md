<!-- Mirrored from the claude.ai/design project "Green Together Design System" so the whole
     team can use it. In THIS repo: the tokens are in `tokens.css` (= the project's
     `colors_and_type.css`). The `assets/` (icons, logos, fonts) and `ui_kits/web/` referenced
     below live in the design-system project; in code, load fonts via @fontsource / Google Fonts
     and icons via @phosphor-icons/react (see README "Fonts" + "Icons"). -->

---
name: green-together-design
description: Use this skill to generate well-branded interfaces and assets for Green Together — a climate platform from Climate UX helping people and organizations turn sustainability intent into measurable action. Live across Singapore, Malaysia, Indonesia, the Philippines, and Australia. Contains the essential design guidelines, colors, type, fonts, logos, iconography, and a working web UI kit for prototyping.
user-invocable: true
---

# Green Together design — at a glance

**The brand**
- Mission: *Close the gap between climate intent and climate action.*
- Voice: direct, warm, second-person. Talk to the user. No emoji in product UI.
- Taglines (use verbatim): *Turn intent into measurable action.* · *Climate action, made legible.* · *Measure. Act. See the difference.*

**The marks**
- Four-element logo: sun (yellow `#F4A604`), sky (light blue `#29ABE2`), land (green `#22B573`), water (dark blue `#0B618F`).
- Always use the canonical PNGs in `assets/logo-on-*.png`. Never recolor the four-element mark.

**The palette**
- Primary action / success: **`#22B573`** green (hover `#1C9961`, active `#116841`).
- Secondary: **`#0B618F`** dark blue.
- Info / focus: **`#29ABE2`** light blue.
- Warning / accent: **`#F4A604`** yellow.
- Danger: **`#E11D48`** red.
- Ink `#1A2026`, text-2 `#4A5560`, placeholder `#8C97A1`, line `#D5DBE1`, surface-2 `#F7F9FA`.

**The type stack** (Google Fonts, OFL)
- **Geist** (sans) — body, UI, most headings.
- **El Messiri** (serif) — reserved for *heading 00* (64px display) and *heading 3* (24px section title). Not used anywhere else.
- **Geist Mono** — data, code.

**Iconography**: Phosphor, Regular weight only. In code use `@phosphor-icons/react`. **Do not introduce Lucide. No emoji. No unicode glyphs as icons.**

**Spacing**: 8-pixel mini-unit. Steps: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.

**Corners**: inputs/buttons 8px, tabs 10px, cards 16px, modals 24px.

**Shadows**: card uses `--shadow-sm`; modals use `--shadow-lg`; focus ring is a 3px light-blue ring at 30% opacity — never yellow.

**Motion**: fades and slides only. Easing `cubic-bezier(.2,.8,.2,1)`. 120 / 200 / 320 ms.

---

## How to use this skill

1. Read `GUIDELINES.md` (full content/visual/iconography fundamentals).
2. Import `tokens.css` in any HTML you generate — it provides all the tokens (`--gt-green`, `--font-sans`, `--h00-size`, etc.).
3. For UI components, lift directly from `ui_kits/web/` (in the design-system project) — modular, reusable JSX.
4. Copy logos from `assets/` — don't redraw them.
5. For icons, use `@phosphor-icons/react` (Regular). Never substitute emoji, unicode glyphs, or Lucide.

## Output guidance

- Slides, prototypes, mocks → static HTML with `<link rel="stylesheet" href="tokens.css">`.
- Production handoff → copy the tokens and reference Geist + El Messiri + Geist Mono from Google Fonts / @fontsource.
- **No fabricated content.** Don't pad with extra sections or fake stats unless asked.
- **No new visual motifs.** No bluish-purple gradients, no emoji, no left-border-only cards. The four-color mark is the brand expression.

## Content rules (the canon)

- `CO₂e` (subscript 2). Never `CO2e`.
- `kg` for daily totals; `t` for annual/cumulative.
- Sentence case for everything read as a sentence. UPPERCASE only for taxonomic labels.
- Imperative for actions: *Log a meal*, not *Logging a meal*.
- Pronouns: `you` for the user, `we` for the platform. Never *users*, *consumers*, *eco-warriors*.
