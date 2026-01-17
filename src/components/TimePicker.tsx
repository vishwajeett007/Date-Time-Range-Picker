/**
 * TimePicker - Accessible time picker with keyboard navigation
 */

import React, { useState, useRef, useEffect } from 'react';
import { parseTime, formatTime } from '../utils/date';

type TimePickerProps = {
  value: string | null; // HH:mm format
  onChange: (time: string) => void;
  minTime?: string;
  maxTime?: string;
  disabled?: boolean;
  label: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

export function TimePicker({
  value,
  onChange,
  minTime,
  maxTime,
  disabled = false,
  label,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: TimePickerProps): JSX.Element {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const hoursInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);

  // Parse value when it changes
  useEffect(() => {
    if (value) {
      const parsed = parseTime(value);
      setHours(parsed.hours);
      setMinutes(parsed.minutes);
    }
  }, [value]);

  // Validate and update time
  const updateTime = (newHours: number, newMinutes: number): void => {
    // Clamp values
    const clampedHours = Math.max(0, Math.min(23, newHours));
    const clampedMinutes = Math.max(0, Math.min(59, newMinutes));

    // Check min/max constraints
    let finalHours = clampedHours;
    let finalMinutes = clampedMinutes;

    if (minTime) {
      const min = parseTime(minTime);
      if (
        finalHours < min.hours ||
        (finalHours === min.hours && finalMinutes < min.minutes)
      ) {
        finalHours = min.hours;
        finalMinutes = min.minutes;
      }
    }

    if (maxTime) {
      const max = parseTime(maxTime);
      if (
        finalHours > max.hours ||
        (finalHours === max.hours && finalMinutes > max.minutes)
      ) {
        finalHours = max.hours;
        finalMinutes = max.minutes;
      }
    }

    setHours(finalHours);
    setMinutes(finalMinutes);
    onChange(formatTime(finalHours, finalMinutes));
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newHours = parseInt(e.target.value, 10);
    if (!isNaN(newHours)) {
      updateTime(newHours, minutes);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newMinutes = parseInt(e.target.value, 10);
    if (!isNaN(newMinutes)) {
      updateTime(hours, newMinutes);
    }
  };

  const handleHoursKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      updateTime(hours + 1, minutes);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      updateTime(hours - 1, minutes);
    } else if (e.key === 'Tab' && !e.shiftKey && hoursInputRef.current) {
      // Auto-advance to minutes on Tab
      e.preventDefault();
      minutesInputRef.current?.focus();
    }
  };

  const handleMinutesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      updateTime(hours, minutes + 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      updateTime(hours, minutes - 1);
    }
  };

  const incrementHours = (): void => {
    updateTime(hours + 1, minutes);
  };

  const decrementHours = (): void => {
    updateTime(hours - 1, minutes);
  };

  const incrementMinutes = (): void => {
    updateTime(hours, minutes + 15); // Increment by 15 minutes
  };

  const decrementMinutes = (): void => {
    updateTime(hours, minutes - 15); // Decrement by 15 minutes
  };

  return (
    <div className="time-picker">
      <label
        id={`${label}-label`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div
        className="flex items-center gap-2"
        role="group"
        aria-label={ariaLabel ?? label}
        aria-labelledby={ariaLabelledBy ?? `${label}-label`}
      >
        {/* Hours */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={incrementHours}
            disabled={disabled || !!(maxTime && parseTime(formatTime(hours + 1, minutes)).hours > parseTime(maxTime).hours)}
            className="w-8 h-6 rounded-t-md border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-xs font-semibold text-gray-600"
            aria-label="Increment hours"
          >
            ▲
          </button>
          <input
            ref={hoursInputRef}
            type="number"
            min="0"
            max="23"
            value={hours}
            onChange={handleHoursChange}
            onKeyDown={handleHoursKeyDown}
            disabled={disabled}
            className="w-12 h-10 text-center border-x border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Hours"
            aria-valuemin={0}
            aria-valuemax={23}
            aria-valuenow={hours}
          />
          <button
            type="button"
            onClick={decrementHours}
            disabled={disabled || !!(minTime && parseTime(formatTime(hours - 1, minutes)).hours < parseTime(minTime).hours)}
            className="w-8 h-6 rounded-b-md border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-xs font-semibold text-gray-600"
            aria-label="Decrement hours"
          >
            ▼
          </button>
        </div>

        <span className="text-lg font-bold text-gray-600" aria-hidden="true">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={incrementMinutes}
            disabled={disabled}
            className="w-8 h-6 rounded-t-md border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-xs font-semibold text-gray-600"
            aria-label="Increment minutes"
          >
            ▲
          </button>
          <input
            ref={minutesInputRef}
            type="number"
            min="0"
            max="59"
            step="15"
            value={minutes}
            onChange={handleMinutesChange}
            onKeyDown={handleMinutesKeyDown}
            disabled={disabled}
            className="w-12 h-10 text-center border-x border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Minutes"
            aria-valuemin={0}
            aria-valuemax={59}
            aria-valuenow={minutes}
          />
          <button
            type="button"
            onClick={decrementMinutes}
            disabled={disabled}
            className="w-8 h-6 rounded-b-md border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-xs font-semibold text-gray-600"
            aria-label="Decrement minutes"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
