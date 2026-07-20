import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  ComposedChart,
  Area,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MonthlyDataPoint, DepartmentDataPoint } from '@/types/hrms';

/**
 * Props for the ChartsSection component.
 */
interface ChartsSectionProps {
  monthlyData: MonthlyDataPoint[];
  departmentData: DepartmentDataPoint[];
  className?: string;
}

/**
 * Custom tooltip payload item interface for Recharts.
 */
interface TooltipPayloadItem {
  name: string;
  value: number;
  color?: string;
  fill?: string;
}

/**
 * Custom tooltip component for Recharts to match the enterprise light theme.
 */
const CustomTooltip = ({
  active,
  payload,
  label,
  valueSuffix = '',
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  valueSuffix?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-md">
        <p className="mb-1.5 text-xs font-semibold text-slate-900">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <span className="text-slate-500">{entry.name}:</span>
              <span className="font-semibold text-slate-900">
                {entry.value.toLocaleString()}
                {valueSuffix}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Professional color palette for department distribution
const DEPARTMENT_COLORS = [
  '#2563eb', // blue-600
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f43f5e', // rose-500
  '#6366f1', // indigo-500
];

/**
 * ChartsSection Component
 * Visualizes workforce headcount trends and department distribution using Recharts.
 */
export function ChartsSection({ monthlyData, departmentData, className }: ChartsSectionProps) {
  const [timeframe, setTimeframe] = useState<'6m' | '12m'>('6m');
  const [deptView, setDeptView] = useState<'bar' | 'pie'>('bar');

  // Filter monthly data based on selected timeframe
  const filteredMonthlyData = useMemo(() => {
    if (!monthlyData) return [];
    return timeframe === '6m' ? monthlyData.slice(-6) : monthlyData;
  }, [monthlyData, timeframe]);

  // Calculate net headcount growth in the selected period
  const netGrowth = useMemo(() => {
    if (filteredMonthlyData.length < 2) return 0;
    const first = filteredMonthlyData[0]?.headcount ?? 0;
    const last = filteredMonthlyData[filteredMonthlyData.length - 1]?.headcount ?? 0;
    return last - first;
  }, [filteredMonthlyData]);

  // Find the largest department
  const topDepartment = useMemo(() => {
    if (!departmentData || departmentData.length === 0) {
      return { department: 'N/A', employees: 0 };
    }
    return departmentData.reduce(
      (max, dept) => (dept.employees > max.employees ? dept : max),
      { department: '', employees: 0 }
    );
  }, [departmentData]);

  // Calculate total headcount from department distribution
  const totalHeadcount = useMemo(() => {
    if (!departmentData) return 0;
    return departmentData.reduce((sum, dept) => sum + dept.employees, 0);
  }, [departmentData]);

  if (!monthlyData || monthlyData.length === 0 || !departmentData || departmentData.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center">
        <div className="max-w-sm">
          <BarChart3 className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-4 text-sm font-semibold text-slate-900">No data available</h3>
          <p className="mt-2 text-xs text-slate-500">
            There is no historical headcount or department data to display at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6 lg:grid-cols-2', className)}>
      {/* Chart 1: Headcount Trend & Turnover */}
      <Card className="flex flex-col justify-between border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Headcount Trend &amp; Turnover
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Workforce growth, recruitment, and departures
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 px-2.5 text-xs font-medium transition-all',
                timeframe === '6m'
                  ? 'bg-white text-slate-900 shadow-sm hover:bg-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
              onClick={() => setTimeframe('6m')}
            >
              6 Months
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 px-2.5 text-xs font-medium transition-all',
                timeframe === '12m'
                  ? 'bg-white text-slate-900 shadow-sm hover:bg-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
              onClick={() => setTimeframe('12m')}
            >
              12 Months
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-3">
            <div className="rounded-md bg-blue-50 p-2 text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Net Growth (Selected Period)</p>
              <p className="text-sm font-semibold text-slate-900">
                {netGrowth >= 0 ? `+${netGrowth}` : netGrowth} Employees
              </p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={filteredMonthlyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorHeadcount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dx={-8}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  content={({ payload }) => {
                    if (!payload) return null;
                    return (
                      <div className="flex justify-end gap-4 text-xs">
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-1.5">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-slate-500">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Area
                  name="Headcount"
                  type="monotone"
                  dataKey="headcount"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHeadcount)"
                />
                <Bar
                  name="New Hires"
                  dataKey="newHires"
                  barSize={20}
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  name="Departures"
                  dataKey="departures"
                  barSize={20}
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: Department Distribution */}
      <Card className="flex flex-col justify-between border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Department Distribution
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Headcount breakdown by department
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 px-2.5 text-xs font-medium transition-all',
                deptView === 'bar'
                  ? 'bg-white text-slate-900 shadow-sm hover:bg-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
              onClick={() => setDeptView('bar')}
            >
              <BarChart3 className="mr-1 h-3.5 w-3.5" />
              Bar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 px-2.5 text-xs font-medium transition-all',
                deptView === 'pie'
                  ? 'bg-white text-slate-900 shadow-sm hover:bg-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
              onClick={() => setDeptView('pie')}
            >
              <PieIcon className="mr-1 h-3.5 w-3.5" />
              Pie
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-violet-50 p-2 text-violet-600">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Headcount</p>
                <p className="text-sm font-semibold text-slate-900">
                  {totalHeadcount} Employees
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-amber-50 p-2 text-amber-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Largest Dept</p>
                <p className="text-sm font-semibold text-slate-900">
                  {topDepartment.department} ({topDepartment.employees})
                </p>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {deptView === 'bar' ? (
                <BarChart
                  data={departmentData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="department"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-8}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="employees"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="employees"
                    nameKey="department"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value, entry: any) => {
                      const payload = entry.payload;
                      const percentage = totalHeadcount
                        ? ((payload.employees / totalHeadcount) * 100).toFixed(0)
                        : 0;
                      return (
                        <span className="text-xs text-slate-600">
                          {value} ({percentage}%)
                        </span>
                      );
                    }}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}