import * as React from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  BookOpen, 
  UserCheck, 
  Award, 
  Briefcase, 
  Calendar, 
  Activity,
  ChevronRight,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { RecentActivity, HRInsight, ActivityType, ActivityStatus, InsightType } from '@/types/hrms';

/**
 * Represents a training or onboarding program progress item.
 */
export interface ProgramProgress {
  id: string;
  name: string;
  type: 'training' | 'onboarding';
  completedParticipants: number;
  totalParticipants: number;
  progress: number; // percentage from 0 to 100
  dueDate?: string;
}

/**
 * Props for the InsightsSection component.
 */
export interface InsightsSectionProps {
  insights?: HRInsight[];
  activities?: RecentActivity[];
  trainingProgress?: ProgramProgress[];
  onTakeAction?: (insight: HRInsight) => void;
  onViewAllInsights?: () => void;
  onManagePrograms?: () => void;
  onViewActivityLog?: () => void;
  isLoading?: boolean;
}

// Default mock data to ensure the component renders beautifully if no props are provided
const defaultInsights: HRInsight[] = [
  {
    id: 'ins-1',
    title: 'High Turnover Risk in Engineering',
    description: 'Predictive analysis indicates a 15% increase in turnover risk for mid-level engineers due to stagnation in career progression.',
    type: 'warning',
    category: 'Retention',
    impact: 'high',
    actionLabel: 'Review Career Paths',
  },
  {
    id: 'ins-2',
    title: 'Onboarding Completion Rate Up',
    description: 'The new interactive onboarding flow has increased 30-day completion rates by 22% compared to last quarter.',
    type: 'success',
    category: 'Onboarding',
    impact: 'medium',
    actionLabel: 'View Report',
  },
  {
    id: 'ins-3',
    title: 'Compliance Training Deadline',
    description: 'Annual cybersecurity compliance training is at 68% completion. 12 days remaining to reach the 95% target.',
    type: 'info',
    category: 'Compliance',
    impact: 'high',
    actionLabel: 'Send Reminders',
  },
];

const defaultActivities: RecentActivity[] = [
  {
    id: 'act-1',
    title: 'New Hire Onboarded',
    description: 'Sarah Jenkins completed the Engineering Onboarding track.',
    timestamp: '2 hours ago',
    type: 'onboarding',
    status: 'completed',
  },
  {
    id: 'act-2',
    title: 'Performance Review Submitted',
    description: 'Marcus Vance submitted self-evaluation for Q3 Review.',
    timestamp: '4 hours ago',
    type: 'performance',
    status: 'completed',
  },
  {
    id: 'act-3',
    title: 'Training Session Scheduled',
    description: 'Leadership Essentials workshop scheduled for next Tuesday.',
    timestamp: '1 day ago',
    type: 'training',
    status: 'pending',
  },
  {
    id: 'act-4',
    title: 'Job Offer Accepted',
    description: 'David Kim accepted the Senior Product Designer offer.',
    timestamp: '1 day ago',
    type: 'hiring',
    status: 'completed',
  },
];

const defaultTrainingProgress: ProgramProgress[] = [
  {
    id: 'prog-1',
    name: 'Leadership Essentials 2024',
    type: 'training',
    completedParticipants: 18,
    totalParticipants: 25,
    progress: 72,
    dueDate: 'Oct 15, 2024',
  },
  {
    id: 'prog-2',
    name: 'Q3 Engineering Cohort Onboarding',
    type: 'onboarding',
    completedParticipants: 12,
    totalParticipants: 12,
    progress: 100,
    dueDate: 'Completed',
  },
  {
    id: 'prog-3',
    name: 'Information Security Awareness',
    type: 'training',
    completedParticipants: 145,
    totalParticipants: 210,
    progress: 69,
    dueDate: 'Oct 31, 2024',
  },
  {
    id: 'prog-4',
    name: 'Sales Enablement Bootcamp',
    type: 'training',
    completedParticipants: 8,
    totalParticipants: 15,
    progress: 53,
    dueDate: 'Nov 05, 2024',
  },
];

/**
 * Helper to get the appropriate icon for an insight type.
 */
function getInsightIcon(type: InsightType) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />;
    case 'danger':
      return <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />;
    case 'info':
    default:
      return <Info className="h-5 w-5 text-blue-600 shrink-0" />;
  }
}

/**
 * Helper to get the appropriate background and border colors for an insight card.
 */
function getInsightBgColor(type: InsightType) {
  switch (type) {
    case 'success':
      return 'bg-emerald-50/60 border-emerald-100 text-emerald-900';
    case 'warning':
      return 'bg-amber-50/60 border-amber-100 text-amber-900';
    case 'danger':
      return 'bg-rose-50/60 border-rose-100 text-rose-900';
    case 'info':
    default:
      return 'bg-blue-50/60 border-blue-100 text-blue-900';
  }
}

/**
 * Helper to get the appropriate icon for an activity type.
 */
function getActivityIcon(type: ActivityType) {
  switch (type) {
    case 'onboarding':
      return <UserCheck className="h-4 w-4 text-indigo-600" />;
    case 'training':
      return <BookOpen className="h-4 w-4 text-emerald-600" />;
    case 'hiring':
      return <Briefcase className="h-4 w-4 text-blue-600" />;
    case 'leave':
      return <Calendar className="h-4 w-4 text-amber-600" />;
    case 'performance':
      return <Award className="h-4 w-4 text-purple-600" />;
    case 'system':
    default:
      return <Activity className="h-4 w-4 text-slate-600" />;
  }
}

/**
 * Helper to get the appropriate background color for an activity icon container.
 */
