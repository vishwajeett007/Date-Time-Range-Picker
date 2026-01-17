/**
 * CalendarGrid - Accessible calendar grid with full keyboard navigation
 */

import React, { useMemo, useRef, useEffect } from 'react';
import type { ConstraintConfig } from '../types';
import {
  getDaysInMonth,
  getDaysOfWeek,
  getMonthNames,
  isSameDay,
  addDays,
  addMonths,
  startOfDay,
} from '../utils/date';
import { isDateDisabled } from '../utils/constraints';

type CalendarGridProps = {
  year: number;
  month: number;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  hoverDate: Date | null;
  onDateSelect: (date: Date) => void;
  onDateHover?: (date: Date | null) => void;
  constraints?: ConstraintConfig;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

export function CalendarGrid({
  year,
  month,
  selectedStartDate,
  selectedEndDate,
  hoverDate,
  onDateSelect,
  onDateHover,
  constraints,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: CalendarGridProps): JSX.Element {
  const gridRef = useRef<HTMLTableElement>(null);
  const focusedCellRef = useRef<HTMLButtonElement | null>(null);

  // Calculate calendar days
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
    const firstDayOfWeek = firstDayOfMonth.getUTCDay();

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Add days from previous month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(Date.UTC(prevYear, prevMonth, daysInPrevMonth - i));
      days.push({ date, isCurrentMonth: false });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Date.UTC(year, month, day));
      days.push({ date, isCurrentMonth: true });
    }

    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(Date.UTC(nextYear, nextMonth, day));
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  // Check if a date is in the selected range
  const isInRange = (date: Date): boolean => {
    if (!selectedStartDate) {
      return false;
    }

    // If we're hovering and have start but no end, show preview range
    if (selectedStartDate && !selectedEndDate && hoverDate) {
      const start = selectedStartDate < hoverDate ? selectedStartDate : hoverDate;
      const end = selectedStartDate < hoverDate ? hoverDate : selectedStartDate;
      const day = startOfDay(date);
      const rangeStart = startOfDay(start);
      const rangeEnd = startOfDay(end);
      return day >= rangeStart && day <= rangeEnd;
    }

    // Normal range check
    if (selectedStartDate && selectedEndDate) {
      const start = startOfDay(selectedStartDate);
      const end = startOfDay(selectedEndDate);
      const day = startOfDay(date);
      return day >= start && day <= end;
    }

    return false;
  };

  // Check if date is selected start
  const isStartDate = (date: Date): boolean => {
    return selectedStartDate !== null && isSameDay(date, selectedStartDate);
  };

  // Check if date is selected end
  const isEndDate = (date: Date): boolean => {
    return selectedEndDate !== null && isSameDay(date, selectedEndDate);
  };

  // Get cell ID for accessibility
  const getCellId = (date: Date): string => {
    return `calendar-cell-${date.toISOString().split('T')[0]}`;
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, date: Date): void => {
    let targetDate: Date | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        targetDate = addDays(date, -1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        targetDate = addDays(date, 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        targetDate = addDays(date, -7);
        break;
      case 'ArrowDown':
        event.preventDefault();
        targetDate = addDays(date, 7);
        break;
      case 'Home':
        event.preventDefault();
        targetDate = new Date(Date.UTC(year, month, 1));
        break;
      case 'End':
        event.preventDefault();
        targetDate = new Date(Date.UTC(year, month, getDaysInMonth(year, month)));
        break;
      case 'PageUp':
        event.preventDefault();
        targetDate = addMonths(date, -1);
        break;
      case 'PageDown':
        event.preventDefault();
        targetDate = addMonths(date, 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onDateSelect(date);
        return;
      default:
        return;
    }

    if (targetDate) {
      // Find the target cell and focus it
      const targetCell = gridRef.current?.querySelector(
        `[id="${getCellId(targetDate)}"]`
      ) as HTMLButtonElement;
      if (targetCell && !targetCell.disabled) {
        targetCell.focus();
      }
    }
  };

  // Focus first enabled cell on mount
  useEffect(() => {
    const firstEnabledCell = gridRef.current?.querySelector(
      'button:not([disabled])'
    ) as HTMLButtonElement;
    if (firstEnabledCell) {
      firstEnabledCell.focus();
    }
  }, [year, month]);

  const daysOfWeek = getDaysOfWeek();
  const monthName = getMonthNames()[month];

  return (
    <div className="calendar-grid-container">
      <table
        ref={gridRef}
        role="grid"
        aria-label={ariaLabel ?? `Calendar for ${monthName} ${year}`}
        aria-labelledby={ariaLabelledBy}
        className="w-full border-collapse"
      >
        <thead>
          <tr role="row">
            {daysOfWeek.map((day) => (
              <th
                key={day}
                role="columnheader"
                scope="col"
                className="p-2 text-center text-sm font-medium text-gray-600"
              >
                <abbr title={day} aria-label={day}>
                  {day.slice(0, 1)}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, weekIndex) => {
            const weekDays = calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7);
            return (
              <tr key={weekIndex} role="row">
                {weekDays.map(({ date, isCurrentMonth }) => {
                  const disabled = isDateDisabled(date, constraints ?? {});
                  const inRange = isInRange(date);
                  const isStart = isStartDate(date);
                  const isEnd = isEndDate(date);
                  const isToday = isSameDay(date, new Date());
                  const cellId = getCellId(date);

                  return (
                    <td
                      key={cellId}
                      role="gridcell"
                      className="p-0.5"
                    >
                      <button
                        id={cellId}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && onDateSelect(date)}
                        onMouseEnter={() => !disabled && onDateHover?.(date)}
                        onMouseLeave={() => onDateHover?.(null)}
                        onKeyDown={(e) => handleKeyDown(e, date)}
                        onFocus={(e) => {
                          focusedCellRef.current = e.currentTarget;
                        }}
                        aria-label={`${date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}${disabled ? ' (unavailable)' : ''}`}
                        aria-selected={isStart || isEnd}
                        aria-disabled={disabled}
                        className={`
                          w-full h-10 rounded-md text-sm font-medium transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
                          ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-100'}
                          ${isToday ? 'ring-2 ring-primary-300' : ''}
                          ${inRange && !isStart && !isEnd ? 'bg-primary-50' : ''}
                          ${isStart ? 'bg-primary-600 text-white hover:bg-primary-700' : ''}
                          ${isEnd ? 'bg-primary-600 text-white hover:bg-primary-700' : ''}
                        `}
                      >
                        {date.getUTCDate()}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
