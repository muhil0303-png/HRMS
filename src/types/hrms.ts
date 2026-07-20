/**
 * @file hrms.ts
 * @description TypeScript interfaces and types for the HRMS Dashboard.
 * This is a frozen contract file containing shared data shapes for KPIs,
 * charts, insights, and employee statistics.
 */

/**
 * Type representing the category of a KPI metric.
 */
export type KpiMetricType = 'workforce' | 'recruitment' | 'training' | 'retention' | 'attendance';

/**
 * Type representing the trend direction of a KPI metric.
 */
export type TrendDirection = 'up' | 'down' | 'neutral';

/**
 * Type representing the color theme of a KPI card or UI element.
 */
export type ThemeColor = 'blue' | 'green' | 'purple' | 'amber' | 'rose' | 'indigo';

/**
 * Interface representing a single KPI metric card's data.
 */
export interface KpiMetric {
  id: string;
  title: string;
  value: string | number;
  change: number; // Percentage change, e.g., 12.5 for +12.5% or -3.2 for -3.2%
  trend: TrendDirection;
  timeframe: string; // e.g., "vs last month"
  icon: string; // Icon identifier (e.g., 'users', 'user-plus', 'award', 'heart-off', 'calendar')
  color: ThemeColor;
  type: KpiMetricType;
  description?: string; // Optional description
}

/**
 * Interface representing monthly workforce statistics for trend charts.
 */
export interface MonthlyDataPoint {
  month: string; // e.g., "Jan", "Feb", "Mar"
  headcount: number;
  attrition: number;
  hired: number;
  terminated: number;
}

/**
 * Interface representing department-specific metrics.
 */
export interface DepartmentDataPoint {
  department: string; // e.g., "Engineering", "Sales", "HR"
  headcount: number;
  budget: number; // Total budget allocated
  spent: number; // Budget spent so far
  satisfaction: number; // Employee satisfaction score (e.g., 1 to 100)
}

/**
 * Interface representing recruitment pipeline stages and counts.
 */
export interface RecruitmentPipeline {
  stage: string; // e.g., "Applied", "Screening", "Interview", "Offer", "Hired"
  count: number;
  conversionRate: number; // Percentage conversion from previous stage or overall
}

/**
 * Interface representing training course progress across the organization.
 */
export interface TrainingProgress {
  courseName: string;
  enrolled: number;
  completed: number;
  inProgress: number;
}

/**
 * Priority levels for HR insights and recommendations.
 */
export type InsightPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Categories for HR insights.
 */
export type InsightCategory = 'retention' | 'compliance' | 'hiring' | 'performance' | 'budget';

/**
 * Interface representing an actionable HR insight or recommendation.
 */
export interface HrInsight {
  id: string;
  title: string;
  description: string;
  category: InsightCategory;
  priority: InsightPriority;
  impact: string; // Description of the business impact
  actionableStep: string; // Recommended next step for HR admin
  createdAt: string; // ISO date string
  isResolved: boolean;
}

/**
 * Employment status of an employee.
 */
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';

/**
 * Filters for the HRMS Dashboard.
 */
export interface DashboardFilters {
  department: string;
  timeRange: string;
  searchQuery: string;
}

/**
 * Summary data structure for the HRMS Dashboard.
 */
export interface DashboardSummary {
  kpis: KpiMetric[];
  monthlyData: MonthlyDataPoint[];
  departmentData: DepartmentDataPoint[];
  recruitmentPipeline: RecruitmentPipeline[];
  trainingProgress: TrainingProgress[];
  insights: HrInsight[];
}
export type EmployeeStatus = 'active' | 'onleave' | 'terminated' | 'suspended';

/**
 * Organizational roles/levels.
 */
export type EmployeeRole = 'intern' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'vp' | 'c-level';

/**
 * Interface representing an individual employee's profile and statistics.
 */
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  joinDate: string; // ISO date string (YYYY-MM-DD)
  performanceRating: number; // Rating scale, e.g., 1 to 5
  salary: number; // Annual salary in USD
  avatarUrl?: string; // Optional URL to employee avatar image
}

/**
 * Interface representing active filters applied to the dashboard.
 */
export interface DashboardFilters {
  department: string; // "All" or specific department name
  timeframe: 'month' | 'quarter' | 'year';
  status: 'all' | EmployeeStatus;
}

/**
 * Interface representing the aggregated dashboard state.
 * This acts as the single source of truth for the dashboard UI.
 */
export interface DashboardSummary {
  kpis: KpiMetric[];
  monthlyWorkforceTrend: MonthlyDataPoint[];
  departmentDistribution: DepartmentDataPoint[];
  recruitmentPipeline: RecruitmentPipeline[];
  trainingProgress: TrainingProgress[];
  insights: HrInsight[];
  recentEmployees: Employee[];
}