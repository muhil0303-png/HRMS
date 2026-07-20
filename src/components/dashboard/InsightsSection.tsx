import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  ShieldAlert,
  Search,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  Check
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { HrInsight, InsightPriority, InsightCategory } from '../../types/hrms';

type LocalCategory = InsightCategory | 'recruitment' | 'training' | 'retention' | 'compliance' | 'performance';
type LocalPriority = InsightPriority | 'high' | 'medium' | 'low';

interface ExtendedInsight extends Omit<HrInsight, 'category' | 'priority' | 'actionableStep' | 'createdAt' | 'isResolved'> {
  category: LocalCategory;
  priority: LocalPriority;
  actionLabel?: string;
  progress?: number;
  status?: 'in_progress' | 'completed';
  actionableStep?: string;
  createdAt?: string;
  isResolved?: boolean;
}

interface InsightsSectionProps {
  insights?: HrInsight[];
  onActionExecute?: (insightId: string) => void;
}

const DEFAULT_INSIGHTS: ExtendedInsight[] = [
  {
    id: 'insight-1',
    title: 'High Turnover Risk in Engineering',
    description: 'Predictive analysis indicates a 15% increase in turnover risk for mid-level engineers due to market compensation shifts.',
    category: 'retention',
    priority: 'high',
    impact: 'Reduce engineering attrition by up to 8% through targeted retention bonuses.',
    actionLabel: 'Review Compensation',
    progress: 35,
    status: 'in_progress'
  },
  {
    id: 'insight-2',
    title: 'Compliance Training Deadline Approaching',
    description: 'Annual cybersecurity and harassment prevention training completion is currently at 68% with 12 days remaining.',
    category: 'compliance',
    priority: 'high',
    impact: 'Avoid regulatory compliance penalties and ensure 100% workforce certification.',
    actionLabel: 'Send Reminders',
    progress: 68,
    status: 'in_progress'
  },
  {
    id: 'insight-3',
    title: 'Recruitment Pipeline Bottleneck',
    description: 'Average time-to-hire for Product Management roles has increased to 45 days, primarily in the technical assessment stage.',
    category: 'recruitment',
    priority: 'medium',
    impact: 'Shorten hiring cycle by 10 days and improve candidate experience.',
    actionLabel: 'Optimize Pipeline',
    progress: 50,
    status: 'in_progress'
  },
  {
    id: 'insight-4',
    title: 'Leadership Development Gap',
    description: 'Only 40% of newly promoted managers have completed the foundational leadership training module.',
    category: 'training',
    priority: 'medium',
    impact: 'Improve team satisfaction scores and manager effectiveness ratings.',
    actionLabel: 'Enroll Managers',
    progress: 40,
    status: 'in_progress'
  },
  {
    id: 'insight-5',
    title: 'Remote Work Sentiment Shift',
    description: 'Quarterly pulse survey shows a demand for clearer guidelines on hybrid work flexibility and home office stipends.',
    category: 'performance',
    priority: 'low',
    impact: 'Boost employee engagement scores by 5 points.',
    actionLabel: 'Update Policy',
    progress: 100,
    status: 'completed'
  }
];

/**
 * HRMS Dashboard InsightsSection Component
 * Displays AI-driven HR insights, compliance alerts, and actionable items
 * with progress tracking, priority badges, and interactive filtering.
 */
