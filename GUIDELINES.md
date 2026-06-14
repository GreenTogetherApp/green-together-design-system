# Green Together — Design System (full guidelines)

> A climate platform from **Climate UX** helping people and organizations turn sustainability intent into measurable action.

The source-of-truth guidelines for Green Together's product surfaces (web app, mobile,
marketing), built on a customized **shadcn/ui Pro** foundation by Obra Studio. *(Mirrored
verbatim from the claude.ai/design project so it's accessible to the whole team — see
`VERSION.md`.)*

---

## What Green Together is

**Mission.** Close the gap between climate intent and climate action. Most people want to do something; few have a clear, credible path. Green Together makes that path visible, measurable, and shared.

**Where it runs.** Live across **Singapore, Malaysia, Indonesia, the Philippines, and Australia**.

**What it does.**
- **Measure** — individuals and organizations track their footprint.
- **Act** — challenges, communities, recommended high-impact actions.
- **See impact** — visualizations of real-world impact over time.

**Taglines (use as written, no edits).**
- *Turn intent into measurable action.*
- *Climate action, made legible.*
- *Measure. Act. See the difference.*

---

## Brand language

**Logo.** The mark represents four elements of nature in a stylized, modern form:

| Element | Color | Token |
|---|---|---|
| Sun (filled half-disc + ring) | `#F4A604` | `--gt-yellow` |
| Sky (outer half-ring) | `#29ABE2` | `--gt-blue-light` |
| Land (left leaf) | `#22B573` | `--gt-green` |
| Water (right leaf) | `#0B618F` | `--gt-blue-dark` |

Each element gets its own color, so the mark always reads as multi-colored on light or dark surfaces. On colored fills the **white mono** version is used. (Logo lockups: `assets/logo-on-*.png` — once the assets are mirrored in.)

**Multi-color is intentional.** Don't recolor the four-element mark into a single colour.

---

## Content fundamentals

**Voice.** Direct, warm, second-person. Talk *to* the user, not *at* them. Climate is heavy; the product copy is not. Confident, never preachy. Spell out the action; spell out the impact.

**Tone in a sentence.** Like a friend who happens to be a climate scientist — patient, specific, never moralizing.

- **Pronouns.** `you` for the user. `we` for Green Together when explaining how the platform works. Never `users`, `consumers`, `eco-warriors`.
- **Casing.** **Sentence case** for everything read as a sentence (headings, buttons, nav). UPPERCASE only for taxonomic labels (`STATUS`, `IMPACT`, `KG CO₂E`).
- **Numbers.** Always show the unit. `2.4 t CO₂e`, not `2.4`. Use SI; spell out `tonnes` only in long-form prose.
- **Time.** Relative when fresh (`2 hours ago`), absolute when historical (`Mar 14, 2026`).
- **Imperative for actions.** `Log a meal`, not `Logging a meal`.
- **Em-dashes are fine** — but earned, not decorative.
- **No emoji in product UI.** The four-element mark is the brand expression. (Exception: opt-in social/community surfaces.)
- **No icons that pretend to be feelings** (no 🌱, no 🌍). Use the Phosphor `leaf`, `plant`, `globe` icons.

**Examples — yes / no:**

| ✅ Yes | ❌ No |
|---|---|
| Turn intent into measurable action. | Together we can save the planet 🌍 |
| You saved 4.2 kg CO₂e this week. | Great job, eco-hero! You're crushing it 💪 |
| Log a meal | Track your nutritional carbon footprint |
| 3 communities you might like | Communities recommended just for you |
| Singapore, Malaysia, Indonesia, the Philippines, Australia | APAC region |

**Numbers, dates, units (the canon).**
- CO₂e (subscript 2). Use `CO₂e`, never `CO2e`.
- `kg` for daily totals; `t` for annual or cumulative.
- Currency: local first (`$12 SGD`), USD only when comparing across markets.

---

## Visual foundations

**Palette identity.** Multi-colour, not a single dominant hue. The four brand colours appear together in the mark and across the product. **The primary action colour is surface-scoped** (see *Surfaces* below): green leads the individual/employee surface; **dark blue leads the admin/business surface**, where green is reserved for *savings / positive delta*. Light blue is info/focus throughout. Yellow is a sun accent, used sparingly for warnings, achievements, and the mark.

### Surfaces — the brand runs two

The split is by **audience and product, never by device or viewport.** A responsive admin page at 375px is still Surface B. Don't flip the palette when a screen resizes — only when you cross from one product to the other.

| | **Surface A** — individual / employee app | **Surface B** — admin / business SaaS |
|---|---|---|
| Who | a person tracking their own footprint | a CSO / sustainability lead managing an org |
| Primary action | **green** `#22B573` (`--color-primary`, default `:root`) | **dark blue** `#0B618F` (`[data-surface="b"]`) |
| Green's job | primary actions, success, savings | **savings / positive delta only** (`--color-positive`) — never a generic button |
| Feel | motivational; gamification OK | measured, credible, data-dense; **no gamification** |
| Charts | green-led (`--chart-a-*`) | dark-blue-led (`--chart-b-*`) |

**Apply Surface B** by setting `data-surface="b"` on the app root; everything inherits the dark-blue primary. **What keeps the two feeling like one brand:** the four-colour logo is constant on both, green never disappears (it earns a fixed meaning on B), and type / spacing / radius / shadows / icons are identical across both. Dark blue *differentiates* the business surface from the green-dominant eco category, and pairs naturally with the already-dark-blue Surface B chart palette.

