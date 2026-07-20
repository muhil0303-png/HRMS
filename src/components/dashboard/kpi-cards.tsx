import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { KPICardData } from '@/types/hrms';
import {
  Users,
  UserPlus,
  TrendingUp,
  DollarSign,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

/**
 * Map of icon identifiers to their respective Lucide React components.
 */
const iconMap = {
  'users': Users,
  'user-plus': UserPlus,
  'trending-up': TrendingUp,
  'dollar-sign': DollarSign,
  'award': Award,
  'clock': Clock,
};

/**
 * Map of color variants to Tailwind CSS class combinations.
 */
const colorMap = {
  primary: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-900/30',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-900/30',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-900/30',
  },
  danger: {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-100 dark:border-rose-900/30',
  },
  info: {
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-100 dark:border-sky-900/30',
  },
};

interface KPICardsProps {
  /** Array of KPI card data objects to display */
  cards: KPICardData[];
  /** Optional loading state to display skeleton placeholders */
  isLoading?: boolean;
  /** Optional additional class names for the grid container */
  className?: string;
}

/**
 * A skeleton placeholder component for a single KPI card.
 */
function KPICardSkeleton(): React.JSX.Element {
  return (
    <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-2 pt-1">
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Responsive grid of KPI cards displaying key HR metrics with trend indicators.
 * Adheres to enterprise UI standards with full accessibility and responsive layouts.
 */
export function KPICards({
  cards,
  isLoading = false,
  className,
}: KPICardsProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
          className
        )}
        aria-label="Loading metrics"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <KPICardSkeleton key={`kpi-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
      role="region"
      aria-label="Key Performance Indicators"
    >
      {cards.map((card) => {
        const IconComponent = iconMap[card.icon] || Users;
        const colors = colorMap[card.color] || colorMap.primary;

        return (
          <Card
            key={card.id}
            className="group overflow-hidden border-border/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-border"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <p className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {card.label}
                </p>
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105',
                    colors.bg,
                    colors.text,
                    colors.border
                  )}
                  aria-hidden="true"
                >
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    {typeof card.value === 'number'
                      ? card.value.toLocaleString()
                      : card.value}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  {card.trend === 'up' && (
                    <span
                      className="inline-flex items-center gap-0.5 font-semibold text-emerald-600 dark:text-emerald-400"
                      aria-label="Increased by"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                      {card.change}%
                    </span>
                  )}
                  {card.trend === 'down' && (
                    <span
                      className="inline-flex items-center gap-0.5 font-semibold text-rose-600 dark:text-rose-400"
                      aria-label="Decreased by"
                    >
                      <ArrowDownRight className="h-3.5 w-3.5 shrink-0" />
                      {card.change}%
                    </span>
                  )}
                  {card.trend === 'neutral' && (
                    <span
                      className="inline-flex items-center gap-0.5 font-semibold text-muted-foreground"
                      aria-label="No change"
                    >
                      <Minus className="h-3.5 w-3.5 shrink-0" />
                      {card.change}%
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    {card.timeframe}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}