import React from 'react';
import { Users, UserCheck, Clock, CalendarDays, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { StatCardData } from '../types';

interface StatCardProps {
  card: StatCardData;
  onClick?: () => void;
  isActive?: boolean;
}

const iconMap = {
  Users,
  UserCheck,
  Clock,
  CalendarDays,
};

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    ring: 'focus:ring-blue-500',
    glow: 'bg-blue-400',
  },
  green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    ring: 'focus:ring-emerald-500',
    glow: 'bg-emerald-400',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
    ring: 'focus:ring-amber-500',
    glow: 'bg-amber-400',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
    ring: 'focus:ring-purple-500',
    glow: 'bg-purple-400',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
    ring: 'focus:ring-rose-500',
    glow: 'bg-rose-400',
  },
  slate: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-100',
    ring: 'focus:ring-slate-500',
    glow: 'bg-slate-400',
  },
};

export const StatCard: React.FC<StatCardProps> = ({ card, onClick, isActive = false }) => {
  const IconComponent = iconMap[card.iconName] || Users;
  const colors = colorMap[card.color] || colorMap.blue;

  const renderTrend = (change: number, changeType: 'increase' | 'decrease' | 'neutral') => {
    if (changeType === 'increase') {
      return (
        <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
          +{change}%
        </span>
      );
    }
    if (changeType === 'decrease') {
      return (
        <span className="inline-flex items-center text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
          -{Math.abs(change)}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
        <Minus className="w-3.5 h-3.5 mr-0.5 shrink-0" />
        {change}%
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel hover-card-trigger p-6 rounded-2xl shadow-card flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer focus-ring' : ''
      } ${
        isActive 
          ? 'ring-2 ring-brand-500 border-brand-300 bg-brand-50/10' 
          : 'hover:border-slate-300'
      }`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-selected={isActive}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Decorative background glow */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-xl ${colors.glow}`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
            {card.title}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
            {card.value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} border ${colors.border} shadow-sm transition-transform duration-300 hover:scale-110`}>
          <IconComponent className="w-6 h-6" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        {renderTrend(card.change, card.changeType)}
        <span className="text-xs text-slate-400 font-medium">vs last month</span>
      </div>
    </div>
  );
};