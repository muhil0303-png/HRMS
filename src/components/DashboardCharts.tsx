import { useState, useMemo } from 'react';
import { 
  UserPlus, 
  Calendar, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import type { Employee, LeaveRequest, Department } from '../types';

const DEPARTMENTS: Department[] = ['Engineering', 'HR', 'Design', 'Marketing', 'Sales', 'Finance'];

const DEPT_ABBR: Record<Department, string> = {
  Engineering: 'Eng',
  HR: 'HR',
  Design: 'Des',
  Marketing: 'Mkt',
  Sales: 'Sales',
  Finance: 'Fin'
};

interface ActivityItem {
  id: string;
  type: 'join' | 'leave' | 'job' | 'system';
  title: string;
  description: string;
  timestamp: string;
  dateObject: Date;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

interface DashboardChartsProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
}

const parseDate = (dateStr: string): Date => {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Just now';
  }
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

export default function DashboardCharts({ employees, leaveRequests }: DashboardChartsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // 1. Calculate Department Distribution
  const deptData = useMemo(() => {
    const counts = DEPARTMENTS.reduce((acc, dept) => {
      acc[dept] = 0;
      return acc;
    }, {} as Record<Department, number>);

    employees.forEach((emp) => {
      if (counts[emp.department] !== undefined) {
        counts[emp.department]++;
      }
    });

    return DEPARTMENTS.map((dept) => ({
      department: dept,
      count: counts[dept] || 0,
    }));
  }, [employees]);

  // SVG Dimensions & Calculations
  const svgWidth = 500;
  const svgHeight = 260;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxCount = useMemo(() => {
    const max = Math.max(...deptData.map((d) => d.count), 0);
    return max === 0 ? 10 : Math.ceil(max / 5) * 5; // Round up to nearest 5, min 10
  }, [deptData]);

  const yTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(Math.round((maxCount / 4) * i));
    }
    return ticks;
  }, [maxCount]);

  const barWidth = 32;
  const gap = (chartWidth - (DEPARTMENTS.length * barWidth)) / (DEPARTMENTS.length - 1);

  // 2. Generate Recent Activity Timeline
  const activities = useMemo<ActivityItem[]>(() => {
    const list: ActivityItem[] = [];

    // Add employee join events
    employees.forEach((emp) => {
      list.push({
        id: `join-${emp.id}`,
        type: 'join',
        title: 'New Employee Joined',
        description: `${emp.name} joined as ${emp.role} in ${emp.department}`,
        timestamp: emp.joinDate,
        dateObject: parseDate(emp.joinDate),
      });
    });

    // Add leave request events
    leaveRequests.forEach((req) => {
      let statusText = 'requested';
      if (req.status === 'Approved') statusText = 'approved for';
      if (req.status === 'Rejected') statusText = 'rejected for';

      list.push({
        id: `leave-${req.id}`,
        type: 'leave',
        title: `Leave Request ${req.status}`,
        description: `${req.employeeName} ${statusText} ${req.days} days of ${req.type} leave`,
        timestamp: req.appliedDate || req.startDate,
        dateObject: parseDate(req.appliedDate || req.startDate),
        status: req.status,
      });
    });

    // Add static mock events to enrich timeline
    const staticEvents: ActivityItem[] = [
      {
        id: 'static-1',
        type: 'job',
        title: 'New Job Opening',
        description: 'Senior Product Designer position is now active',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString().split('T')[0] || '2025-01-10',
        dateObject: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2),
      },
      {
        id: 'static-2',
        type: 'system',
        title: 'System Policy Updated',
        description: 'Remote work guidelines updated for Q1',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 * 4).toISOString().split('T')[0] || '2025-01-08',
        dateObject: new Date(Date.now() - 24 * 60 * 60 * 1000 * 4),
      }
    ];

    list.push(...staticEvents);

    // Sort by date descending and take top 5
    return list.sort((a, b) => b.dateObject.getTime() - a.dateObject.getTime()).slice(0, 5);
  }, [employees, leaveRequests]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Department Distribution Chart */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Department Distribution</h3>
              <p className="text-xs text-slate-500">Headcount breakdown by department</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active Org</span>
            </div>
          </div>

          {/* SVG Chart Container */}
          <div className="relative w-full pt-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible"
            >
              {/* Grid Lines */}
              {yTicks.map((tick, i) => {
                const y = paddingTop + chartHeight - (tick / maxCount) * chartHeight;
                return (
                  <g key={tick} className="opacity-60">
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={svgWidth - paddingRight}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth={1}
                      strokeDasharray={i === 0 ? '0' : '4 4'}
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] font-medium fill-slate-400"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {deptData.map((data, index) => {
                const x = paddingLeft + index * (barWidth + gap);
                const barHeight = (data.count / maxCount) * chartHeight;
                const y = paddingTop + chartHeight - barHeight;

                return (
                  <g key={data.department}>
                    {/* Interactive hover area */}
                    <rect
                      x={x - gap / 2}
                      y={paddingTop}
                      width={barWidth + gap}
                      height={chartHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => {
                        setHoveredIndex(index);
                        setTooltipPos({ x: x + barWidth / 2, y: y - 8 });
                      }}
                      onMouseLeave={() => {
                        setHoveredIndex(null);
                        setTooltipPos(null);
                      }}
                    />
                    {/* Visual Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, 3)}
                      rx={4}
                      className={`transition-all duration-200 ${
                        hoveredIndex === index
                          ? 'fill-brand-600 filter drop-shadow-sm'
                          : 'fill-brand-500'
                      }`}
                    />
                    {/* X Axis Label */}
                    <text
                      x={x + barWidth / 2}
                      y={svgHeight - 15}
                      textAnchor="middle"
                      className="text-[10px] font-semibold fill-slate-500"
                    >
                      {DEPT_ABBR[data.department]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            {hoveredIndex !== null && tooltipPos && (
              <div
                className="absolute z-10 bg-slate-900 text-white text-xs rounded-lg py-1.5 px-2.5 shadow-md pointer-events-none transition-all duration-100 -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(tooltipPos.x / svgWidth) * 100}%`,
                  top: `${(tooltipPos.y / svgHeight) * 100}%`,
                }}
              >
                <div className="font-semibold text-slate-200">{deptData[hoveredIndex]?.department}</div>
                <div className="text-brand-300 font-medium mt-0.5">
                  {deptData[hoveredIndex]?.count} {deptData[hoveredIndex]?.count === 1 ? 'Employee' : 'Employees'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend / Summary */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
          <div className="border-r border-slate-100">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Total Staff</span>
            <p className="text-base font-bold text-slate-800">{employees.length}</p>
          </div>
          <div className="border-r border-slate-100">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Engineering</span>
            <p className="text-base font-bold text-brand-600">
              {deptData.find(d => d.department === 'Engineering')?.count || 0}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Other Depts</span>
            <p className="text-base font-bold text-slate-700">
              {employees.length - (deptData.find(d => d.department === 'Engineering')?.count || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
              <p className="text-xs text-slate-500">Real-time updates across the organization</p>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="relative pl-4 border-l-2 border-slate-100 space-y-5">
            {activities.map((activity) => {
              // Determine Icon and Colors
              let Icon = Clock;
              let iconBg = 'bg-slate-50 text-slate-600';

              if (activity.type === 'join') {
                Icon = UserPlus;
                iconBg = 'bg-emerald-50 text-emerald-600';
              } else if (activity.type === 'leave') {
                Icon = Calendar;
                if (activity.status === 'Approved') {
                  iconBg = 'bg-emerald-50 text-emerald-600';
                } else if (activity.status === 'Rejected') {
                  iconBg = 'bg-rose-50 text-rose-600';
                } else {
                  iconBg = 'bg-amber-50 text-amber-600';
                }
              } else if (activity.type === 'job') {
                Icon = Briefcase;
                iconBg = 'bg-indigo-50 text-indigo-600';
              }

              return (
                <div key={activity.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[25px] top-1.5 flex items-center justify-center">
                    <div className={`w-5 h-5 rounded-full ${iconBg} flex items-center justify-center border-2 border-white shadow-sm`}>
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pl-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                        {activity.title}
                      </h4>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                        {formatTimeAgo(activity.dateObject)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {activities.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No recent activities recorded</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
          <span className="text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer flex items-center gap-1">
            View Audit Logs &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}