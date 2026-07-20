import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building, 
  Bell, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  ChevronRight
} from 'lucide-react';
import type { KPICardData, DepartmentMetric, HRInsight } from '@/types/hrms';

// Mock data conforming to enterprise HRMS types
const kpiData: KPICardData[] = [
  {
    id: '1',
    label: 'Total Headcount',
    value: '1,248',
    change: 12,
    trend: 'up',
    timeframe: 'vs last month',
    icon: 'users',
    color: 'primary',
  },
  {
    id: '2',
    label: 'Active Recruitments',
    value: '42',
    change: 8,
    trend: 'up',
    timeframe: 'vs last month',
    icon: 'user-plus',
    color: 'success',
  },
  {
    id: '3',
    label: 'Monthly Payroll',
    value: '$320,400',
    change: -2.4,
    trend: 'down',
    timeframe: 'vs last month',
    icon: 'dollar-sign',
    color: 'warning',
  },
  {
    id: '4',
    label: 'Retention Rate',
    value: '94.2%',
    change: 1.5,
    trend: 'up',
    timeframe: 'vs last quarter',
    icon: 'trending-up',
    color: 'info',
  },
];

const departmentMetrics: DepartmentMetric[] = [
  {
    id: 'd1',
    name: 'Engineering',
    headcount: 450,
    budget: 1200000,
    budgetSpent: 950000,
    openPositions: 18,
    satisfactionScore: 88,
  },
  {
    id: 'd2',
    name: 'Sales & Marketing',
    headcount: 320,
    budget: 850000,
    budgetSpent: 720000,
    openPositions: 12,
    satisfactionScore: 82,
  },
  {
    id: 'd3',
    name: 'Product & Design',
    headcount: 180,
    budget: 500000,
    budgetSpent: 410000,
    openPositions: 6,
    satisfactionScore: 91,
  },
  {
    id: 'd4',
    name: 'Operations & HR',
    headcount: 98,
    budget: 250000,
    budgetSpent: 210000,
    openPositions: 4,
    satisfactionScore: 85,
  },
];

const hrInsights: HRInsight[] = [
  {
    id: 'in-1',
    title: 'High Turnover Risk Alert',
    description: 'Predictive analysis shows a 15% increase in turnover risk within the Sales department due to recent compensation shifts.',
    type: 'warning',
    category: 'Retention',
    actionable: true,
    createdAt: '2024-04-15',
  },
  {
    id: 'in-2',
    title: 'Training Budget Optimization',
    description: 'Upskilling programs in Engineering have saved $45k in external hiring costs over the last 60 days.',
    type: 'success',
    category: 'L&D',
    actionable: true,
    createdAt: '2024-04-14',
  },
  {
    id: 'in-3',
    title: 'Diversity & Inclusion Milestone',
    description: 'Female representation in leadership roles has increased by 4.2% this quarter, meeting the Q3 corporate milestone.',
    type: 'info',
    category: 'D&I',
    actionable: false,
    createdAt: '2024-04-12',
  },
];

/** Helper to render correct KPI icon */
function getKpiIcon(icon: string): React.ReactNode {
  switch (icon) {
    case 'users':
      return <Users className="h-5 w-5" />;
    case 'user-plus':
      return <UserPlus className="h-5 w-5" />;
    case 'trending-up':
      return <TrendingUp className="h-5 w-5" />;
    case 'dollar-sign':
      return <DollarSign className="h-5 w-5" />;
    case 'award':
      return <Award className="h-5 w-5" />;
    case 'clock':
      return <Clock className="h-5 w-5" />;
    default:
      return <Users className="h-5 w-5" />;
  }
}

/** Helper to map KPI color to Tailwind classes */
function getKpiColorClass(color: string): string {
  switch (color) {
    case 'primary':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'success':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'warning':
      return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'danger':
      return 'bg-rose-50 text-rose-600 border-rose-100';
    case 'info':
      return 'bg-sky-50 text-sky-600 border-sky-100';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-100';
  }
}

/** Reusable Header Component */
function Header(): React.ReactElement {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Building className="h-6 w-6 text-primary" />
            <span>HRMS<span className="text-muted-foreground font-normal">.io</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="text-foreground transition-colors hover:text-foreground">Dashboard</a>
            <a href="#" className="transition-colors hover:text-foreground">Directory</a>
            <a href="#" className="transition-colors hover:text-foreground">Recruitment</a>
            <a href="#" className="transition-colors hover:text-foreground">Payroll</a>
            <a href="#" className="transition-colors hover:text-foreground">Analytics</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search employees..." className="pl-8 h-9" />
          </div>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <div className="flex items-center gap-2 border-l pl-4 border-border">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold leading-none">Admin Director</p>
              <p className="text-[10px] text-muted-foreground">admin@hrms.io</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/** Reusable Footer Component */
function Footer(): React.ReactElement {
  return (
    <footer className="border-t border-border bg-background py-6">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-6 text-xs text-muted-foreground">
        <div>
          &copy; {new Date().getFullYear()} HRMS Enterprise. All rights reserved.
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>All Systems Operational</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Support</a>
        </div>
      </div>
    </footer>
  );
}

/** Root Entry Page rendering the HRMS Dashboard */
export default function HRMSDashboard(): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-foreground">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HRMS Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin. Here is your workforce overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">Export Report</Button>
            <Button size="sm">Add Employee</Button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => {
            const isUp = kpi.trend === 'up';
            return (
              <Card key={kpi.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
                    <div className={cn("p-2 rounded-lg border", getKpiColorClass(kpi.color))}>
                      {getKpiIcon(kpi.icon)}
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-bold tracking-tight">{kpi.value}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant={isUp ? "default" : "destructive"} className={cn(
                        "px-1.5 py-0 text-[10px] font-semibold",
                        isUp ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50"
                      )}>
                        {isUp ? <ArrowUpRight className="h-3 w-3 mr-0.5 inline" /> : <ArrowDownRight className="h-3 w-3 mr-0.5 inline" />}
                        {Math.abs(kpi.change)}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">{kpi.timeframe}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Department Metrics Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Department Distribution & Budgets</CardTitle>
              <CardDescription>Overview of headcount, budget utilization, and employee satisfaction across departments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {departmentMetrics.map((dept) => {
                const budgetPercent = Math.round((dept.budgetSpent / dept.budget) * 100);
                return (
                  <div key={dept.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{dept.name}</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {dept.headcount} Employees
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{dept.openPositions} Open Roles</span>
                        <span className="font-medium text-foreground">Satisfaction: {dept.satisfactionScore}%</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            budgetPercent > 90 ? "bg-rose-500" : budgetPercent > 75 ? "bg-amber-500" : "bg-blue-600"
                          )}
                          style={{ width: `${budgetPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Budget Spent: ${dept.budgetSpent.toLocaleString()}</span>
                        <span>Total: ${dept.budget.toLocaleString()} ({budgetPercent}%)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* HR Insights Card */}
          <Card>
            <CardHeader>
              <CardTitle>Actionable HR Insights</CardTitle>
              <CardDescription>AI-driven recommendations and critical workforce alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hrInsights.map((insight) => {
                const isWarning = insight.type === 'warning';
                const isSuccess = insight.type === 'success';
                return (
                  <div key={insight.id} className="flex gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="mt-0.5">
                      {isWarning ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      ) : isSuccess ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Info className="h-5 w-5 text-sky-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">{insight.title}</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 uppercase tracking-wider">
                          {insight.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" className="w-full text-xs mt-2" size="sm">
                View All Insights
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}