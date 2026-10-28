# Green Together Design System — History & Decisions

A record of the system's state, the work done, and what's planned.
Authorship lives in the git history. No individuals or customer names, by design.

## Starting state (baseline)
- One shared Figma working file all team worked in — hundreds of overlapping colors and styles, unclear direction.
- A slim, pre-app brand direction: colors, a thin type scale, and some voice notes — with no clear line between what was decided and what was placeholder.
- Ungoverned typography: the guidelines set a display font and body font, but a mixture of alternates were used in practice, with no reasoning documented anywhere (~16 fonts total).
- No components.
- No defined path from design to built product — screens were marked "ready for testing" without being prototypes, and how they reached production was undocumented.
- Two separate token sets plus hardcoded values across the product repos.
- No board and no shared visibility into any of it.

## Done
- **State assessment** — separated actual decisions from filler; documented the real starting state.
- **Repo access** — obtained and used to assess implementation state.
- **GitHub board + backlog** — research findings turned into tracked cards; statuses, fields, and one shared card template across all repos.
- **Design system packaged in code** — versioned, public, installable; a Tailwind preset bridges tokens to components; anti-drift wiring (surface-scoped variables) built in.
- **Safe versioning model** — consumers pin an immutable release tag and upgrade deliberately; no surprise breakage.
- **Living design-system guide in Figma**
- **WCAG contrast method** introduced for colour decisions.
- **Surface A / Surface B model** — one app, two lenses (not two apps).
- **Shared personas linked to current research** — so the team shares one language, traceable to research. (link: TBD)
- **Prototype consolidation** — scattered prototypes gathered into one repo with a system-wired starter.
- **Coded, deployable prototypes** — live shareable URLs, as an added path alongside the Figma workflow.
- **Design → production pipeline** defined (prototype as blueprint → rebuild).
- **Removed a team-inaccessible design tool (claude.ai/design) from the workflow** so the system is team-reachable.
- **Promotion from the studio, running** — the package had drifted three months behind Figma with no live upstream. Defined studio → promote → shelf → consumers, then ran it: the semantic sets (text, icon, surface, border, interaction, focus, destructive, overlay) and the sky gradients now ship in code (v1.1.0). Each token records the Figma path it came from, and value conflicts between the two are logged as open decisions rather than silently overwritten.
- **Components on the shelf** — the first component promoted from the studio (v1.2.0): the week strip, as copyable token-bound source. State is carried by shape as well as colour, and the unsettled Mon–Fri question is a prop rather than a baked-in answer.
- **The system enforces its own rules** — CI fails the build when promoted tokens drift between the code and Figma formats, or when component source hardcodes a colour. Both rules were verified by making them fail before being trusted.

## In progress
- **DS v2** — green reserved for success; primary moved to an accessible dark green; full semantic role coverage (bg / fg / text / icon / soft / border per family); accessible values; duplicate + label cleanup. Signed off; implementation underway.
- **Single source of truth** — GitHub set as the source; reconciling a second kit (built in Figma, which carries components) back toward the repo.
- **Design ↔ code sync** — writing the intended design-tool variable changes into the token bridge so they are not held in one person's head.
- **Atmosphere "seam" concept** — the Sky / atmosphere concept plugs in via an alias + flat fallback, backgrounds/overlays only final state in code animation, so it can change or drop gracefully with no rework. (Sky itself is in testing and excluded until ready.)

## Planned
- **Repo migration** — move the product repos off hardcoded values and separate token sets onto the package.
- **Public demo page** (feature + stories: shell + auto-deploy · colours by group · Surface A/B switch · component gallery · install + version) — so the system is visible and discussable.
- **Component library** reconciled into the repo.
- **Typography governance** — consolidate the font set and resolve + document the display-font decision.
- **Token gaps** — e.g., a full error / red ramp.

## Future states
1. **One source of truth, fully migrated** — every repo pulls the package; zero hardcodes, zero drift.
2. **Design ↔ code parity** — variables and code tokens stay in sync automatically; components mapped both ways.
3. **Component library matured** — used by prototypes and products.
4. **Observable + self-guarding** — demo page live; WCAG checks run automatically in CI so accessibility can't regress.
5. **Atmosphere concept next fidelity prototype** — the brand differentiator texture.

## v1.4.0 — Figma and code back in step
- Ran the studio→shelf port-back: every open conflict between the Figma library and the shelf was settled, written into Figma and into the code package together.
- Colour: AAA primaries on both surfaces, one rose red, one neutral focus ring, secondary text at 7:1, mint no longer a default fill, control borders visible at 3:1 or better.
- Dark theme added, composable with the two surfaces. Surface A and B exist as modes in the Figma library.
- Radius now follows one scale with matching names in design and code; card radius is surface-scoped.
- One type scale. El Messiri is allowed for words at 24px and up; numbers are always Geist; the admin surface uses it more sparingly.
- Removed leftovers: a second icon set, kit-only variants (Round shapes), Obra banners and labels, a dark-background button variant.
- Added a contrast guardrail so the accessibility bars are checked on every change.