function getActivityBgColor(type: ActivityType) {
  switch (type) {
    case 'onboarding':
      return 'bg-indigo-50 border-indigo-100';
    case 'training':
      return 'bg-emerald-50 border-emerald-100';
    case 'hiring':
      return 'bg-blue-50 border-blue-100';
    case 'leave':
      return 'bg-amber-50 border-amber-100';
    case 'performance':
      return 'bg-purple-50 border-purple-100';
    case 'system':
    default:
      return 'bg-slate-50 border-slate-100';
  }
}

/**
 * Helper to render status badges for activities.
 */
function getStatusBadge(status: ActivityStatus) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[10px] px-1.5 py-0">
          Completed
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 text-[10px] px-1.5 py-0">
          In Progress
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-[10px] px-1.5 py-0">
          Pending
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
          Failed
        </Badge>
      );
    default:
      return null;
  }
}

/**
 * HRInsightsPanel Component
 * Renders a modern, enterprise-grade dashboard section containing:
 * 1. Actionable HR Insights & Recommendations
 * 2. Training & Onboarding Progress Bars
 * 3. Recent Activities Timeline
 */
export function InsightsSection({
  insights = defaultInsights,
  activities = defaultActivities,
  trainingProgress = defaultTrainingProgress,
  onTakeAction,
  onViewAllInsights,
  onManagePrograms,
  onViewActivityLog,
  isLoading = false,
}: InsightsSectionProps): React.JSX.Element {
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border bg-card">
            <CardHeader className="space-y-2">
              <div className="h-5 bg-slate-200 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded w-5/6 animate-pulse" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Column 1: HR Insights & Recommendations */}
      <Card className="border-border bg-card flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              HR Insights
            </CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent">
              AI Powered
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Actionable workforce analysis and predictive alerts.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-1">
          {insights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">No insights available</p>
              <p className="text-xs text-muted-foreground">Check back later for new updates.</p>
            </div>
          ) : (
            insights.map((insight) => (
              <div 
                key={insight.id} 
                className={cn(
                  "p-4 rounded-lg border flex flex-col gap-3 transition-all duration-150 hover:translate-x-0.5",
                  getInsightBgColor(insight.type)
                )}
              >
                <div className="flex gap-3 items-start">
                  {getInsightIcon(insight.type)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold leading-tight">{insight.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] px-1.5 py-0 font-medium uppercase tracking-wider",
                          insight.impact === 'high' 
                            ? 'border-rose-200 bg-rose-100/50 text-rose-800' 
                            : insight.impact === 'medium'
                            ? 'border-amber-200 bg-amber-100/50 text-amber-800'
                            : 'border-blue-200 bg-blue-100/50 text-blue-800'
                        )}
                      >
                        {insight.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
                
                {insight.actionLabel && (
                  <div className="flex justify-end pt-1 border-t border-black/5">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs font-medium hover:bg-black/5 flex items-center gap-1 px-2"
                      onClick={() => onTakeAction?.(insight)}
                    >
                      {insight.actionLabel}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
        
        <CardFooter className="pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full text-xs font-medium flex items-center justify-center gap-1"
            onClick={onViewAllInsights}
          >
            View All Insights
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* Column 2: Training & Onboarding Progress */}
      <Card className="border-border bg-card flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Training & Onboarding
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Active learning programs and cohort progress.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 space-y-5 overflow-y-auto max-h-[400px] pr-1">
          {trainingProgress.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">No active programs</p>
              <p className="text-xs text-muted-foreground">Create a program to track progress.</p>
            </div>
          ) : (
            trainingProgress.map((program) => (
              <div key={program.id} className="space-y-2 p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors duration-150">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium text-foreground line-clamp-1">{program.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-[10px] px-1.5 py-0 font-normal",
                          program.type === 'onboarding' 
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        )}
                      >
                        {program.type === 'onboarding' ? 'Onboarding' : 'Training'}
                      </Badge>
                      {program.dueDate && (
                        <span className="text-[10px] text-muted-foreground">
                          Due: {program.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-foreground shrink-0">
                    {program.progress}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      program.progress === 100 
                        ? "bg-emerald-500" 
                        : program.type === 'onboarding' 
                        ? "bg-indigo-500" 
                        : "bg-primary"
                    )}
                    style={{ width: `${program.progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                  <span>Participants</span>
                  <span className="font-medium text-foreground">
                    {program.completedParticipants} / {program.totalParticipants} completed
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
        
        <CardFooter className="pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full text-xs font-medium flex items-center justify-center gap-1"
            onClick={onManagePrograms}
          >
            Manage Programs
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* Column 3: Recent Activities */}
      <Card className="border-border bg-card flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activities
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Real-time log of HR events and updates.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto max-h-[400px] pr-1">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">No recent activities</p>
              <p className="text-xs text-muted-foreground">Activities will appear as they occur.</p>
            </div>
          ) : (
            <div className="relative pl-4 border-l border-slate-100 space-y-6 py-2">
              {activities.map((activity) => (
                <div key={activity.id} className="relative group">
                  {/* Timeline Dot/Icon */}
                  <div className={cn(
                    "absolute -left-[27px] top-0.5 p-1 rounded-full border-2 border-background flex items-center justify-center shadow-sm transition-transform duration-150 group-hover:scale-110",
                    getActivityBgColor(activity.type)
                  )}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-foreground leading-tight">
                        {activity.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {activity.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {activity.description}
                    </p>
                    {activity.status && (
                      <div className="pt-1">
                        {getStatusBadge(activity.status)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full text-xs font-medium flex items-center justify-center gap-1"
            onClick={onViewActivityLog}
          >
            View Activity Log
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

    </div>
  );
}