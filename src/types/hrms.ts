/**
 * Represents the trend direction for a KPI metric.
 */
export type TrendDirection = 'up' | 'down' | 'neutral';

/**
 * Represents a single Key Performance Indicator (KPI) card data.
 */
export interface KPICardData {
  id: string;
  label: string;
  value: string | number;
  change: number; // e.g., 12 for +12%
  trend: TrendDirection;
  timeframe: string; // e.g., "vs last month"
  icon: 'users' | 'user-plus' | 'trending-up' | 'dollar-sign' | 'award' | 'clock';
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

/**
 * Represents a department's high-level metrics.
 */
export interface DepartmentMetric {
  id: string;
  name: string;
  headcount: number;
  budget: number;
  budgetSpent: number;
  openPositions: number;
  satisfactionScore: number; // out of 100
  color: string; // Tailwind color class prefix, e.g., 'blue', 'emerald'
}

/**
 * Represents the type of a recent activity.
 */
export type ActivityType = 'hire' | 'leave' | 'promotion' | 'training' | 'announcement' | 'performance';

/**
 * Represents the status of an activity or request.
 */
export type ActivityStatus = 'completed' | 'pending' | 'approved' | 'rejected' | 'info';

/**
 * Represents an activity log entry in the HRMS.
 */
export interface RecentActivity {
  id: string;
  type: ActivityType;
  employeeName: string;
  avatarUrl?: string;
  description: string;
  timestamp: string; // Relative time, e.g., "2 hours ago"
  status?: ActivityStatus;
}

/**
 * Represents the type of an HR insight or recommendation.
 */
export type InsightType = 'warning' | 'success' | 'info' | 'action';

/**
 * Represents an actionable HR insight or recommendation.
 */
export interface HRInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  impactMetric?: string; // e.g., "Reduces turnover by 4%"
  actionLabel?: string; // e.g., "Review Salaries"
  category: 'retention' | 'hiring' | 'compliance' | 'budget' | 'culture';
}

/**
 * Represents a stage in the hiring/recruitment pipeline.
 */
export interface HiringStage {
  id: string;
  stageName: string;
  candidateCount: number;
  percentage: number; // percentage of total pipeline (0-100)
}

/**
 * Represents the overall HRMS Dashboard state/data payload.
 */
export interface HRMSDashboardData {
  kpis: KPICardData[];
  departments: DepartmentMetric[];
  recentActivities: RecentActivity[];
  insights: HRInsight[];
  hiringPipeline: HiringStage[];
  lastUpdated: string;
}

/**
 * Represents user profile information for the header.
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}