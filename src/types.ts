/**
 * Core types for the DateTimeRangePicker component
 */

export type DateTimeRange = {
  start: Date | null;
  end: Date | null;
};

export type PartialDateTimeRange = {
  start: Date | null;
  end: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  startTime: string | null; // HH:mm format
  endTime: string | null; // HH:mm format
};

export type ConstraintConfig = {
  minDate?: Date;
  maxDate?: Date;
  minTime?: string; // HH:mm format
  maxTime?: string; // HH:mm format
  blackoutDates?: Date[]; // Dates that cannot be selected
  minDuration?: number; // Minimum duration in minutes
  maxDuration?: number; // Maximum duration in minutes
};

export type PresetConfig = {
  label: string;
  start: Date;
  end: Date;
};

export type TimezoneConfig = {
  timezone: string; // IANA timezone identifier (e.g., 'America/New_York')
  label: string;
};

export type ValidationError = {
  type: 'min_date' | 'max_date' | 'min_time' | 'max_time' | 'blackout' | 'min_duration' | 'max_duration' | 'invalid_range';
  message: string;
};
