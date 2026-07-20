import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ThemeColor } from '@/types/hrms';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The current progress value */
  value: number;
  /** The maximum progress value (defaults to 100) */
  max?: number;
  /** Optional label to display above the progress bar */
  label?: React.ReactNode;
  /** Whether to display the percentage/value text */
  showValue?: boolean;
  /** Custom suffix for the value display (defaults to '%') */
  valueSuffix?: string;
  /** Theme color variant matching the HRMS design system */
  color?: ThemeColor;
  /** Height size variant of the progress bar */
  size?: 'sm' | 'md' | 'lg';
  /** Enable smooth transition animation when value changes */
  animated?: boolean;
  /** Custom class name for the inner progress indicator bar */
  barClassName?: string;
}

const colorMap: Record<ThemeColor, { track: string; indicator: string; text: string }> = {
  blue: {
    track: 'bg-hrms-blue-light',
    indicator: 'bg-hrms-blue',
    text: 'text-hrms-blue-dark',
  },
  green: {
    track: 'bg-hrms-green-light',
    indicator: 'bg-hrms-green',
    text: 'text-hrms-green-dark',
  },
  purple: {
    track: 'bg-hrms-purple-light',
    indicator: 'bg-hrms-purple',
    text: 'text-hrms-purple-dark',
  },
  amber: {
    track: 'bg-hrms-amber-light',
    indicator: 'bg-hrms-amber',
    text: 'text-hrms-amber-dark',
  },
  rose: {
    track: 'bg-hrms-rose-light',
    indicator: 'bg-hrms-rose',
    text: 'text-hrms-rose-dark',
  },
  indigo: {
    track: 'bg-hrms-indigo-light',
    indicator: 'bg-hrms-indigo',
    text: 'text-hrms-indigo-dark',
  },
};

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

/**
 * ProgressBar Component
 * 
 * A highly customizable, accessible, and responsive progress bar designed for the HRMS dashboard.
 * Supports custom theme colors, sizes, labels, and smooth transitions.
 */
export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      label,
      showValue = false,
      valueSuffix = '%',
      color = 'blue',
      size = 'md',
      animated = true,
      className,
      barClassName,
      ...props
    },
    ref
  ) => {
    // Ensure value is bounded between 0 and max
    const safeValue = Math.min(Math.max(0, value), max);
    const percentage = max > 0 ? (safeValue / max) * 100 : 0;
    const formattedPercentage = Math.round(percentage);

    const colors = colorMap[color] || colorMap.blue;
    const heightClass = sizeMap[size] || sizeMap.md;

    return (
      <div
        ref={ref}
        className={cn('w-full flex flex-col gap-1.5', className)}
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        {/* Label and Value Header */}
        {(label || showValue) && (
          <div className="flex items-center justify-between text-xs font-medium">
            {label && (
              <span className="text-slate-600 truncate mr-2">
                {label}
              </span>
            )}
            {showValue && (
              <span className={cn('font-semibold tabular-nums', colors.text)}>
                {safeValue}
                {valueSuffix}
              </span>
            )}
          </div>
        )}

        {/* Progress Track */}
        <div
          className={cn(
            'w-full rounded-full overflow-hidden',
            colors.track,
            heightClass
          )}
        >
          {/* Progress Indicator */}
          <div
            className={cn(
              'h-full rounded-full',
              colors.indicator,
              animated && 'transition-all duration-500 ease-out',
              barClassName
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';