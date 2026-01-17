# API Documentation

## DateTimeRangePicker Component

### Props

```typescript
interface DateTimeRangePickerProps {
  value?: DateTimeRange;
  onChange: (range: DateTimeRange) => void;
  constraints?: ConstraintConfig;
  presets?: PresetConfig[];
  timezone?: string;
  timezones?: TimezoneConfig[];
  showPresets?: boolean;
  className?: string;
}
```

### Types

#### DateTimeRange

```typescript
type DateTimeRange = {
  start: Date | null;
  end: Date | null;
};
```

#### ConstraintConfig

```typescript
type ConstraintConfig = {
  minDate?: Date;
  maxDate?: Date;
  minTime?: string; // HH:mm format
  maxTime?: string; // HH:mm format
  blackoutDates?: Date[];
  minDuration?: number; // minutes
  maxDuration?: number; // minutes
};
```

#### PresetConfig

```typescript
type PresetConfig = {
  label: string;
  start: Date;
  end: Date;
};
```

#### TimezoneConfig

```typescript
type TimezoneConfig = {
  timezone: string; // IANA timezone identifier
  label: string;
};
```

#### ValidationError

```typescript
type ValidationError = {
  type: 'min_date' | 'max_date' | 'min_time' | 'max_time' | 'blackout' | 'min_duration' | 'max_duration' | 'invalid_range';
  message: string;
};
```

## Utility Functions

### Timezone Utilities

- `convertToTimezone(date: Date, timezone: string): Date`
- `createDateInTimezone(year, month, day, hour, minute, timezone): Date`
- `formatDateInTimezone(date: Date, timezone: string, format: 'date' | 'time' | 'datetime'): string`
- `getCommonTimezones(): TimezoneConfig[]`

### Date Utilities

- `startOfDay(date: Date): Date`
- `endOfDay(date: Date): Date`
- `isSameDay(date1: Date, date2: Date): boolean`
- `isDateBetween(date: Date, start: Date, end: Date): boolean`
- `addDays(date: Date, days: number): Date`
- `addMonths(date: Date, months: number): Date`
- `parseTime(timeString: string): { hours: number; minutes: number }`
- `formatTime(hours: number, minutes: number): string`

### Constraint Utilities

- `validateRange(range: DateTimeRange, constraints: ConstraintConfig): ValidationError | null`
- `isDateDisabled(date: Date, constraints: ConstraintConfig): boolean`

### Preset Utilities

- `getRelativePresets(roundingIntervalMinutes?: number): PresetConfig[]`
- `getAbsolutePresets(): PresetConfig[]`

## Keyboard Navigation

- **Arrow Keys**: Navigate between calendar dates
- **Page Up/Down**: Navigate between months
- **Home/End**: Jump to first/last day of month
- **Enter/Space**: Select date
- **Tab**: Navigate between form elements
- **Arrow Up/Down (Time Picker)**: Increment/decrement hours/minutes

## Accessibility Features

- Full ARIA grid semantics (`role="grid"`, `role="gridcell"`)
- Keyboard navigation support
- Screen reader announcements
- Focus management
- High contrast mode support
- Reduced motion support

## Examples

### Basic Usage

```tsx
<DateTimeRangePicker
  value={range}
  onChange={setRange}
/>
```

### With Constraints

```tsx
<DateTimeRangePicker
  value={range}
  onChange={setRange}
  constraints={{
    minDate: new Date(),
    maxDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    minDuration: 60,
    maxDuration: 8 * 60,
    blackoutDates: [new Date('2024-03-15')],
  }}
/>
```

### With Presets

```tsx
import { getRelativePresets } from './utils/presets';

<DateTimeRangePicker
  value={range}
  onChange={setRange}
  presets={getRelativePresets()}
/>
```

### Custom Timezones

```tsx
<DateTimeRangePicker
  value={range}
  onChange={setRange}
  timezone="America/New_York"
  timezones={[
    { timezone: 'America/New_York', label: 'ET' },
    { timezone: 'America/Los_Angeles', label: 'PT' },
  ]}
/>
```
