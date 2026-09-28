/* ============================================================================
 * Green Together — Tailwind preset  (@greentogether/design-system/tailwind)
 * ----------------------------------------------------------------------------
 * Maps Tailwind's semantic color/radius/shadow/type names onto the Green
 * Together DS CSS variables (from `code-tokens.css`). Consuming this preset is
 * how a codebase "gets its form from the DS" — one mapping, no drift.
 *
 * USAGE (consumer's tailwind.config.cjs):
 *   module.exports = {
 *     presets: [require('@greentogether/design-system/tailwind')],
 *     content: [...],
 *   }
 * and once, at the app root:
 *   @import '@greentogether/design-system/code-tokens.css';
 *
 * WHY color-mix() instead of hardcoded hex or HSL triplets:
 *   - Tailwind opacity modifiers (bg-primary/30) need the engine to inject
 *     alpha. A plain `var(--x)` hex can't do that; a literal hex can, but then
 *     the value is COPIED (drift) and runtime theme switching is lost.
 *   - color-mix() keeps the live `var(--color-*)` reference — so the DS's own
 *     [data-surface="a"|"b"] blocks drive the Surface A/B (Maya/Sam) switch at
 *     runtime — AND supports opacity via <alpha-value>. Single source, opacity,
 *     surface flip: all three at once. (Modern-browser only; fine for apps &
 *     prototypes.)
 * ========================================================================== */

/** wrap a DS color var so Tailwind opacity modifiers work against it */
const c = (v) => `color-mix(in srgb, var(${v}) calc(<alpha-value> * 100%), transparent)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // --- shadcn semantic names -> GT DS semantic vars ---
        background: c('--color-bg'),
        foreground: c('--color-fg'),
        border: c('--color-border'),
        input: c('--color-border'),
        ring: c('--color-focus-ring'),

        primary: {
          DEFAULT: c('--color-primary'), // surface-scoped in the DS
          foreground: c('--color-primary-fg'),
          hover: c('--color-primary-hover'),
          active: c('--color-primary-active'),
          soft: c('--color-primary-soft'),
        },
        secondary: {
          DEFAULT: c('--color-secondary'),
          foreground: c('--color-secondary-fg'),
        },
        muted: {
          DEFAULT: c('--color-bg-muted'),
          foreground: c('--color-fg-muted'),
        },
        destructive: {
          DEFAULT: c('--color-danger'),
          foreground: '#FFFFFF',
        },
        // GT-specific semantics (no shadcn equivalent)
        positive: c('--color-positive'),
        'positive-soft': c('--color-positive-soft'),
        success: c('--color-success'),
        warning: c('--color-warning'),
        info: c('--color-info'),
        card: c('--gt-surface'),
        'card-2': c('--gt-surface-2'),

        // --- promoted from the Figma studio (v1.1.0) ---
        // Figma group -> Tailwind name:
        //   text/*        -> ink        (text-ink, text-ink-secondary)
        //   icon/*        -> icon       (text-icon-muted, fill-icon-brand)
        //   surface/*     -> surface    (bg-surface-0, bg-surface-inverse)
        //   border/*      -> line       (border-line-3)
        //   interaction/* -> interaction(bg-interaction-ghost-hover)
        //   overlay/*     -> overlay    (bg-overlay-backdrop)
        ink: {
          DEFAULT: c('--text-primary'),
          secondary: c('--text-secondary'),
          inverse: c('--text-inverse'),
          'inverse-secondary': c('--text-inverse-secondary'),
          disabled: c('--text-disabled'),
          'on-brand': c('--text-on-brand'),
        },
        icon: {
          DEFAULT: c('--icon-default'),
          muted: c('--icon-muted'),
          inverse: c('--icon-inverse'),
          brand: c('--icon-brand'),
          destructive: c('--icon-destructive'),
          disabled: c('--icon-disabled'),
        },
        surface: {
          0: c('--surface-level-0'),
          2: c('--surface-level-2'),
          3: c('--surface-level-3'),
          inverse: c('--surface-inverse'),
          'inverse-glass': c('--surface-inverse-glass'),
          glass: c('--surface-glass'),
          warm: c('--surface-warm'),
        },
        line: {
          0: c('--border-level-0'),
          1: c('--border-level-1'),
          3: c('--border-level-3'),
          4: c('--border-level-4'),
          5: c('--border-level-5'),
          inverse: c('--border-inverse'),
        },
        interaction: {
          ghost: c('--interaction-ghost'),
          'ghost-hover': c('--interaction-ghost-hover'),
          'ghost-foreground': c('--interaction-ghost-foreground'),
          'secondary-hover': c('--interaction-secondary-hover'),
          'outline-hover': c('--interaction-outline-hover'),
          'outline-active': c('--interaction-outline-active'),
          'primary-active': c('--interaction-primary-active'),
        },
        'positive-strong': c('--color-positive-strong'),
        overlay: c('--overlay-backdrop'),
      },
      backgroundImage: {
        'day-sky': 'var(--gradient-day-sky)',
        'afternoon-sky': 'var(--gradient-afternoon-sky)',
        'evening-sky': 'var(--gradient-evening-sky)',
      },
      borderColor: { DEFAULT: 'var(--color-border)' },
      borderRadius: {
        xs: 'var(--radius-xs)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        focus: 'var(--shadow-focus)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)',
        heading: 'var(--font-headings)',
      },
    },
  },
};
