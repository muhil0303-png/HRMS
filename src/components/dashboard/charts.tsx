'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { DepartmentMetric } from '@/types/hrms';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface HiringTrendPoint {
  month: string;
  hires: number;
  applications: number;
}

interface DashboardChartsProps {
  departments: DepartmentMetric[];
  hiringTrends?: HiringTrendPoint[];
}

const defaultTrends: HiringTrendPoint[] = [
  { month: 'Jan', hires: 12, applications: 85 },
  { month: 'Feb', hires: 19, applications: 110 },
  { month: 'Mar', hires: 15, applications: 95 },
  { month: 'Apr', hires: 26, applications: 140 },
  { month: 'May', hires: 32, applications: 185 },
  { month: 'Jun', hires: 28, applications: 160 },
  { month: 'Jul', hires: 38, applications: 210 },
];

const colorMap: Record<string, { stroke: string; bg: string; text: string; border: string }> = {
  engineering: { stroke: '#3b82f6', bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
  hr: { stroke: '#ec4899', bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200' },
  sales: { stroke: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200' },
  marketing: { stroke: '#f59e0b', bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200' },
  finance: { stroke: '#8b5cf6', bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-200' },
  product: { stroke: '#06b6d4', bg: 'bg-cyan-500', text: 'text-cyan-600', border: 'border-cyan-200' },
};

function getDeptColor(name: string, index: number) {
  const key = name.toLowerCase();
  const keys = Object.keys(colorMap);
  if (colorMap[key]) return colorMap[key];
  const fallbackKey = keys[index % keys.length];
  return colorMap[fallbackKey];
}

/**
 * DashboardCharts Component
 * Renders pure SVG charts for Department Distribution and Monthly Hiring Trends.
 */
export function DashboardCharts({ departments, hiringTrends = defaultTrends }: DashboardChartsProps): React.JSX.Element {
  const [activeMetric, setActiveMetric] = useState<'all' | 'hires' | 'applications'>('all');
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  const [hoveredDeptIndex, setHoveredDeptIndex] = useState<number | null>(null);

  // 1. Department Distribution Calculations (Donut Chart)
  const totalHeadcount = departments.reduce((sum, d) => sum + d.headcount, 0);
  
  let accumulatedPercent = 0;
  const donutSegments = departments.map((dept, index) => {
    const percent = totalHeadcount > 0 ? dept.headcount / totalHeadcount : 0;
    const strokeLength = percent * 314.159; // Circumference for r=50 is 2 * pi * 50 = 314.159
    const strokeOffset = 314.159 - strokeLength;
    const rotation = accumulatedPercent * 360;
    accumulatedPercent += percent;
    const colors = getDeptColor(dept.name, index);
    return {
      ...dept,
      percent,
      strokeLength,
      strokeOffset,
      rotation,
      colors,
    };
  });

  // 2. Hiring Trends Calculations (Area/Line Chart)
  const chartWidth = 500;
  const chartHeight = 180;
  const padding = { top: 15, right: 20, bottom: 30, left: 40 };
  
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const maxHires = Math.max(...hiringTrends.map((t) => t.hires), 10);
  const maxApps = Math.max(...hiringTrends.map((t) => t.applications), 50);

  const trendPoints = hiringTrends.map((t, i) => {
    const x = padding.left + (i / (hiringTrends.length - 1)) * graphWidth;
    // Normalize Y coordinates
    const yHires = padding.top + graphHeight - (t.hires / maxHires) * graphHeight;
    const yApps = padding.top + graphHeight - (t.applications / maxApps) * graphHeight;
    return { x, yHires, yApps, ...t };
  });

  // Generate SVG Path strings
  const generatePath = (points: { x: number; y: number }[], closeToBottom = false) => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Smooth curve calculation (cubic bezier)
      const cpX1 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY1 = points[i - 1].y;
      const cpX2 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY2 = points[i].y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }
    if (closeToBottom) {
      path += ` L ${points[points.length - 1].x} ${padding.top + graphHeight}`;
      path += ` L ${points[0].x} ${padding.top + graphHeight} Z`;
    }
    return path;
  };

  const hiresLinePath = generatePath(trendPoints.map(p => ({ x: p.x, y: p.yHires })));
  const hiresAreaPath = generatePath(trendPoints.map(p => ({ x: p.x, y: p.yHires })), true);

  const appsLinePath = generatePath(trendPoints.map(p => ({ x: p.x, y: p.yApps })));
  const appsAreaPath = generatePath(trendPoints.map(p => ({ x: p.x, y: p.yApps })), true);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Hiring Trends Chart Card */}
      <Card className="lg:col-span-7 flex flex-col justify-between shadow-sm border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Hiring Pipeline Trends</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Monthly breakdown of applications vs successful hires
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg self-start sm:self-auto">
              <Button
                variant={activeMetric === 'all' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setActiveMetric('all')}
              >
                All
              </Button>
              <Button
                variant={activeMetric === 'hires' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setActiveMetric('hires')}
              >
                Hires
              </Button>
              <Button
                variant={activeMetric === 'applications' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setActiveMetric('applications')}
              >
                Apps
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {/* SVG Chart Container */}
          <div className="relative w-full h-56">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
              aria-label="Hiring Trends Chart"
            >
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = padding.top + ratio * graphHeight;
                return (
                  <g key={idx}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      opacity="0.6"
                    />
                    {/* Left Axis Labels (Hires) */}
                    {(activeMetric === 'all' || activeMetric === 'hires') && (
                      <text
                        x={padding.left - 8}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[10px] fill-muted-foreground font-medium"
                      >
                        {Math.round(maxHires - ratio * maxHires)}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* X-Axis Labels */}
              {trendPoints.map((pt, idx) => (
                <text
                  key={idx}
                  x={pt.x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  className="text-[10px] fill-muted-foreground font-medium"
                >
                  {pt.month}
                </text>
              ))}

              {/* Applications Area & Line */}
              {(activeMetric === 'all' || activeMetric === 'applications') && (
                <>
                  <path
                    d={appsAreaPath}
                    fill="url(#appsGradient)"
                    className="transition-all duration-300"
                  />
                  <path
                    d={appsLinePath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </>
              )}

              {/* Hires Area & Line */}
              {(activeMetric === 'all' || activeMetric === 'hires') && (
                <>
                  <path
                    d={hiresAreaPath}
                    fill="url(#hiresGradient)"
                    className="transition-all duration-300"
                  />
                  <path
                    d={hiresLinePath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </>
              )}

              {/* Interactive Hover Bars */}
              {trendPoints.map((pt, idx) => (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredTrendIndex(idx)}
                  onMouseLeave={() => setHoveredTrendIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible wide hover target */}
                  <rect
                    x={pt.x - graphWidth / (trendPoints.length * 2)}
                    y={padding.top}
                    width={graphWidth / (trendPoints.length - 1)}
                    height={graphHeight}
                    fill="transparent"
                  />
                  {hoveredTrendIndex === idx && (
                    <>
                      {/* Vertical Indicator Line */}
                      <line
                        x1={pt.x}
                        y1={padding.top}
                        x2={pt.x}
                        y2={padding.top + graphHeight}
                        stroke="var(--foreground)"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        opacity="0.4"
                      />
                      {/* Data Dots */}
                      {(activeMetric === 'all' || activeMetric === 'applications') && (
                        <circle cx={pt.x} cy={pt.yApps} r="5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                      )}
                      {(activeMetric === 'all' || activeMetric === 'hires') && (
                        <circle cx={pt.x} cy={pt.yHires} r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                      )}
                    </>
                  )}
                </g>
              ))}

              {/* Gradients Definition */}
              <defs>
                <linearGradient id="hiresGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="appsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Tooltip */}
            {hoveredTrendIndex !== null && (
              <div
                className="absolute bg-background/95 border border-border shadow-md rounded-lg p-2.5 text-xs pointer-events-none transition-all duration-150"
                style={{
                  left: `${Math.min(
                    Math.max(
                      (trendPoints[hoveredTrendIndex].x / chartWidth) * 100 - 10,
                      5
                    ),
                    75
                  )}%`,
                  top: '10px',
                }}
              >
                <p className="font-semibold text-foreground mb-1">{trendPoints[hoveredTrendIndex].month} Metrics</p>
                <div className="space-y-1">
                  {(activeMetric === 'all' || activeMetric === 'applications') && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Apps:</span>
                      <span className="font-bold text-foreground">{trendPoints[hoveredTrendIndex].applications}</span>
                    </div>
                  )}
                  {(activeMetric === 'all' || activeMetric === 'hires') && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">Hires:</span>
                      <span className="font-bold text-foreground">{trendPoints[hoveredTrendIndex].hires}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-muted-foreground">Hires (Target: 90% conversion)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-muted-foreground">Applications</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Distribution Card */}
      <Card className="lg:col-span-5 flex flex-col justify-between shadow-sm border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Department Distribution</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Headcount allocation and budget utilization
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 space-y-6">
          {/* Donut Chart & Legend Grid */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                {donutSegments.map((seg, idx) => (
                  <circle
                    key={seg.id}
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke={seg.colors.stroke}
                    strokeWidth={hoveredDeptIndex === idx ? '14' : '10'}
                    strokeDasharray="314.159"
                    strokeDashoffset={seg.strokeOffset}
                    transform={`rotate(${seg.rotation} 60 60)`}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredDeptIndex(idx)}
                    onMouseLeave={() => setHoveredDeptIndex(null)}
                  />
                ))}
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-foreground">
                  {hoveredDeptIndex !== null
                    ? donutSegments[hoveredDeptIndex].headcount
                    : totalHeadcount}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  {hoveredDeptIndex !== null
                    ? donutSegments[hoveredDeptIndex].name
                    : 'Total Staff'}
                </span>
              </div>
            </div>

            {/* Mini Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full sm:w-auto">
              {donutSegments.map((seg, idx) => (
                <div
                  key={seg.id}
                  className={cn(
                    "flex items-center gap-2 p-1.5 rounded-md transition-colors cursor-pointer",
                    hoveredDeptIndex === idx ? "bg-muted" : "hover:bg-muted/50"
                  )}
                  onMouseEnter={() => setHoveredDeptIndex(idx)}
                  onMouseLeave={() => setHoveredDeptIndex(null)}
                >
                  <span className={cn("w-2.5 h-2.5 rounded-full", seg.colors.bg)} />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground truncate max-w-[80px]">
                      {seg.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round(seg.percent * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Progress Bars */}
          <div className="space-y-3 pt-2 border-t border-border">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Budget Utilization & Open Roles
            </h4>
            <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
              {departments.map((dept, idx) => {
                const colors = getDeptColor(dept.name, idx);
                const budgetRatio = dept.budget > 0 ? dept.budgetSpent / dept.budget : 0;
                const budgetPercent = Math.min(Math.round(budgetRatio * 100), 100);

                return (
                  <div key={dept.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{dept.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          ${(dept.budgetSpent / 1000).toFixed(0)}k / ${(dept.budget / 1000).toFixed(0)}k
                        </span>
                        {dept.openPositions > 0 && (
                          <Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-bold">
                            {dept.openPositions} Open
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", colors.bg)}
                        style={{ width: `${budgetPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}