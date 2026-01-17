/**
 * Timezone utilities with DST-safe conversion
 * All operations preserve the exact instant in time
 */

/**
 * Get the current timezone offset in minutes for a given date
 */
export function getTimezoneOffset(date: Date, timezone: string): number {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
}

/**
 * Convert a date to a specific timezone while preserving the instant
 * This function ensures DST transitions don't shift the selected instant
 */
export function convertToTimezone(date: Date, timezone: string): Date {
  // Use Intl.DateTimeFormat to properly handle timezone conversions
  // This respects DST transitions
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const year = parseInt(parts.find((p) => p.type === 'year')?.value ?? '0', 10);
  const month = parseInt(parts.find((p) => p.type === 'month')?.value ?? '0', 10) - 1;
  const day = parseInt(parts.find((p) => p.type === 'day')?.value ?? '0', 10);
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);
  const second = parseInt(parts.find((p) => p.type === 'second')?.value ?? '0', 10);

  // Create a date in the target timezone
  // We need to use UTC methods to avoid local timezone interference
  const utcString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  
  // Get the offset for this specific date/time in the target timezone
  const localDate = new Date(utcString);
  const offsetInMs = getTimezoneOffset(localDate, timezone) * 60 * 1000;
  
  // Return a date that represents the same instant
  return new Date(localDate.getTime() - offsetInMs);
}

/**
 * Create a date in a specific timezone from year, month, day, hour, minute
 * This preserves the local time representation in that timezone
 * Uses a binary search approach to find the correct UTC time
 */
export function createDateInTimezone(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timezone: string
): Date {
  // Create a rough estimate
  const roughDate = new Date(Date.UTC(year, month, day, hour, minute, 0));
  
  // Use Intl.DateTimeFormat to format in the target timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Binary search for the correct UTC time
  let low = roughDate.getTime() - 24 * 60 * 60 * 1000; // 24 hours before
  let high = roughDate.getTime() + 24 * 60 * 60 * 1000; // 24 hours after
  let bestDate = roughDate;

  // Find the UTC time that formats to our desired local time
  for (let i = 0; i < 20; i++) { // Limit iterations
    const mid = Math.floor((low + high) / 2);
    const testDate = new Date(mid);
    const formatted = formatter.formatToParts(testDate);
    
    const tzYear = parseInt(formatted.find((p) => p.type === 'year')?.value ?? '0', 10);
    const tzMonth = parseInt(formatted.find((p) => p.type === 'month')?.value ?? '0', 10) - 1;
    const tzDay = parseInt(formatted.find((p) => p.type === 'day')?.value ?? '0', 10);
    const tzHour = parseInt(formatted.find((p) => p.type === 'hour')?.value ?? '0', 10);
    const tzMinute = parseInt(formatted.find((p) => p.type === 'minute')?.value ?? '0', 10);

    if (tzYear === year && tzMonth === month && tzDay === day && tzHour === hour && tzMinute === minute) {
      bestDate = testDate;
      break;
    }

    const comparison = 
      tzYear !== year ? (tzYear < year ? -1 : 1) :
      tzMonth !== month ? (tzMonth < month ? -1 : 1) :
      tzDay !== day ? (tzDay < day ? -1 : 1) :
      tzHour !== hour ? (tzHour < hour ? -1 : 1) :
      tzMinute !== minute ? (tzMinute < minute ? -1 : 1) : 0;

    if (comparison < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return bestDate;
}

/**
 * Format a date in a specific timezone
 */
export function formatDateInTimezone(date: Date, timezone: string, format: 'date' | 'time' | 'datetime' = 'datetime'): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour12: false,
  };

  if (format === 'date' || format === 'datetime') {
    options.year = 'numeric';
    options.month = '2-digit';
    options.day = '2-digit';
  }

  if (format === 'time' || format === 'datetime') {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  const formatter = new Intl.DateTimeFormat('en-CA', options);
  return formatter.format(date);
}

/**
 * Get a list of common timezones
 */
export function getCommonTimezones(): Array<{ timezone: string; label: string }> {
  return [
    { timezone: 'UTC', label: 'UTC' },
    { timezone: 'America/New_York', label: 'Eastern Time (ET)' },
    { timezone: 'America/Chicago', label: 'Central Time (CT)' },
    { timezone: 'America/Denver', label: 'Mountain Time (MT)' },
    { timezone: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { timezone: 'Europe/London', label: 'London (GMT)' },
    { timezone: 'Europe/Paris', label: 'Paris (CET)' },
    { timezone: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { timezone: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { timezone: 'Australia/Sydney', label: 'Sydney (AEDT)' },
  ];
}
