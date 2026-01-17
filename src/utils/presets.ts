/**
 * Preset utilities for date-time ranges
 */

import type { PresetConfig } from '../types';
import { addDays, startOfDay, endOfDay } from './date';

/**
 * Round a date to the nearest interval (e.g., 15 minutes)
 */
function roundToInterval(date: Date, intervalMinutes: number): Date {
  const rounded = new Date(date);
  const minutes = rounded.getMinutes();
  const roundedMinutes = Math.round(minutes / intervalMinutes) * intervalMinutes;
  rounded.setUTCMinutes(roundedMinutes, 0, 0);
  return rounded;
}

/**
 * Get common relative presets
 */
export function getRelativePresets(roundingIntervalMinutes = 15): PresetConfig[] {
  const now = new Date();
  const roundedNow = roundToInterval(now, roundingIntervalMinutes);

  // Helper to add hours
  const addHours = (date: Date, hours: number): Date => {
    const result = new Date(date);
    result.setUTCHours(result.getUTCHours() + hours);
    return result;
  };

  return [
    {
      label: 'Last 1 hour',
      start: addHours(roundedNow, -1),
      end: roundedNow,
    },
    {
      label: 'Last 4 hours',
      start: addHours(roundedNow, -4),
      end: roundedNow,
    },
    {
      label: 'Last 24 hours',
      start: addHours(roundedNow, -24),
      end: roundedNow,
    },
    {
      label: 'Today',
      start: startOfDay(now),
      end: endOfDay(now),
    },
    {
      label: 'Yesterday',
      start: startOfDay(addDays(now, -1)),
      end: endOfDay(addDays(now, -1)),
    },
    {
      label: 'Last 7 days',
      start: startOfDay(addDays(now, -7)),
      end: endOfDay(now),
    },
    {
      label: 'Last 30 days',
      start: startOfDay(addDays(now, -30)),
      end: endOfDay(now),
    },
    {
      label: 'This month',
      start: startOfDay(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))),
      end: endOfDay(now),
    },
    {
      label: 'Last month',
      start: startOfDay(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))),
      end: endOfDay(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0))),
    },
  ];
}

/**
 * Get absolute presets (e.g., predefined date ranges)
 */
export function getAbsolutePresets(): PresetConfig[] {
  const now = new Date();
  const currentYear = now.getUTCFullYear();

  return [
    {
      label: `Q1 ${currentYear}`,
      start: startOfDay(new Date(Date.UTC(currentYear, 0, 1))),
      end: endOfDay(new Date(Date.UTC(currentYear, 2, 31))),
    },
    {
      label: `Q2 ${currentYear}`,
      start: startOfDay(new Date(Date.UTC(currentYear, 3, 1))),
      end: endOfDay(new Date(Date.UTC(currentYear, 5, 30))),
    },
    {
      label: `Q3 ${currentYear}`,
      start: startOfDay(new Date(Date.UTC(currentYear, 6, 1))),
      end: endOfDay(new Date(Date.UTC(currentYear, 8, 30))),
    },
    {
      label: `Q4 ${currentYear}`,
      start: startOfDay(new Date(Date.UTC(currentYear, 9, 1))),
      end: endOfDay(new Date(Date.UTC(currentYear, 11, 31))),
    },
  ];
}
