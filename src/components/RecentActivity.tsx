import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  RefreshCw, 
  Search, 
  Filter, 
  Clock, 
  Trash2, 
  RotateCcw, 
  ChevronDown, 
  AlertCircle,
  SlidersHorizontal
} from 'lucide-react';
import type { Activity, ActivityType } from '../types';

interface RecentActivityProps {
  activities: Activity[];
  onClearActivities?: () => void;
  onResetActivities?: () => void;
}

const activityConfig = {
  onboarding: {
    icon: UserPlus,
    bgColor: 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    label: 'Onboarding',
  },
  leave_approved: {
    icon: CheckCircle2,
    bgColor: 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400',
    iconColor: 'text-blue-600 dark:text-blue-400',
    label: 'Leave Approved',
  },
  leave_rejected: {
    icon: XCircle,
    bgColor: 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400',
    iconColor: 'text-rose-600 dark:text-rose-400',
    label: 'Leave Rejected',
  },
  leave_applied: {
    icon: Calendar,
    bgColor: 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-400',
    label: 'Leave Applied',
  },
  status_change: {
    icon: RefreshCw,
    bgColor: 'bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-950/30 dark:border-purple-900/50 dark:text-purple-400',
    iconColor: 'text-purple-600 dark:text-purple-400',
    label: 'Status Change',
  },
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  
  if (isNaN(diffMs)) {
    return timestamp;
  }

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onClearActivities,
  onResetActivities,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityType | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(5);
  const [showFilters, setShowFilters] = useState(false);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch = 
        activity.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.userName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || activity.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [activities, searchQuery, selectedType]);

  const visibleActivities = useMemo(() => {
    return filteredActivities.slice(0, visibleCount);
  }, [filteredActivities, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setVisibleCount(5);
  };

  return (
    <section 
      className="bg-white rounded-xl border border-slate-200 shadow-card flex flex-col h-full overflow-hidden"
      aria-labelledby="recent-activity-title"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <h2 
            id="recent-activity-title" 
            className="text-lg font-semibold text-slate-900 tracking-tight"
          >
            Recent Activity
          </h2>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            {filteredActivities.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border text-slate-600 hover:bg-slate-50 transition-colors focus-ring ${
              showFilters ? 'bg-slate-100 border-slate-300' : 'border-slate-200'
            }`}
            title="Toggle Filters"
            aria-label="Toggle Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {onResetActivities && (
            <button
              onClick={onResetActivities}
              className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors focus-ring"
              title="Reset Activity Feed"
              aria-label="Reset Activity Feed"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {onClearActivities && activities.length > 0 && (
            <button
              onClick={onClearActivities}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors focus-ring"
              title="Clear All Logs"
              aria-label="Clear All Logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {(showFilters || searchQuery || selectedType !== 'all') && (
        <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-200">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs or users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(5);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus-ring text-slate-900 placeholder-slate-400"
              aria-label="Search activity logs"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value as ActivityType | 'all');
                setVisibleCount(5);
              }}
              className="w-full pl-9 pr-10 py-2 text-sm bg-white border border-slate-200 rounded-lg focus-ring text-slate-900 appearance-none cursor-pointer"
              aria-label="Filter by activity type"
            >
              <option value="all">All Activity Types</option>
              <option value="onboarding">Onboarding</option>
              <option value="leave_approved">Leave Approved</option>
              <option value="leave_rejected">Leave Rejected</option>
              <option value="leave_applied">Leave Applied</option>
              <option value="status_change">Status Change</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Activity Feed List */}
      <div className="flex-1 overflow-y-auto p-5 min-h-[320px]">
        {visibleActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No activities found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              {activities.length === 0 
                ? "There are no recent activities logged in the system yet." 
                : "Try adjusting your search query or filter criteria to find what you're looking for."}
            </p>
            {(searchQuery || selectedType !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="mt-4 text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline focus-ring"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
            {visibleActivities.map((activity) => {
              const config = activityConfig[activity.type] || {
                icon: Clock,
                bgColor: 'bg-slate-50 border-slate-100 text-slate-600',
                iconColor: 'text-slate-600',
                label: 'System Log',
              };
              const IconComponent = config.icon;

              return (
                <div 
                  key={activity.id} 
                  className="relative group hover-card-trigger rounded-lg p-2 -mx-2 transition-all duration-150"
                >
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-[35px] top-3 flex items-center justify-center">
                    <div className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${config.bgColor}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="flex items-start gap-3">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {activity.userAvatar ? (
                        <img
                          src={activity.userAvatar}
                          alt={activity.userName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            (e.target as HTMLImageElement).style.display = 'none';
                            const fallback = (e.target as HTMLImageElement).nextSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-9 h-9 rounded-full bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold"
                        style={{ display: activity.userAvatar ? 'none' : 'flex' }}
                      >
                        {getInitials(activity.userName)}
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold text-slate-900 hover:text-brand-600 transition-colors cursor-pointer">
                            {activity.userName}
                          </span>{' '}
                          {activity.message}
                        </p>
                        <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                      </div>

                      {/* Meta Badge */}
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${config.bgColor}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer / Load More */}
      {filteredActivities.length > visibleCount && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors focus-ring shadow-sm"
          >
            Load More Activities
          </button>
        </div>
      )}
    </section>
  );
};