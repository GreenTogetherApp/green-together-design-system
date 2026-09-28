/* ============================================================================
 * Green Together — Week strip
 * ----------------------------------------------------------------------------
 * Promoted from the Figma studio (`S4 / Week day marker` + `S4 / Week strip`),
 * see issue #9. Answers the R5 finding that participants could not tell whether
 * a log covered a day, a week, or an average.
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

/** What we know about a day. `changed` = logged, but different from usual. */
export type DayState = "not-logged" | "logged" | "changed";

export interface WeekDay {
  /** Short label shown under the marker, e.g. "Mon". Localise before passing. */
  label: string;
  state: DayState;
  /** Marks the current day. At most one day in a strip should set this. */
  isToday?: boolean;
  /** Accessible description, e.g. "Monday 6 September, logged". */
  ariaLabel?: string;
}

export interface WeekStripProps {
  /**
   * The days to render. Mon–Fri is the Surface A default, but the strip does
   * not assume a working week: a 21-calendar-day challenge can pass seven days
   * without the component disagreeing with the challenge card (issue #9).
   */
  days: WeekDay[];
  /** Optional heading, e.g. "Week of 6 September". */
  caption?: string;
  className?: string;
  onDayClick?: (day: WeekDay, index: number) => void;
}

/* State is carried by shape AND colour, never colour alone (WCAG 1.4.1):
 * not-logged = hollow, logged = filled, changed = filled with a cut-out ring. */
const MARKER_BY_STATE: Record<DayState, string> = {
  "not-logged": "bg-surface-0 border border-line-3",
  logged: "bg-positive-strong border border-positive-strong",
  changed:
    "bg-surface-0 border-2 border-positive-strong ring-2 ring-inset ring-surface-0",
};

const LABEL_BY_STATE: Record<DayState, string> = {
  "not-logged": "text-ink-secondary",
  logged: "text-ink",
  changed: "text-ink",
};

export function WeekDayMarker({
  day,
  onClick,
}: {
  day: WeekDay;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick } : {})}
      aria-label={day.ariaLabel}
      aria-current={day.isToday ? "date" : undefined}
      className={[
        "flex flex-col items-center gap-1 rounded px-1 py-0.5",
        onClick
          ? "hover:bg-interaction-ghost-hover focus-visible:outline-none focus-visible:shadow-focus"
          : "",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "h-6 w-6 rounded-full transition-colors",
          MARKER_BY_STATE[day.state],
        ].join(" ")}
      />
      <span
        className={[
          "text-[11px] leading-4",
          LABEL_BY_STATE[day.state],
          // Today is weight + underline, so it survives greyscale and zoom.
          day.isToday ? "font-semibold underline underline-offset-2" : "",
        ].join(" ")}
      >
        {day.label}
      </span>
    </Tag>
  );
}

export function WeekStrip({
  days,
  caption,
  className = "",
  onDayClick,
}: WeekStripProps) {
  return (
    <div
      className={[
        "rounded-lg border border-line-1 bg-surface-0 px-3 py-2",
        className,
      ].join(" ")}
    >
      {caption && (
        <p className="mb-1 text-[11px] leading-4 text-ink-secondary">
          {caption}
        </p>
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

