/* ============================================================================
 * Green Together — Week strip
 * ----------------------------------------------------------------------------
 * Promoted from the Figma studio (`S4 / Week day marker` + `S4 / Week strip`),
 * see issue #9. Answers the R5 finding that participants could not tell whether
 * a log covered a day, a week, or an average.
 *
 * v1.3.0 matches the build that leads (gt-s4-portal-work): day name, date
 * number, then a small marker. Five states instead of three, so a missed day
 * and a day still to come no longer look the same, plus an optional "Logged"
 * chip for the caption row once today is logged.
 *
 * DISTRIBUTION: copy this file into your app (the shadcn model) or import it if
 * your build compiles TSX from node_modules. It has no runtime dependencies
 * beyond React, and every colour comes from a DS token through the Tailwind
 * preset — there are no raw values here, and CI enforces that.
 *
 * REQUIRES: `presets: [require('@greentogether/design-system/tailwind')]` and
 * `@import '@greentogether/design-system/code-tokens.css'` at the app root.
 * ========================================================================== */

import React from "react";

/**
 * What we know about a day.
 * - `logged`   logged, same as usual
 * - `changed`  logged, but different from usual
 * - `missed`   a past day with no log
 * - `upcoming` a day still to come (and today, before it is logged)
 * - `not-logged` deprecated alias of `upcoming`, kept so v1.2 callers still work
 */
export type DayState = "logged" | "changed" | "missed" | "upcoming" | "not-logged";

export interface WeekDay {
  /** Short day name shown above the marker, e.g. "Mon". Localise before passing. */
  label: string;
  /** Optional date number shown under the name, e.g. "12". */
  date?: string;
  state: DayState;
  /** Marks the current day. At most one day in a strip should set this. */
  isToday?: boolean;
  /** Accessible description, e.g. "Thursday 15 October, logged". */
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
  /**
   * Optional success chip on the right of the caption row, e.g. "Logged".
   * Show it only once today is logged: it is the confirmation, so it should be
   * the only green pill on the surface.
   */
  chip?: string;
  className?: string;
  /**
   * Avoid in Surface A today: per-day logging does not exist, and a tappable
   * day invites someone to tap Thursday expecting to log it (the R5 false
   * affordance). Kept for surfaces where a day genuinely opens something.
   */
  onDayClick?: (day: WeekDay, index: number) => void;
}

const normalise = (s: DayState): Exclude<DayState, "not-logged"> =>
  s === "not-logged" ? "upcoming" : s;

/* State is carried by shape AND colour, never colour alone (WCAG 1.4.1):
 * logged = small filled dot · changed = dot inside a ring · missed = short dash ·
 * upcoming = small hollow dot. Markers stay small on purpose so they never read
 * as buttons. Size and colour transition together; reduced motion turns it off. */
const MARKER_BY_STATE: Record<Exclude<DayState, "not-logged">, string> = {
  logged: "h-2 w-2 rounded-full bg-positive-strong",
  changed:
    "h-2.5 w-2.5 rounded-full bg-positive-strong ring-2 ring-offset-2 ring-positive-strong ring-offset-surface-0",
  missed: "h-0.5 w-2.5 rounded-full bg-line-4",
  upcoming: "h-2 w-2 rounded-full border border-line-4 bg-surface-0",
};

const MOTION =
  "transition-all duration-200 ease-out motion-reduce:transition-none";

export function WeekDayMarker({
  day,
  onClick,
}: {
  day: WeekDay;
  onClick?: () => void;
}) {
  const state = normalise(day.state);
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick } : {})}
      aria-label={day.ariaLabel}
      aria-current={day.isToday ? "date" : undefined}
      data-state={state}
      className={[
        "flex flex-col items-center gap-1 rounded px-1 py-0.5",
        onClick
          ? "hover:bg-interaction-ghost-hover focus-visible:outline-none focus-visible:shadow-focus"
          : "",
      ].join(" ")}
    >
      <span
        className={[
          "text-[11px] uppercase leading-4 tracking-wide",
          day.isToday ? "font-semibold text-ink" : "text-ink-secondary",
        ].join(" ")}
      >
        {day.label}
      </span>
      {day.date !== undefined && (
        <span
          className={[
            "text-[13px] leading-5",
            day.isToday ? "font-semibold text-ink" : "text-ink",
          ].join(" ")}
        >
          {day.date}
        </span>
      )}
      {/* Today rings the marker, whatever its state. */}
      <span
        aria-hidden="true"
        className={[
          "flex h-4 w-4 items-center justify-center rounded-full",
          MOTION,
          day.isToday ? "ring-1 ring-positive-strong" : "",
        ].join(" ")}
      >
        <span className={[MARKER_BY_STATE[state], MOTION].join(" ")} />
      </span>
    </Tag>
  );
}

export function WeekStrip({
  days,
  caption,
  chip,
  className = "",
  onDayClick,
}: WeekStripProps) {
  return (
    <div
      className={[
        "rounded-lg border border-line-3 bg-surface-0 px-3 py-2",
        className,
      ].join(" ")}
    >
      {(caption || chip) && (
        <div className="mb-1 flex items-center justify-between gap-2">
          {caption && (
            <p className="text-[11px] leading-4 text-ink-secondary">{caption}</p>
          )}
          {chip && (
            <span
              className={[
                "rounded-full bg-positive-strong px-2 py-0.5 text-[11px] font-medium leading-4 text-ink-inverse",
                MOTION,
              ].join(" ")}
            >
              {chip}
            </span>
          )}
        </div>
      )}
      <ul className="flex items-start justify-between gap-1" role="list">
        {days.map((day, i) => (
          <li key={`${day.label}-${i}`}>
            <WeekDayMarker
              day={day}
              onClick={onDayClick ? () => onDayClick(day, i) : undefined}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeekStrip;
