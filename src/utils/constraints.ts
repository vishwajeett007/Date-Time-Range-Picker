/**
 * Constraint validation utilities
 */

import type { ConstraintConfig, DateTimeRange, ValidationError } from '../types';
import { parseTime, isSameDay, startOfDay } from './date';

/**
 * Check if a date is blacked out
 */
function isBlackedOut(date: Date, blackoutDates?: Date[]): boolean {
  if (!blackoutDates) return false;
  return blackoutDates.some((blackoutDate) => isSameDay(date, blackoutDate));
}

/**
 * Validate a date-time range against constraints
 */
export function validateRange(
  range: DateTimeRange,
  constraints: ConstraintConfig
): ValidationError | null {
  const { start, end } = range;

  if (!start || !end) {
    return null; // Partial range, not validated yet
  }

  // Check min/max date
  if (constraints.minDate && start < constraints.minDate) {
    return {
      type: 'min_date',
      message: `Start date must be after ${constraints.minDate.toLocaleDateString()}`,
    };
  }

  if (constraints.maxDate && end > constraints.maxDate) {
    return {
      type: 'max_date',
      message: `End date must be before ${constraints.maxDate.toLocaleDateString()}`,
    };
  }

  // Check blackout dates
  if (constraints.blackoutDates) {
    const startBlackedOut = isBlackedOut(start, constraints.blackoutDates);
    const endBlackedOut = isBlackedOut(end, constraints.blackoutDates);

    if (startBlackedOut) {
      return {
        type: 'blackout',
        message: 'Start date is not available',
      };
    }

    if (endBlackedOut) {
      return {
        type: 'blackout',
        message: 'End date is not available',
      };
    }

    // Check if any date in range is blacked out
    const currentDate = startOfDay(start);
    const endDate = startOfDay(end);
    while (currentDate <= endDate) {
      if (isBlackedOut(currentDate, constraints.blackoutDates)) {
        return {
          type: 'blackout',
          message: 'Selected range contains unavailable dates',
        };
      }
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
  }

  // Check range validity
  if (start >= end) {
    return {
      type: 'invalid_range',
      message: 'Start date must be before end date',
    };
  }

  // Check duration constraints
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

  if (constraints.minDuration !== undefined && durationMinutes < constraints.minDuration) {
    return {
      type: 'min_duration',
      message: `Minimum duration is ${constraints.minDuration} minutes`,
    };
  }

  if (constraints.maxDuration !== undefined && durationMinutes > constraints.maxDuration) {
    return {
      type: 'max_duration',
      message: `Maximum duration is ${constraints.maxDuration} minutes`,
    };
  }

  // Check time constraints
  if (constraints.minTime) {
    const { hours: minHours, minutes: minMinutes } = parseTime(constraints.minTime);
    const startHours = start.getUTCHours();
    const startMinutes = start.getUTCMinutes();

    if (
      startHours < minHours ||
      (startHours === minHours && startMinutes < minMinutes)
    ) {
      return {
        type: 'min_time',
        message: `Start time must be after ${constraints.minTime}`,
      };
    }
  }

  if (constraints.maxTime) {
    const { hours: maxHours, minutes: maxMinutes } = parseTime(constraints.maxTime);
    const endHours = end.getUTCHours();
    const endMinutes = end.getUTCMinutes();

    if (
      endHours > maxHours ||
      (endHours === maxHours && endMinutes > maxMinutes)
    ) {
      return {
        type: 'max_time',
        message: `End time must be before ${constraints.maxTime}`,
      };
    }
  }

  return null;
}

/**
 * Check if a date is disabled based on constraints
 */
export function isDateDisabled(date: Date, constraints: ConstraintConfig): boolean {
  if (constraints.minDate && date < constraints.minDate) {
    return true;
  }

  if (constraints.maxDate && date > constraints.maxDate) {
    return true;
  }

  if (isBlackedOut(date, constraints.blackoutDates)) {
    return true;
  }

  return false;
}
