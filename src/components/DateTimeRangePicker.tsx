/**
 * DateTimeRangePicker - Main component with timezone support, constraints, and presets
 */

import { useState, useCallback, useEffect } from 'react';
import type { DateTimeRange, ConstraintConfig, PresetConfig, TimezoneConfig, ValidationError } from '../types';
import { CalendarGrid } from './CalendarGrid';
import { TimePicker } from './TimePicker';
import { validateRange } from '../utils/constraints';
import { formatDateInTimezone, getCommonTimezones, createDateInTimezone } from '../utils/timezone';
import { formatTime, getMonthNames } from '../utils/date';

type DateTimeRangePickerProps = {
  value?: DateTimeRange;
  onChange: (range: DateTimeRange) => void;
  constraints?: ConstraintConfig;
  presets?: PresetConfig[];
  timezone?: string;
  timezones?: TimezoneConfig[];
  showPresets?: boolean;
  className?: string;
};

export function DateTimeRangePicker({
  value,
  onChange,
  constraints,
  presets: customPresets,
  timezone: initialTimezone = 'UTC',
  timezones: customTimezones,
  showPresets = true,
  className = '',
}: DateTimeRangePickerProps): JSX.Element {
  const [timezone, setTimezone] = useState<string>(initialTimezone);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(value?.start ?? null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(value?.end ?? null);
  const [startTime, setStartTime] = useState<string>(
    value?.start ? formatTime(value.start.getUTCHours(), value.start.getUTCMinutes()) : '00:00'
  );
  const [endTime, setEndTime] = useState<string>(
    value?.end ? formatTime(value.end.getUTCHours(), value.end.getUTCMinutes()) : '00:00'
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getUTCMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getUTCFullYear());
  const [validationError, setValidationError] = useState<ValidationError | null>(null);

  const availableTimezones = customTimezones ?? getCommonTimezones();
  const currentTimezoneLabel = availableTimezones.find((tz) => tz.timezone === timezone)?.label ?? timezone;

  // Handle date selection
  const handleDateSelect = useCallback((date: Date): void => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      setHoverDate(null);
    } else if (selectedStartDate && !selectedEndDate) {
      // Complete selection
      if (date < selectedStartDate) {
        // If selected date is before start, swap them
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }
      setHoverDate(null);
    }

    // Update month view if needed
    const selectedMonth = date.getUTCMonth();
    const selectedYear = date.getUTCFullYear();
    if (selectedMonth !== currentMonth || selectedYear !== currentYear) {
      setCurrentMonth(selectedMonth);
      setCurrentYear(selectedYear);
    }
  }, [selectedStartDate, selectedEndDate, currentMonth, currentYear]);

  // Combine date and time into a full DateTime
  const combineDateAndTime = useCallback((date: Date, time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number);
    return createDateInTimezone(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      hours ?? 0,
      minutes ?? 0,
      timezone
    );
  }, [timezone]);

  // Update the range when date or time changes
  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const start = combineDateAndTime(selectedStartDate, startTime);
      const end = combineDateAndTime(selectedEndDate, endTime);

      const range: DateTimeRange = { start, end };
      const error = validateRange(range, constraints ?? {});

      if (!error) {
        setValidationError(null);
        onChange(range);
      } else {
        setValidationError(error);
      }
    } else if (selectedStartDate) {
      // Partial range - just start date
      const start = combineDateAndTime(selectedStartDate, startTime);
      onChange({ start, end: null });
    } else {
      onChange({ start: null, end: null });
    }
  }, [selectedStartDate, selectedEndDate, startTime, endTime, timezone, constraints, onChange, combineDateAndTime]);

  // Handle preset selection
  const handlePresetSelect = useCallback((preset: PresetConfig): void => {
    setSelectedStartDate(preset.start);
    setSelectedEndDate(preset.end);
    setStartTime(formatTime(preset.start.getUTCHours(), preset.start.getUTCMinutes()));
    setEndTime(formatTime(preset.end.getUTCHours(), preset.end.getUTCMinutes()));

    // Update month view
    setCurrentMonth(preset.start.getUTCMonth());
    setCurrentYear(preset.start.getUTCFullYear());
  }, []);

  // Navigate months
  const handlePreviousMonth = (): void => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = (): void => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = getMonthNames();

  return (
    <div className={`date-time-range-picker ${className}`}>
      {/* Presets */}
      {showPresets && customPresets && customPresets.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Presets</h3>
          <div className="flex flex-wrap gap-2">
            {customPresets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timezone selector */}
      <div className="mb-4">
        <label htmlFor="timezone-select" className="block text-sm font-medium text-gray-700 mb-1">
          Timezone
        </label>
        <select
          id="timezone-select"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {availableTimezones.map((tz) => (
            <option key={tz.timezone} value={tz.timezone}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Validation error */}
      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm" role="alert">
          {validationError.message}
        </div>
      )}

      {/* Calendar and Time Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date/Time */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Start</h3>

          {/* Calendar */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Previous month"
              >
                ‹
              </button>
              <h4 className="text-lg font-semibold">
                {monthNames[currentMonth]} {currentYear}
              </h4>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Next month"
              >
                ›
              </button>
            </div>
            <CalendarGrid
              year={currentYear}
              month={currentMonth}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              hoverDate={hoverDate}
              onDateSelect={handleDateSelect}
              onDateHover={setHoverDate}
              constraints={constraints}
              aria-label="Start date calendar"
            />
          </div>

          {/* Time Picker */}
          <TimePicker
            value={startTime}
            onChange={setStartTime}
            minTime={constraints?.minTime}
            maxTime={constraints?.maxTime}
            label="Start Time"
          />
        </div>

        {/* End Date/Time */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">End</h3>

          {/* Calendar */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Previous month"
              >
                ‹
              </button>
              <h4 className="text-lg font-semibold">
                {monthNames[currentMonth]} {currentYear}
              </h4>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Next month"
              >
                ›
              </button>
            </div>
            <CalendarGrid
              year={currentYear}
              month={currentMonth}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              hoverDate={hoverDate}
              onDateSelect={handleDateSelect}
              onDateHover={setHoverDate}
              constraints={constraints}
              aria-label="End date calendar"
            />
          </div>

          {/* Time Picker */}
          <TimePicker
            value={endTime}
            onChange={setEndTime}
            minTime={constraints?.minTime}
            maxTime={constraints?.maxTime}
            label="End Time"
          />
        </div>
      </div>

      {/* Selected Range Display */}
      {selectedStartDate && selectedEndDate && (
        <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Range</h3>
          <div className="text-sm text-gray-600">
            <div>
              <strong>Start:</strong>{' '}
              {formatDateInTimezone(combineDateAndTime(selectedStartDate, startTime), timezone, 'datetime')}
            </div>
            <div>
              <strong>End:</strong>{' '}
              {formatDateInTimezone(combineDateAndTime(selectedEndDate, endTime), timezone, 'datetime')}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Timezone: {currentTimezoneLabel}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