export default function InsightsSection({ insights: initialInsights, onActionExecute }: InsightsSectionProps) {
  const [insights, setInsights] = useState<ExtendedInsight[]>(() => {
    if (initialInsights) {
      return initialInsights.map(item => {
        const extended: ExtendedInsight = {
          ...item,
          category: item.category,
          priority: item.priority,
        };
        return extended;
      });
    }
    return DEFAULT_INSIGHTS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Reset insights to default state for demonstration purposes
  const handleReset = () => {
    if (initialInsights) {
      setInsights(initialInsights.map(item => ({
        ...item,
        category: item.category,
        priority: item.priority,
      })));
    } else {
      setInsights(DEFAULT_INSIGHTS);
    }
  };

  // Handle simulated action execution
  const handleAction = (id: string) => {
    setInsights(prev =>
      prev.map(item => {
        if (item.id === id) {
          const currentProgress = item.progress ?? 0;
          const nextProgress = currentProgress >= 100 ? 100 : Math.min(currentProgress + 20, 100);
          return {
            ...item,
            progress: nextProgress,
            status: nextProgress === 100 ? 'completed' : 'in_progress'
          };
        }
        return item;
      })
    );
    if (onActionExecute) {
      onActionExecute(id);
    }
  };

  // Filtered insights based on search, priority, and category
  const filteredInsights = useMemo(() => {
    return insights.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.impact.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesPriority && matchesCategory;
    });
  }, [insights, searchQuery, selectedPriority, selectedCategory]);

  // Helper to render category icons
  const getCategoryIcon = (category: LocalCategory) => {
    switch (category) {
      case 'recruitment':
        return <TrendingUp className="h-5 w-5 text-blue-600" aria-hidden="true" />;
      case 'retention':
        return <AlertTriangle className="h-5 w-5 text-rose-600" aria-hidden="true" />;
      case 'training':
        return <BookOpen className="h-5 w-5 text-purple-600" aria-hidden="true" />;
      case 'compliance':
        return <ShieldAlert className="h-5 w-5 text-amber-600" aria-hidden="true" />;
      case 'performance':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />;
      default:
        return <Sparkles className="h-5 w-5 text-indigo-600" aria-hidden="true" />;
    }
  };

  // Helper to render category background styles
  const getCategoryBg = (category: LocalCategory) => {
    switch (category) {
      case 'recruitment':
        return 'bg-blue-50 border-blue-100';
      case 'retention':
        return 'bg-rose-50 border-rose-100';
      case 'training':
        return 'bg-purple-50 border-purple-100';
      case 'compliance':
        return 'bg-amber-50 border-amber-100';
      case 'performance':
        return 'bg-emerald-50 border-emerald-100';
      default:
        return 'bg-indigo-50 border-indigo-100';
    }
  };

  // Helper to render priority badge styles
  const getPriorityBadgeStyles = (priority: LocalPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              HR Insights
            </CardTitle>
            <CardDescription>
              AI-driven recommendations, compliance alerts, and actionable items.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-9 text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Demo
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All Categories</option>
              <option value="retention">Retention</option>
              <option value="compliance">Compliance</option>
              <option value="recruitment">Recruitment</option>
              <option value="training">Training</option>
              <option value="performance">Performance</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredInsights.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg">
            <p className="text-slate-500 text-sm">No insights found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <div
                key={insight.id}
                className={cn(
                  "p-5 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-start gap-4",
                  getCategoryBg(insight.category)
                )}
              >
                <div className="p-2.5 rounded-lg bg-white shadow-sm self-start">
                  {getCategoryIcon(insight.category)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-900 text-base">{insight.title}</h4>
                    <Badge variant="outline" className={cn("capitalize", getPriorityBadgeStyles(insight.priority))}>
                      {insight.priority}
                    </Badge>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {insight.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">{insight.description}</p>

                  {insight.impact && (
                    <div className="text-xs text-slate-500 flex items-start gap-1.5 bg-white/50 p-2 rounded-md border border-slate-100">
                      <span className="font-semibold text-slate-700 shrink-0">Impact:</span>
                      <span>{insight.impact}</span>
                    </div>
                  )}

                  {insight.progress !== undefined && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Progress</span>
                        <span>{insight.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-500",
                            insight.status === 'completed' ? 'bg-emerald-500' : 'bg-primary'
                          )}
                          style={{ width: `${insight.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center md:self-center shrink-0">
                  {insight.status === 'completed' ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                      <Check className="h-4 w-4" />
                      Completed
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleAction(insight.id)}
                      className="w-full md:w-auto"
                    >
                      {insight.actionLabel || 'Take Action'}
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}