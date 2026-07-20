import React from 'react';
import type {
  HRMSDashboardData,
  UserProfile,
  KPICardData,
  DepartmentMetric,
  RecentActivity,
  HRInsight,
  HiringStage,
  ActivityType,
  ActivityStatus,
  InsightType
} from '@/types/hrms';
import { Header } from '@/components/dashboard/header';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { Charts } from '@/components/dashboard/charts';
import { Insights } from '@/components/dashboard/insights';
import { Footer } from '@/components/dashboard/footer';

// Mock data conforming to enterprise HRMS standards and strict types
const mockUser: UserProfile = {
  id: 'usr-902',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@enterprise.com',
  role: 'HR Director',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
};

const mockKPIs: KPICardData[] = [
  {
    id: 'kpi-1',
    label: 'Total Headcount',
    value: '1,248',
    change: 4.8,
    trend: 'up',
    timeframe: 'vs last month',
    icon: 'users',
    color: 'primary'
  },
  {
    id: 'kpi-2',
    label: 'New Hires',
    value: '32',
    change: 12.5,
    trend: 'up',
    timeframe: 'this month',
    icon: 'user-plus',
    color: 'success'
  },
  {
    id: 'kpi-3',
    label: 'Retention Rate',
    value: '94.2%',
    change: -0.5,
    trend: 'down',
    timeframe: 'vs last quarter',
    icon: 'trending-up',
    color: 'warning'
  },
  {
    id: 'kpi-4',
    label: 'Open Positions',
    value: '45',
    change: 15.4,
    trend: 'up',
    timeframe: 'vs last month',
    icon: 'clock',
    color: 'info'
  }
];

const mockDepartments: DepartmentMetric[] = [
  {
    id: 'dept-1',
    name: 'Engineering',
    headcount: 450,
    budget: 12000000,
    budgetSpent: 8500000,
    openPositions: 18,
    satisfactionScore: 88,
    color: '#3b82f6'
  },
  {
    id: 'dept-2',
    name: 'Product & Design',
    headcount: 120,
    budget: 4500000,
    budgetSpent: 3100000,
    openPositions: 6,
    satisfactionScore: 85,
    color: '#10b981'
  },
  {
    id: 'dept-3',
    name: 'Sales & Marketing',
    headcount: 380,
    budget: 9000000,
    budgetSpent: 6800000,
    openPositions: 12,
    satisfactionScore: 82,
    color: '#f59e0b'
  },
  {
    id: 'dept-4',
    name: 'Operations & HR',
    headcount: 98,
    budget: 2500000,
    budgetSpent: 1900000,
    openPositions: 4,
    satisfactionScore: 91,
    color: '#8b5cf6'
  },
  {
    id: 'dept-5',
    name: 'Finance',
    headcount: 50,
    budget: 1800000,
    budgetSpent: 1200000,
    openPositions: 2,
    satisfactionScore: 86,
    color: '#ec4899'
  }
];

const mockActivities: RecentActivity[] = [
  {
    id: 'act-1',
    userId: 'u-2',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    type: 'hire' as ActivityType,
    description: 'Signed offer letter for Senior Frontend Engineer',
    timestamp: '2 hours ago',
    status: 'completed' as ActivityStatus
  },
  {
    id: 'act-2',
    userId: 'u-3',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    type: 'leave' as ActivityType,
    description: 'Submitted annual leave request (5 days)',
    timestamp: '4 hours ago',
    status: 'pending' as ActivityStatus
  },
  {
    id: 'act-3',
    userId: 'u-4',
    userName: 'David Kim',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    type: 'promotion' as ActivityType,
    description: 'Promoted to Lead Product Designer',
    timestamp: '1 day ago',
    status: 'completed' as ActivityStatus
  }
];

const mockInsights: HRInsight[] = [
  {
    id: 'ins-1',
    title: 'High Attrition Risk in Sales',
    description: 'Sales department shows a 15% increase in turnover risk indicators over the last 30 days.',
    type: 'warning' as InsightType,
    impact: 'high',
    actionable: true,
    actionLabel: 'Review Retention Plan'
  },
  {
    id: 'ins-2',
    title: 'Hiring Velocity Improvement',
    description: 'Average time-to-hire decreased from 42 days to 31 days due to automated screening.',
    type: 'success' as InsightType,
    impact: 'medium',
    actionable: false
  },
  {
    id: 'ins-3',
    title: 'Training Budget Optimization',
    description: '30% of the professional development budget remains unallocated for Q3.',
    type: 'info' as InsightType,
    impact: 'medium',
    actionable: true,
    actionLabel: 'Allocate Budget'
  }
];

const mockHiringStages: HiringStage[] = [
  { id: 'stage-1', stageName: 'Applied', candidateCount: 142, change: 12 },
  { id: 'stage-2', stageName: 'Screening', candidateCount: 64, change: 5 },
  { id: 'stage-3', stageName: 'Interview', candidateCount: 28, change: -2 },
  { id: 'stage-4', stageName: 'Offer', candidateCount: 8, change: 1 }
];

const mockDashboardData: HRMSDashboardData = {
  kpis: mockKPIs,
  departments: mockDepartments,
  recentActivities: mockActivities,
  insights: mockInsights,
  hiringStages: mockHiringStages
};

/**
 * Main HRMS Dashboard Page
 * Assembles the header, KPI cards, charts, insights, and footer in a responsive layout.
 */
export default function DashboardPage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-foreground">
      {/* Professional Reusable Header */}
      <Header user={mockUser} />

      {/* Responsive Dashboard Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* Welcome & Quick Actions Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {mockUser.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here is an overview of your organization's health, hiring pipeline, and key metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              Export Report
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add Employee
            </button>
          </div>
        </div>

        {/* KPI Cards Section */}
        <section aria-label="Key Performance Indicators">
          <KPICards kpis={mockDashboardData.kpis} />
        </section>

        {/* Charts & Analytics Section */}
        <section aria-label="Department and Hiring Analytics">
          <Charts
            departments={mockDashboardData.departments}
            hiringStages={mockDashboardData.hiringStages}
          />
        </section>

        {/* Insights & Recent Activity Section */}
        <section aria-label="HR Insights and Recent Activities">
          <Insights
            insights={mockDashboardData.insights}
            activities={mockDashboardData.recentActivities}
          />
        </section>
      </main>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
}