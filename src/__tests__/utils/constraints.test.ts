/**
 * Tests for constraint validation utilities
 */

import { describe, it, expect } from 'vitest';
import { validateRange, isDateDisabled } from '../../utils/constraints';
import type { DateTimeRange, ConstraintConfig } from '../../types';

describe('validateRange', () => {
  it('returns null for valid range', () => {
    const range: DateTimeRange = {
      start: new Date('2024-03-15T10:00:00Z'),
      end: new Date('2024-03-15T14:00:00Z'),
    };
    const constraints: ConstraintConfig = {};

    const result = validateRange(range, constraints);
    expect(result).toBeNull();
  });

  it('validates min date constraint', () => {
    const minDate = new Date('2024-03-20T00:00:00Z');
    const range: DateTimeRange = {
      start: new Date('2024-03-15T10:00:00Z'),
      end: new Date('2024-03-15T14:00:00Z'),
    };
    const constraints: ConstraintConfig = { minDate };

    const result = validateRange(range, constraints);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('min_date');
  });

  it('validates max date constraint', () => {
    const maxDate = new Date('2024-03-10T00:00:00Z');
    const range: DateTimeRange = {
      start: new Date('2024-03-15T10:00:00Z'),
      end: new Date('2024-03-15T14:00:00Z'),
    };
    const constraints: ConstraintConfig = { maxDate };

    const result = validateRange(range, constraints);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('max_date');
  });

  it('validates min duration constraint', () => {
    const range: DateTimeRange = {
      start: new Date('2024-03-15T10:00:00Z'),
      end: new Date('2024-03-15T10:30:00Z'), // 30 minutes
    };
    const constraints: ConstraintConfig = {
      minDuration: 60, // 1 hour
    };

    const result = validateRange(range, constraints);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('min_duration');
  });

  it('validates max duration constraint', () => {
    const range: DateTimeRange = {
      start: new Date('2024-03-15T10:00:00Z'),
      end: new Date('2024-03-15T20:00:00Z'), // 10 hours
    };
    const constraints: ConstraintConfig = {
      maxDuration: 8 * 60, // 8 hours
    };

    const result = validateRange(range, constraints);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('max_duration');
  });

  it('validates blackout dates', () => {
    const blackoutDate = new Date('2024-03-15T12:00:00Z');
    const range: DateTimeRange = {
      start: new Date('2024-03-15T10:00:00Z'),
      end: new Date('2024-03-15T14:00:00Z'),
    };
    const constraints: ConstraintConfig = {
      blackoutDates: [blackoutDate],
    };

    const result = validateRange(range, constraints);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('blackout');
  });

  it('validates invalid range (start >= end)', () => {
    const range: DateTimeRange = {
      start: new Date('2024-03-15T14:00:00Z'),
      end: new Date('2024-03-15T10:00:00Z'),
    };
    const constraints: ConstraintConfig = {};

    const result = validateRange(range, constraints);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('invalid_range');
  });
});

describe('isDateDisabled', () => {
  it('returns false for enabled dates', () => {
    const date = new Date('2024-03-15T10:00:00Z');
    const constraints: ConstraintConfig = {};

    const result = isDateDisabled(date, constraints);
    expect(result).toBe(false);
  });

  it('returns true for dates before min date', () => {
    const minDate = new Date('2024-03-20T00:00:00Z');
    const date = new Date('2024-03-15T10:00:00Z');
    const constraints: ConstraintConfig = { minDate };

    const result = isDateDisabled(date, constraints);
    expect(result).toBe(true);
  });

  it('returns true for blackout dates', () => {
    const blackoutDate = new Date('2024-03-15T10:00:00Z');
    const date = new Date('2024-03-15T10:00:00Z');
    const constraints: ConstraintConfig = {
      blackoutDates: [blackoutDate],
    };

    const result = isDateDisabled(date, constraints);
    expect(result).toBe(true);
  });
});
