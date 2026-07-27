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
