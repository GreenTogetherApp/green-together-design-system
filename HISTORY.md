# Green Together Design System — History & Decisions

A factual record of the system's state, the work done, and what's planned.
Authorship lives in the git history. No individuals or customer names, by design.

## Starting state (baseline)
- One shared Figma working file everyone worked in — hundreds of overlapping colors and styles, no direction.
- A slim, pre-app brand direction: colors, a thin type scale, and some voice notes — with no clear line between what was decided and what was placeholder/AI-generated filler.
- Ungoverned typography: the guidelines set a display font, but alternates were used in practice, with no reasoning documented anywhere (~16 fonts total).
- No components.
- No defined path from design to built product — screens were marked "ready for testing" without being prototypes, and how they reached production was undocumented.
- Three separate token sets plus hardcoded values across the product repos.
- No board and no shared visibility into any of it.

## Done
- **State assessment** — separated actual decisions from filler; documented the real starting state.
- **Repo access** — obtained and used to assess implementation state.
- **GitHub board + backlog** — research findings turned into tracked cards; statuses, fields, and one shared card template across all repos.
- **Design system packaged in code** — versioned, public, installable; a Tailwind preset bridges tokens to components; anti-drift wiring (surface-scoped variables) built in.
- **Safe versioning model** — consumers pin an immutable release tag and upgrade deliberately; no surprise breakage.
- **Living design-system guide.**
- **WCAG contrast method** introduced for colour decisions.
- **Surface A / Surface B model** — one app, two lenses (not two apps).
- **Shared personas linked to current research** — so the team shares one language, traceable to research. (link: TBD)
- **Prototype consolidation** — scattered prototypes gathered into one repo with a system-wired starter.
- **Coded, deployable prototypes** — live shareable URLs, as an added path alongside the Figma workflow.
- **Design → production pipeline** defined (prototype as blueprint → rebuild).
- **Removed a team-inaccessible design tool (claude.ai/design) from the workflow** so the system is team-reachable.

## In progress
- **DS v2** — green reserved for success; primary moved to an accessible dark green; full semantic role coverage (bg / fg / text / icon / soft / border per family); accessible values; duplicate + label cleanup. Signed off; implementation underway.
- **Single source of truth** — GitHub set as the source; reconciling a second kit (built in Figma Make, which carries components) back toward the repo.
- **Design ↔ code sync** — writing the intended design-tool variable changes into the token bridge so they are not held in one person's head.
- **Atmosphere "seam"** — the Sky / atmosphere concept plugs in via an alias + flat fallback, backgrounds/overlays only (never interactions), so it can change or drop with no rework. (Sky itself is in testing and excluded until ready.)

## Planned
- **Repo migration** — move the product repos off hardcoded values and separate token sets onto the package.
- **Public demo page** (feature + stories: shell + auto-deploy · colours by group · Surface A/B switch · component gallery · install + version) — so the system is visible and discussable.
- **Component library** reconciled into the repo.
- **Typography governance** — consolidate the font set and resolve + document the display-font decision.
- **Token gaps** — e.g., a full error / red ramp.

**Dependencies to unblock:** write access on the employee-app repo (granted on demand) for the migration; a design-tool seat / owner action for the export + token import.

## Future states
1. **One source of truth, fully migrated** — every repo pulls the package; zero hardcodes, zero drift.
2. **Design ↔ code parity** — variables and code tokens stay in sync automatically; components mapped both ways.
3. **Component library matured** — used by prototypes and products.
4. **Observable + self-guarding** — demo page live; WCAG checks run automatically in CI so accessibility can't regress.
5. **Atmosphere shipped** — the brand differentiator lands through the seam once out of testing.