> **Dark mode (Surface B).** The dark-blue 500 anchor is too dark on dark surfaces — lift the primary to light-blue 400 (`--brand-light-blue-400`) in dark mode for legibility.

**Type.** Three families.
- **Geist** (sans) — UI, body, most headings. The workhorse.
- **El Messiri** (serif, humanist) — reserved for **heading 00** (64px display) and **heading 3** (24px section title). The "this matters" moments; everywhere else stays Geist.
- **Geist Mono** — data, code, numeric snippets.

**Canonical scale:**

| Token | Family | Weight | Size / LH | Tracking |
|---|---|---|---|---|
| heading 00 | El Messiri | 600 | 64 / 72 | -1.5 |
| heading 1  | Geist      | 600 | 48 / 48 | -1.5 |
| heading 2  | Geist      | 600 | 30 / 30 | -1   |
| heading 3  | El Messiri | 600 | 24 / 28.8 | -1 |
| heading 4  | Geist      | 600 | 20 / 24 | 0    |
| paragraph large | Geist | 400/500/600 | 18 / 27 | 0 |
| paragraph       | Geist | 400/500/600 | 16 / 24 | 0 |
| paragraph small | Geist | 400/500/600 | 14 / 20 | 0 |
| paragraph mini  | Geist | 400/500/600 | 12 / 16 | 0 |
| caption         | Geist | 400 (UPPER) | 12 / 21 | 1.5 |
| monospaced      | Geist Mono | 400 | 16 / 24 | 0 |

**Spacing.** 8-pixel mini-unit. Half-unit (4px) only inside dense controls. Page rhythm in multiples of 8.

**Backgrounds.** App surfaces white / warm off-white (`#FFFFFF` / `#F7F9FA`) — no gradient walls. Marketing/hero uses flat colour blocks (the four brand colours). No photographic full-bleed in product; imagery is bright, natural, real-world (SE-Asian + Australian first), warm-leaning.

**No hand-drawn illustrations.** The mark is the visual signature; iconography is geometric (Phosphor). No sketched leaves / watercolour / organic textures.

**Borders & lines.** 1px `--gt-line` (`#D5DBE1`) for cards/inputs. 1px `--color-border-strong` (`#1A2026`) only in pricing/feature tables. No left-border-only accent cards.

**Cards.** White, `1px solid var(--color-border)`, `border-radius: 16px` (`--radius-lg`), `--shadow-sm`. Modals step up to `--radius-xl` (24px) + `--shadow-lg`.

**Corner radii.** Inputs/buttons 8px (`--radius`) · tabs 10px (`--radius-md`) · cards 16px (`--radius-lg`) · modals/hero 24px (`--radius-xl`) · avatars/pills full.

**Shadows.** `--shadow-xs` resting buttons/inputs · `--shadow-sm` cards · `--shadow-lg` modals. Focus = **3px light-blue ring** (`--shadow-focus`) at 30% — never yellow. No inner shadows.

**Hover / press.** Green button hover → `--gt-green-fresh` (`#1C9961`), active → `--gt-green-deep` (`#116841`). Ghost/secondary hover → `rgba(0,0,0,0.05)`. Icon-button press → scale 0.96. Links underline on hover, never at rest. Transitions 120–200ms `cubic-bezier(.2,.8,.2,1)` — no bounce.

**Transparency / blur.** Sparingly. Sticky headers may `backdrop-filter: blur(12px)` over `rgba(255,255,255,0.8)`. Modal scrim `rgba(26,32,38,0.40)`. No frosted-glass cards.

**Layout.** Page max-width 1280px desktop; mobile breakpoint 768px. Sticky top nav (64px). Sidebar on app surfaces (240px expanded / 64px collapsed). 64px page padding desktop → 32 → 16 down breakpoints. Data cards in a 12-column grid, 24px gutter.

**Motion.** Fades and slides, never bounces. Easing `cubic-bezier(.2,.8,.2,1)`. Durations 120 / 200 / 320ms. Numbers count up on first paint; progress arcs animate in 800ms; route transitions 200ms fade. No parallax in product.

---

## Iconography

**Icon set: [Phosphor](https://phosphoricons.com), Regular weight**, a ~66-icon subset. In code, use **`@phosphor-icons/react`** (`<Leaf weight="regular" />`). In static HTML the system uses the `.ph .ph-{name}` class API.

**Never** mix Phosphor weights in one surface (Regular only). **Never** substitute emoji, unicode glyphs (no ★ › ✓), or Lucide. The four-colour logo mark is the only branded illustrative element.

Inventory (subset used across the product): close, download, bell, plus, drop, trophy,
users/user, pencil, carrot, house, globe, map, calendar, leaf, star, trend-up/down, share,
envelope, recycle, lightning, cake, database, brain, eye/eye-slash, arrow-left/right,
arrows-clockwise, car/car-profile, plant, shield, question, caret-up/down/left/right,
magnifying-glass, info, warning, map-pin, lock, fork-knife, airplane-tilt, folder-minus,
file-csv, file-code, clock, thermometer, gear, check, check-circle, x, x-circle, camera,
identification-card, chart-donut, bicycle, toggle-right, wrench, shopping-bag, map-trifold.
