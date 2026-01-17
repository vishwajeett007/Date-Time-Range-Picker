# Date-Time Range Picker

A timezone-aware date and time range picker component built with React, TypeScript, and Tailwind CSS. This component features full keyboard navigation, accessibility support, DST-safe timezone handling, and comprehensive constraint validation.

## Features

- ✅ **Date + Time Range Selection**: Select both start and end dates with times
- ✅ **Timezone Support**: Switch between timezones with DST-safe conversions
- ✅ **Presets**: Pre-configured relative and absolute date ranges
- ✅ **Constraint Handling**: Min/max dates, blackout dates, duration limits, and time constraints
- ✅ **Full Keyboard Navigation**: Complete keyboard-only workflow support
- ✅ **Accessibility**: ARIA grid semantics, screen reader support, and focus management
- ✅ **No External Dependencies**: Built from scratch, no date picker libraries
- ✅ **TypeScript**: Fully typed with strict mode enabled
- ✅ **Storybook**: Comprehensive stories for edge cases and DST transitions

## Tech Stack

- **React 18+**
- **TypeScript** (strict mode)
- **Vite**
- **Tailwind CSS**
- **Storybook** with Chromatic
- **Vitest** for testing

## Installation

```bash
npm install
```

## Development

```bash
# Start development server
npm run dev

# Run Storybook
npm run storybook

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Lint code
npm run lint

# Format code
npm run format
```

## Usage

```tsx
import { DateTimeRangePicker } from './components/DateTimeRangePicker';
import type { DateTimeRange } from './types';

function App() {
  const [range, setRange] = useState<DateTimeRange>({
    start: null,
    end: null,
  });

  return (
    <DateTimeRangePicker
      value={range}
      onChange={setRange}
      timezone="America/New_York"
      constraints={{
        minDate: new Date(),
        maxDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        minDuration: 60, // 1 hour
        maxDuration: 24 * 60, // 24 hours
      }}
    />
  );
}
```

## Props

### `DateTimeRangePicker`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `DateTimeRange` | `{ start: null, end: null }` | Current selected range |
| `onChange` | `(range: DateTimeRange) => void` | **Required** | Callback when range changes |
| `constraints` | `ConstraintConfig?` | `undefined` | Date/time constraints |
| `presets` | `PresetConfig[]?` | `undefined` | Custom presets |
| `timezone` | `string` | `'UTC'` | Initial timezone |
| `timezones` | `TimezoneConfig[]?` | `undefined` | Custom timezones |
| `showPresets` | `boolean` | `true` | Show presets section |
| `className` | `string` | `''` | Additional CSS classes |

### `ConstraintConfig`

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

## Keyboard Navigation

- **Arrow Keys**: Navigate between dates
- **Page Up/Down**: Navigate between months
- **Home/End**: Jump to first/last day of month
- **Enter/Space**: Select date
- **Tab**: Navigate between form elements

## Accessibility

- Full ARIA grid semantics for calendar
- Screen reader announcements
- Keyboard-only navigation
- Focus management
- High contrast mode support
- Reduced motion support

## Storybook

The component includes comprehensive Storybook stories covering:

- Basic usage
- Constraint scenarios
- DST transitions
- Multiple timezones
- Keyboard navigation
- Pre-filled values
- Edge cases

To view stories:

```bash
npm run storybook
```

## Testing

Tests cover:

- Constraint validation
- Date selection
- Keyboard interactions
- Timezone conversions
- Accessibility

```bash
npm test
```

## DST Handling

The component handles DST transitions correctly by:

- Using binary search to find correct UTC times
- Preserving exact instants across timezone changes
- Not shifting selected times during DST transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

This is an assignment project. See the assignment requirements for constraints and guidelines.
