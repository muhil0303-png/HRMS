import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { KpiCard } from '../components/dashboard/KpiCard';
import { ChartsSection } from '../components/dashboard/ChartsSection';
import InsightsSection from '../components/dashboard/InsightsSection';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { RefreshCw, Search, Plus, Briefcase, GraduationCap } from 'lucide-react';
import type {
  KpiMetric,
  MonthlyDataPoint,
  DepartmentDataPoint,
  RecruitmentPipeline,
  TrainingProgress,
  HrInsight,
  DashboardFilters,
  DashboardSummary
} from '../types/hrms';

const MOCK_KPIS: KpiMetric[] = [
  {
    id: '1',
    title: 'Total Employees',
    value: '1,248',
    change: '+4.2%',
    trend: 'up',
    type: 'workforce',
    color: 'blue',
    icon: 'users',
    description: 'Active full-time and part-time staff'
  },
  {
    id: '2',
    title: 'Active Recruitments',
    value: '42',
    change: '+12.5%',
    trend: 'up',
    type: 'recruitment',
    color: 'purple',
    icon: 'user-plus',
    description: 'Open positions across all departments'
  },
  {
    id: '3',
    title: 'Training Completion',
    value: '88.4%',
    change: '+2.1%',
    trend: 'up',
    type: 'training',
    color: 'green',
    icon: 'graduation-cap',
    description: 'Compliance and skills training progress'
  },
  {
    id: '4',
    title: 'Retention Rate',
    value: '94.2%',
    change: '-0.5%',
    trend: 'down',
    type: 'retention',
    color: 'amber',
    icon: 'heart',
    description: 'Annualized retention rate'
  }
];

const MOCK_MONTHLY_DATA: MonthlyDataPoint[] = [
  { month: 'Jan', headcount: 1200, attrition: 5, hires: 15 },
  { month: 'Feb', headcount: 1210, attrition: 4, hires: 14 },
  { month: 'Mar', headcount: 1220, attrition: 6, hires: 16 },
  { month: 'Apr', headcount: 1230, attrition: 3, hires: 13 },
  { month: 'May', headcount: 1240, attrition: 5, hires: 15 },
  { month: 'Jun', headcount: 1248, attrition: 4, hires: 12 }
];

const MOCK_DEPARTMENT_DATA: DepartmentDataPoint[] = [
  { department: 'Engineering', count: 450, budget: 1200000, satisfaction: 85 },
  { department: 'Sales', count: 280, budget: 800000, satisfaction: 78 },
  { department: 'Marketing', count: 150, budget: 450000, satisfaction: 82 },
  { department: 'HR', count: 48, budget: 180000, satisfaction: 90 },
  { department: 'Finance', count: 70, budget: 250000, satisfaction: 80 },
  { department: 'Operations', count: 250, budget: 600000, satisfaction: 76 }
];

const MOCK_RECRUITMENT_PIPELINE: RecruitmentPipeline[] = [
  { stage: 'Applied', count: 180, conversionRate: 100 },
  { stage: 'Screening', count: 95, conversionRate: 52.7 },
  { stage: 'Interview', count: 42, conversionRate: 23.3 },
  { stage: 'Offer', count: 12, conversionRate: 6.6 },
  { stage: 'Hired', count: 8, conversionRate: 4.4 }
];

const MOCK_TRAINING_PROGRESS: TrainingProgress[] = [
  { courseId: 't1', courseName: 'Cybersecurity Awareness', completedCount: 1100, totalCount: 1248, dueDate: '2024-12-31' },
  { courseId: 't2', courseName: 'Code of Conduct 2024', completedCount: 1200, totalCount: 1248, dueDate: '2024-11-30' },
  { courseId: 't3', courseName: 'Managerial Leadership', completedCount: 85, totalCount: 120, dueDate: '2024-10-15' },
  { courseId: 't4', courseName: 'Data Privacy & GDPR', completedCount: 950, totalCount: 1248, dueDate: '2024-12-15' }
];

const MOCK_INSIGHTS: HrInsight[] = [
  {
    id: 'in-1',
    title: 'High Attrition Risk in Sales',
    description: 'Sales department shows a 15% increase in attrition risk indicators based on recent feedback surveys.',
    priority: 'high',
    category: 'retention',
    actionable: true,
    suggestedAction: 'Schedule a retention workshop and review compensation benchmarks for Sales roles.',
    createdAt: '2024-10-24T08:30:00Z'
  },
  {
    id: 'in-2',
    title: 'Cybersecurity Training Deadline',
    description: '148 employees have not completed the mandatory Cybersecurity Awareness training due in 30 days.',
    priority: 'medium',
    category: 'training',
    actionable: true,
    suggestedAction: 'Send automated email reminders to outstanding employees and their managers.',
    createdAt: '2024-10-23T10:15:00Z'
  },
  {
    id: 'in-3',
    title: 'Engineering Hiring on Track',
    description: 'Engineering department has met 90% of its Q3 hiring goals, with 12 new hires onboarding next month.',
    priority: 'low',
    category: 'recruitment',
    actionable: false,
    createdAt: '2024-10-22T14:00:00Z'
  }
];

/**
 * Dashboard component orchestrating the main HRMS analytics view.
 * Fetches mock data, manages global filters, and renders KPI cards, charts, and insights.
 */
export default function Dashboard(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    department: 'All',
    timeRange: '6m',
    searchQuery: '',
  });

  const fetchDashboardData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSummary({
        kpis: MOCK_KPIS,
        monthlyData: MOCK_MONTHLY_DATA,
        departmentData: MOCK_DEPARTMENT_DATA,
        recruitmentPipeline: MOCK_RECRUITMENT_PIPELINE,
        trainingProgress: MOCK_TRAINING_PROGRESS,
        insights: MOCK_INSIGHTS,
      });
    } catch (err) {
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFilterChange = (key: keyof DashboardFilters, value: string): void => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">HRMS Dashboard</h1>
            <p className="text-slate-500 mt-1">
              Real-time workforce analytics, recruitment pipeline, and training progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search employees, departments..."
                className="pl-9"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <select
                className="flex h-10 w-full sm:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
              <select
                className="flex h-10 w-full sm:w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={filters.timeRange}
                onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              >
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="12m">Last 12 Months</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive font-medium">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchDashboardData}>
              Try Again
            </Button>
          </div>
        ) : summary ? (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {summary.kpis.map((kpi) => (
                <KpiCard key={kpi.id} metric={kpi} />
              ))}
            </div>

            {/* Charts Section */}
            <ChartsSection
              monthlyData={summary.monthlyData}
              departmentData={summary.departmentData}
            />

            {/* Insights Section */}
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <InsightsSection insights={summary.insights} />
              </div>
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Post a New Job
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Assign Training Course
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}