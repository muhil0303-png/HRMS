import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Users, 
  UserPlus, 
  GraduationCap, 
  Clock, 
  Heart, 
  BarChart3,
  type LucideIcon 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';
import type { KpiMetric, ThemeColor, TrendDirection } from '../../types/hrms';

/**
 * Map of icon names to Lucide React components.
 */
const iconMap: Record<string, LucideIcon> = {
  'users': Users,
  'user-plus': UserPlus,
  'graduation-cap': GraduationCap,
  'clock': Clock,
  'heart': Heart,
  'bar-chart': BarChart3,
};

/**
 * Theme color configurations for visual accents.
 */
const colorMap: Record<ThemeColor, { bg: string; text: string; border: string; iconBg: string }> = {
  blue: {
    bg: 'bg-blue-50/40',
    text: 'text-blue-600',
    border: 'border-blue-100/80',
    iconBg: 'bg-blue-100/80 text-blue-700',
  },
  green: {
    bg: 'bg-green-50/40',
    text: 'text-green-600',
    border: 'border-green-100/80',
    iconBg: 'bg-green-100/80 text-green-700',
  },
  purple: {
    bg: 'bg-purple-50/40',
    text: 'text-purple-600',
    border: 'border-purple-100/80',
    iconBg: 'bg-purple-100/80 text-purple-700',
  },
  amber: {
    bg: 'bg-amber-50/40',
    text: 'text-amber-600',
    border: 'border-amber-100/80',
    iconBg: 'bg-amber-100/80 text-amber-700',
  },
  rose: {
    bg: 'bg-rose-50/40',
    text: 'text-rose-600',
    border: 'border-rose-100/80',
    iconBg: 'bg-rose-100/80 text-rose-700',
  },
  indigo: {
    bg: 'bg-indigo-50/40',
    text: 'text-indigo-600',
    border: 'border-indigo-100/80',
    iconBg: 'bg-indigo-100/80 text-indigo-700',
  },
};

export interface KpiCardProps {
  /** The KPI metric data to display */
  metric: KpiMetric;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * KpiCard Component
 * 
 * A highly polished, enterprise-grade visual card for displaying key performance
 * indicators (KPIs) with trend indicators, custom theme colors, and contextual icons.
 */
export const KpiCard: React.FC<KpiCardProps> = ({ metric, className }) => {
  const { title, value, change, trend, color, icon, timeframe } = metric;

  // Resolve theme colors with safe fallbacks
  const theme = colorMap[color] || colorMap.blue;
  
  // Resolve icon component with safe fallback
  const IconComponent = iconMap[icon.toLowerCase()] || BarChart3;

  /**
   * Renders the trend badge based on direction and percentage change.
   */
  const renderTrendBadge = (direction: TrendDirection, percentChange: number) => {
    const isPositive = direction === 'up';
    const isNegative = direction === 'down';

    if (isPositive) {
      return (
        <span 
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full"
          aria-label={`Increased by ${percentChange}%`}
        >
          <TrendingUp className="h-3 w-3 stroke-[2.5]" />
          <span>+{percentChange}%</span>
        </span>
      );
    }

    if (isNegative) {
      return (
        <span 
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full"
          aria-label={`Decreased by ${percentChange}%`}
        >
          <TrendingDown className="h-3 w-3 stroke-[2.5]" />
          <span>{percentChange}%</span>
        </span>
      );
    }

    return (
      <span 
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full"
        aria-label="No change"
      >
        <Minus className="h-3 w-3 stroke-[2.5]" />
        <span>0%</span>
      </span>
    );
  };

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-slate-300/80',
        theme.bg,
        theme.border,
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Title and Value */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              {value}
            </h3>
          </div>

          {/* Icon Container */}
          <div className={cn('p-3 rounded-xl transition-transform duration-200 hover:scale-105', theme.iconBg)}>
            <IconComponent className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        {/* Trend and Contextual Description */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {renderTrendBadge(trend, change)}
          {timeframe && (
            <span className="text-xs text-slate-500 font-medium">
              {timeframe}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiCard;