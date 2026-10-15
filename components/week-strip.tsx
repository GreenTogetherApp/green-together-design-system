/* ============================================================================
 * Green Together — Week strip
 * ----------------------------------------------------------------------------
 * Promoted from the Figma studio (`S4 / Week day marker` + `S4 / Week strip`),
 * see issue #9. Answers the R5 finding that participants could not tell whether
 * a log covered a day, a week, or an average.
 *
 * v1.3.0 adopts the five day states the employee app ships (Julie's
 * CommuteWeekStrip): logged, changed, today, missed, future — drawn with
 * design-system tokens. Logged and changed carry an icon; every other state
 * carries the date. An optional "Logged" chip sits on the caption row.
 *
 * DISTRIBUTION: copy this file into your app (the shadcn model) or import it if
 * your build compiles TSX from node_modules. It has no runtime dependencies
 * beyond React (the two icons are inline SVG), and every colour comes from a DS
 * token through the Tailwind preset — there are no raw values here, and CI
 * enforces that.
 *
 * REQUIRES: `presets: [require('@greentogether/design-system/tailwind')]` and
 * `@import '@greentogether/design-system/code-tokens.css'` at the app root.
 * ========================================================================== */

import React from "react";

/**
 * What we know about a day (same names as the employee app).
 * - `logged`  logged, same as usual          → filled, check
 * - `changed` logged, different from usual   → filled with a cut-out ring, arrows
 * - `today`   today, not logged yet          → green outline, date
 * - `missed`  a past day with no log         → dashed outline, date
 * - `future`  a day still to come            → light outline, date
 * Deprecated aliases kept so older callers still work: `upcoming` and
 * `not-logged` both map to `future`.
 */
export type DayState =
  | "logged"
  | "changed"
  | "today"
  | "missed"
  | "future"
  | "upcoming"
  | "not-logged";

type CoreState = "logged" | "changed" | "today" | "missed" | "future";

export interface WeekDay {
  /** Short day name shown above the marker, e.g. "Mon". Localise before passing. */
  label: string;
  /** Date number shown inside the marker for today, missed and future days, e.g. "12". */
  date?: string;
  state: DayState;
  /** Deprecated (v1.2): an unlogged day with isToday renders as `today`. */
  isToday?: boolean;
  /** Accessible description, e.g. "Thu 15: Today, not logged". */
  ariaLabel?: string;
}

export interface WeekStripProps {
  /**
   * The days to render. Mon–Fri is the Surface A default, but the strip does
   * not assume a working week: a 21-calendar-day challenge can pass seven days
   * without the component disagreeing with the challenge card (issue #9).
   */
  days: WeekDay[];
  /** Optional caption row, e.g. "Today is Thursday 15 Oct". */
  caption?: string;
  /** Optional success chip on the right of the caption row, e.g. "Logged". */
  chip?: string;
  /** Accessible name for the list, e.g. "This week's commute". */
  label?: string;
  className?: string;
  /**
   * Index of the day that was just logged. That marker plays the logged moment
   * once (springs from outline to filled, the check draws itself, a ring
   * releases) and the chip slides in. Set it when the log lands; leave it
   * unset on load so a page that opens already logged stays still. Haptics
   * belong to the app (Capacitor), not to this component.
   */
  celebrate?: number;
  /**
   * Avoid in Surface A: per-day logging does not exist, and a tappable day
   * invites someone to tap Thursday expecting to log it (the R5 false
   * affordance). Kept from v1.2 for surfaces where a day genuinely opens something.
   */
  onDayClick?: (day: WeekDay, index: number) => void;
}

const normalise = (d: WeekDay): CoreState => {
  const s = d.state === "upcoming" || d.state === "not-logged" ? "future" : d.state;
  return d.isToday && s !== "logged" && s !== "changed" ? "today" : s;
};

/* State is carried by shape AND colour, never colour alone (WCAG 1.4.1):
 * filled + check, filled + ring + arrows, green outline, dashed outline, light
 * outline. Green fills use --color-positive-strong (5.27:1), so the white icons
 * on them pass; the brand green (--color-positive) would not. */
