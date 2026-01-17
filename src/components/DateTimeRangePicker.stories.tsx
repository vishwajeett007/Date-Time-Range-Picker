/**
 * Storybook stories for DateTimeRangePicker
 * @ts-nocheck - onChange is provided by wrapper components
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DateTimeRangePicker } from './DateTimeRangePicker';
import { getRelativePresets, getAbsolutePresets } from '../utils/presets';
import { useState } from 'react';
import type { DateTimeRange } from '../types';

const meta = {
  title: 'Components/DateTimeRangePicker',
  component: DateTimeRangePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A timezone-aware date and time range picker with full keyboard navigation and accessibility support.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'onChange' },
  },
} satisfies Meta<typeof DateTimeRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example with state management
function DateTimeRangePickerWrapper(args: Partial<Parameters<typeof DateTimeRangePicker>[0]>) {
  const [value, setValue] = useState<DateTimeRange>({ start: null, end: null });
  return (
    <div className="w-full max-w-6xl p-6">
      <DateTimeRangePicker {...args} value={value} onChange={setValue} />
    </div>
  );
}

export const Default: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    showPresets: true,
    timezone: 'UTC',
  } as any,
};

export const WithPresets: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    showPresets: true,
    presets: [...getRelativePresets(), ...getAbsolutePresets()],
    timezone: 'America/New_York',
  } as any,
};

export const WithMinMaxConstraints: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    constraints: {
      minDate: new Date(),
      maxDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    },
    timezone: 'UTC',
  } as any,
};

export const WithBlackoutDates: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    constraints: {
      blackoutDates: [
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      ],
    },
    timezone: 'America/New_York',
  } as any,
};

export const WithDurationConstraints: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    constraints: {
      minDuration: 60, // Minimum 1 hour
      maxDuration: 24 * 60, // Maximum 24 hours
    },
    timezone: 'UTC',
  } as any,
};

export const WithTimeConstraints: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    constraints: {
      minTime: '09:00',
      maxTime: '17:00',
    },
    timezone: 'America/New_York',
  } as any,
};

export const WithAllConstraints: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    constraints: {
      minDate: new Date(),
      maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      minTime: '09:00',
      maxTime: '17:00',
      minDuration: 60, // 1 hour
      maxDuration: 8 * 60, // 8 hours
      blackoutDates: [
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      ],
    },
    timezone: 'America/New_York',
    presets: getRelativePresets(),
  } as any,
};

export const EasternTimezone: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    timezone: 'America/New_York',
    presets: getRelativePresets(),
  } as any,
};

export const PacificTimezone: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    timezone: 'America/Los_Angeles',
    presets: getRelativePresets(),
  } as any,
};

export const LondonTimezone: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    timezone: 'Europe/London',
    presets: getRelativePresets(),
  } as any,
};

export const TokyoTimezone: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    timezone: 'Asia/Tokyo',
    presets: getRelativePresets(),
  } as any,
};

// DST transition story - March 2024 DST change in US
export const DSTTransition: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    timezone: 'America/New_York',
    constraints: {
      // Focus around DST transition (March 10, 2024)
      minDate: new Date('2024-03-08T00:00:00Z'),
      maxDate: new Date('2024-03-12T23:59:59Z'),
    },
  } as any,
  parameters: {
    docs: {
      description: {
        story: 'Test DST transition around March 10, 2024. Selected times should not shift during DST changes.',
      },
    },
  },
};

// Pre-filled value story
function PrefilledWrapper() {
  const [value, setValue] = useState<DateTimeRange>({
    start: new Date('2024-03-15T10:00:00Z'),
    end: new Date('2024-03-15T14:00:00Z'),
  });
  return (
    <div className="w-full max-w-6xl p-6">
      <DateTimeRangePicker
        value={value}
        onChange={setValue}
        timezone="America/New_York"
        presets={getRelativePresets()}
      />
    </div>
  );
}

export const PrefilledValue: Story = {
  render: PrefilledWrapper,
  args: {} as any,
  parameters: {
    docs: {
      description: {
        story: 'Component with pre-filled date-time range.',
      },
    },
  },
};

// Keyboard only story
export const KeyboardNavigation: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    timezone: 'UTC',
    presets: getRelativePresets(),
  } as any,
  parameters: {
    docs: {
      description: {
        story: 'Navigate entirely with keyboard: Tab, Arrow keys, Enter/Space to select, Page Up/Down for months.',
      },
    },
  },
};

// High contrast mode
export const HighContrast: Story = {
  render: DateTimeRangePickerWrapper,
  args: {
    timezone: 'UTC',
  } as any,
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story: 'Test component in high contrast scenarios.',
      },
    },
  },
};
