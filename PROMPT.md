# Lovable / AI prompt block

Copy everything in the box below into your Lovable prompt as the design direction, then
paste `code-tokens.css` after it. *(`code-tokens.css` is the developer/CSS form of the
tokens; `figma-tokens.json` is the same values in Figma Tokens Studio format for designers.)*

---

```
Apply the Green Together design system. Follow these rules exactly.

PALETTE (multi-colour, not one dominant hue):
- Primary action: green #22B573 (hover #1A9961, active #0F5C3A), text on it white.
- Secondary / data surfaces: dark blue #0B618F.
- Info + focus: light blue #29ABE2.
- Accent (warnings, achievements, sparingly): yellow #F4A604.
- Danger: #E11D48. Neutrals: text #1A2026, secondary text #4A5560, borders #D5DBE1,
  base surface #FFFFFF, tinted surface #F7F9FA.
- SURFACE RULE: employee/consumer screens are green-led and may use gamification; ADMIN /
  data screens are dark-blue-led, serious and data-dense — NO gamification, compliance-oriented.

TYPE (three families):
- Geist (sans): UI, body, most headings.
- El Messiri (serif): ONLY for the hero display (≈64px) and section titles (≈24px) — the
  "this matters" moments. Everywhere else stays Geist.
- Geist Mono: numbers, data, code.
- Sentence case for anything read as a sentence (headings, buttons, nav). UPPERCASE only
  for taxonomic labels (STATUS, KG CO₂E).

LAYOUT & SHAPE:
- 8px spacing system (4px only inside dense controls).
- Radius: inputs/buttons 8px, tabs 10px, cards 16px, modals 24px, pills/avatars full.
- Cards: white, 1px #D5DBE1 border, 16px radius, subtle shadow.
- Focus: 3px light-blue ring (#29ABE2 at ~30%), never yellow.
- Backgrounds are white / warm off-white — no gradient walls.

ICONS: Phosphor icons, Regular weight only. No emoji in product UI. No unicode glyphs as
icons (no ★, ›, ✓) — always a Phosphor icon. The four-colour logo mark is the only
illustrative brand element.

VOICE: direct, warm, second-person ("you" for the user, "we" for Green Together). Confident,
never preachy. Always show units (e.g. "2.4 t CO₂e", never a bare number; write CO₂e with a
subscript 2, never "CO2e"). Imperative for actions ("Log a meal", not "Logging a meal").

Use the CSS variables from the tokens file I'm pasting next — reference them
(--color-primary, --radius-lg, --shadow-sm, etc.) instead of hard-coded values.
```

---

Then paste the full contents of **`code-tokens.css`** right after, so the exact token values
are available to reference.