const MARKER_BY_STATE: Record<CoreState, string> = {
  logged: "border border-positive-strong bg-positive-strong text-ink-inverse",
  changed:
    "border-2 border-positive-strong bg-positive-strong text-ink-inverse ring-2 ring-inset ring-surface-0",
  today: "border-2 border-positive-strong bg-surface-0 font-semibold text-positive-strong",
  missed: "border border-dashed border-line-4 bg-surface-0 text-ink-secondary",
  future: "border border-line-3 bg-surface-0 text-ink-secondary",
};

const MOTION = "transition-colors duration-200 ease-out motion-reduce:transition-none";

function CheckIcon({ draw = false }: { draw?: boolean }) {
  return (
    <svg viewBox="0 0 256 256" className="h-4 w-4" aria-hidden="true">
      {/* pathLength=1 lets the draw run on a 0–1 dash, whatever the geometry */}
      <polyline points="40 144 96 200 224 72" fill="none" stroke="currentColor" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={draw ? 1 : undefined}
        className={draw ? "animate-gt-draw motion-reduce:animate-none motion-reduce:[stroke-dasharray:none]" : undefined} />
    </svg>
  );
}

function ArrowsIcon({ draw = false }: { draw?: boolean }) {
  // same draw as the check, one stroke at a time
  const d = draw
    ? { pathLength: 1, strokeDasharray: 1, className: "animate-gt-draw motion-reduce:animate-none motion-reduce:[stroke-dasharray:none]" }
    : {};
  return (
    <svg viewBox="0 0 256 256" className="h-4 w-4" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="176 136 216 176 176 216" {...d} />
        <line x1="40" y1="176" x2="216" y2="176" {...d} />
        <polyline points="80 120 40 80 80 40" {...d} />
        <line x1="216" y1="80" x2="40" y2="80" {...d} />
      </g>
    </svg>
  );
}

export function WeekDayMarker({ day, onClick, celebrate = false }: { day: WeekDay; onClick?: () => void; celebrate?: boolean }) {
  const state = normalise(day);
  /* The logged moment only plays on a day that IS logged now. */
  const pop = celebrate && (state === "logged" || state === "changed");
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick } : {})}
      role="listitem"
      aria-label={day.ariaLabel}
      aria-current={state === "today" ? "date" : undefined}
      className="flex min-w-0 flex-col items-center gap-1.5"
    >
      <span
        aria-hidden="true"
        className={[
          "truncate text-xs font-medium",
          state === "today" ? "text-ink" : "text-ink-secondary",
        ].join(" ")}
      >
        {day.label}
      </span>
      <span aria-hidden="true" className="relative">
        {/* the ring released behind the marker: scale + fade, never colour */}
        {pop && (
          <span className="absolute inset-0 rounded-full border-2 border-positive-strong animate-gt-ring motion-reduce:hidden" />
        )}
        <span
          data-state={state}
          className={[
            "relative flex h-9 w-9 items-center justify-center rounded-full text-sm",
            MARKER_BY_STATE[state],
            pop ? "animate-gt-pop motion-reduce:animate-none" : MOTION,
          ].join(" ")}
        >
          {state === "logged" ? <CheckIcon draw={pop} /> : state === "changed" ? <ArrowsIcon draw={pop} /> : day.date}
        </span>
      </span>
    </Tag>
  );
}

export function WeekStrip({ days, caption, chip, label, className = "", onDayClick, celebrate }: WeekStripProps) {
  return (
    <div className={["flex flex-col gap-2", className].join(" ")}>
      {(caption || chip) && (
        <div className="flex items-center justify-between gap-2">
          {caption && <p className="text-[11px] leading-4 text-ink-secondary">{caption}</p>}
          {chip && (
            <span
              className={[
                "rounded-full bg-positive-strong px-2 py-0.5 text-[11px] font-medium leading-4 text-ink-inverse",
                celebrate !== undefined ? "animate-gt-slide-in motion-reduce:animate-none" : MOTION,
              ].join(" ")}
            >
              {chip}
            </span>
          )}
        </div>
      )}
      {/* Column count follows the days passed in, so 5- and 7-day strips both fit. */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
        role="list"
        aria-label={label}
      >
        {days.map((day, i) => (
          <WeekDayMarker
            key={`${day.label}-${i}`}
            day={day}
            onClick={onDayClick ? () => onDayClick(day, i) : undefined}
            celebrate={celebrate === i}
          />
        ))}
      </div>
    </div>
  );
}

export default WeekStrip;
