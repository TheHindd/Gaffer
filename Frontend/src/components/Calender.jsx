// /src/components/CalendarCard.jsx
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

export default function CalendarCard({ height = "h-55" }) {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "en").toLowerCase();
  const isRTL = lang.startsWith("ar");

  // Controlled month cursor (year, monthIndex 0-11)
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const today = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth(), date: d.getDate() };
  }, []);

  const weekStartsOn = isRTL ? 6 : 0; // Saturday for Arabic, Sunday for English

  // weekday names localized and rotated to weekStartsOn
  const weekdayNames = useMemo(() => {
    const locale = isRTL ? "ar-AE" : "en-US";
    // base Sunday
    const base = new Date(Date.UTC(2021, 0, 3)); // Sunday
    const names = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      names.push(
        d.toLocaleDateString(locale, { weekday: "short" })
      );
    }
    // rotate to weekStartsOn
    return [...names.slice(weekStartsOn), ...names.slice(0, weekStartsOn)];
  }, [isRTL, weekStartsOn]);

  const { year, month } = cursor;

  // helper to build a 6x7 calendar grid with prev/next month dates included
  const cells = useMemo(() => {
    // days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // day index of the 1st (0=Sun..6=Sat)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // leading blanks count relative to weekStartsOn
    const leading = (firstDayIndex - weekStartsOn + 7) % 7;

    // previous month info
    const prevMonthDate = new Date(year, month, 0); // last day of previous month
    const prevDays = prevMonthDate.getDate();
    const prevMonth = (month - 1 + 12) % 12;
    const prevYear = month === 0 ? year - 1 : year;

    // fill 42 cells (6 rows x 7 cols)
    const totalCells = 42;
    const arr = new Array(totalCells).fill(null).map((_, idx) => {
      const dayIndex = idx - leading + 1; // 1-based day relative to current month
      if (idx < leading) {
        // previous month day
        const day = prevDays - (leading - 1 - idx);
        return { y: prevYear, m: prevMonth, d: day, inMonth: false };
      } else if (dayIndex >= 1 && dayIndex <= daysInMonth) {
        return { y: year, m: month, d: dayIndex, inMonth: true };
      } else {
        // next month day
        const nextDay = dayIndex - daysInMonth;
        const nextMonth = (month + 1) % 12;
        const nextYear = month === 11 ? year + 1 : year;
        return { y: nextYear, m: nextMonth, d: nextDay, inMonth: false };
      }
    });

    return arr;
  }, [year, month, weekStartsOn]);

  // localized month name (e.g., "October 2025" or Arabic equivalent)
  const monthLabel = useMemo(() => {
    const locale = isRTL ? "ar-EG" : "en-US";
    return new Date(year, month, 1).toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    });
  }, [year, month, isRTL]);

  const prev = () =>
    setCursor((c) => {
      const nm = c.month - 1;
      if (nm < 0) return { year: c.year - 1, month: 11 };
      return { ...c, month: nm };
    });
  const next = () =>
    setCursor((c) => {
      const nm = c.month + 1;
      if (nm > 11) return { year: c.year + 1, month: 0 };
      return { ...c, month: nm };
    });

  return (
    <div
      className={`${height} w-full flex flex-col`}
      dir={isRTL ? "rtl" : "ltr"}
      aria-hidden={false}
    >
      {/* small header with month + arrows; no big title */}
      <div className="flex items-center justify-between mb-2 select-none">
        <div />
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            aria-label="Previous month"
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100"
          >
            {/* arrow direction flips visually for RTL */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {isRTL ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l4-4-4-4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l-4 4 4 4" />
              )}
            </svg>
           
          </button>

          <div className="text-center text-xs font-semibold text-secondary1 px-2">
            {monthLabel}
          </div>

          <button
            onClick={next}
            aria-label="Next month"
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {isRTL ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l-4 4 4 4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l4-4-4-4" />
              )}
            </svg>
            
          </button>
        </div>
        <div />
      </div>

      {/* weekday labels */}
      <div className="grid grid-cols-7 gap-1 text-xs mb-2">
        {weekdayNames.map((w, i) => (
          <div key={i} className="text-center text-gray-600 font-medium whitespace-nowrap">
            {w}
          </div>
        ))}
      </div>

      {/* dates grid: always 6 rows (42 cells) so height is consistent */}
      <div className="grid grid-cols-7 gap-x-2 flex">
        {cells.map((cell, i) => {
          const isToday =
            cell.inMonth &&
            cell.y === today.year &&
            cell.m === today.month &&
            cell.d === today.date;
          return (
            <div key={i} className="min-h-[30px] flex items-start justify-center">
              {cell.inMonth ? (
                <div
                  className={`h-7 w-7 flex items-center justify-center rounded-md text-sm ${
                    isToday
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-primary1"
                  }`}
                >
                  {isRTL
                  ? new Intl.NumberFormat("ar-EG").format(cell.d)
                  : cell.d}
                </div>
              ) : (
                <div className="h-1 w- flex items-center justify-center rounded-md text-xs text-gray-200">
                 
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
