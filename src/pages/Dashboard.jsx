import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import './Dashboard.css';

const headcountData = [
  { month: 'Jan', employees: 210 },
  { month: 'Feb', employees: 218 },
  { month: 'Mar', employees: 225 },
  { month: 'Apr', employees: 230 },
  { month: 'May', employees: 228 },
  { month: 'Jun', employees: 235 },
  { month: 'Jul', employees: 242 },
  { month: 'Aug', employees: 248 },
  { month: 'Sep', employees: 251 },
  { month: 'Oct', employees: 258 },
  { month: 'Nov', employees: 263 },
  { month: 'Dec', employees: 270 },
];

const departmentData = [
  { name: 'Engineering', value: 98 },
  { name: 'Sales', value: 54 },
  { name: 'HR', value: 22 },
  { name: 'Finance', value: 31 },
  { name: 'Marketing', value: 35 },
  { name: 'Operations', value: 30 },
];

const PIE_COLORS = ['#4f6ef7', '#34c38f', '#f4a261', '#e76f51', '#a78bfa', '#38bdf8'];

const kpiCards = [
  { label: 'Total Employees', value: '270', delta: '+12 this month', positive: true, icon: '👥' },
  { label: 'Open Positions', value: '18', delta: '+3 since last week', positive: false, icon: '📋' },
  { label: 'Attrition Rate', value: '4.2%', delta: '-0.5% vs last quarter', positive: true, icon: '📉' },
  { label: 'Avg. Tenure', value: '3.4 yrs', delta: '+0.2 yrs YoY', positive: true, icon: '🏅' },
];

const goals = [
  { label: 'Hiring Target (Q4)', current: 14, total: 20 },
  { label: 'Training Completion', current: 187, total: 270 },
  { label: 'Performance Reviews', current: 230, total: 270 },
  { label: 'Onboarding Tasks', current: 9, total: 12 },
];

const activityFeed = [
  { id: 1, type: 'hire', message: 'Alice Johnson joined as Senior Engineer', time: '2 hours ago', avatar: 'AJ' },
  { id: 2, type: 'leave', message: 'Bob Martinez submitted a leave request (3 days)', time: '4 hours ago', avatar: 'BM' },
  { id: 3, type: 'review', message: 'Q3 performance reviews completed for Finance team', time: '6 hours ago', avatar: 'HR' },
  { id: 4, type: 'hire', message: 'Carol Smith joined as Product Designer', time: '1 day ago', avatar: 'CS' },
  { id: 5, type: 'payroll', message: 'October payroll processed — $1.24M disbursed', time: '1 day ago', avatar: 'PR' },
  { id: 6, type: 'leave', message: "David Lee's leave request approved", time: '2 days ago', avatar: 'DL' },
  { id: 7, type: 'review', message: 'New policy document uploaded: Remote Work Guidelines', time: '3 days ago', avatar: 'HR' },
];

const activityTypeColor = {
  hire: '#34c38f',
  leave: '#f4a261',
  review: '#4f6ef7',
  payroll: '#a78bfa',
};

function KpiCards() {
  return (
    <section className="kpi-grid" aria-label="Key Performance Indicators">
      {kpiCards.map((card) => (
        <div className="kpi-card" key={card.label}>
          <div className="kpi-icon" aria-hidden="true">{card.icon}</div>
          <div className="kpi-body">
            <span className="kpi-label">{card.label}</span>
            <span className="kpi-value">{card.value}</span>
            <span className={`kpi-delta ${card.positive ? 'positive' : 'negative'}`}>
              {card.positive ? '▲' : '▼'} {card.delta}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}

function HeadcountChart() {
  return (
    <div className="chart-card" aria-label="Headcount trend chart">
      <h2 className="chart-title">Headcount Trend (2024)</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={headcountData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8eaf0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis domain={[200, 280]} tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e8eaf0', fontSize: '13px' }}
          />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          <Line
            type="monotone"
            dataKey="employees"
            stroke="#4f6ef7"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#4f6ef7' }}
            activeDot={{ r: 6 }}
            name="Employees"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function DepartmentPieChart() {
  return (
    <div className="chart-card" aria-label="Department distribution pie chart">
      <h2 className="chart-title">Department Distribution</h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={departmentData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {departmentData.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e8eaf0', fontSize: '13px' }}
            formatter={(value) => [`${value} employees`, 'Headcount']}
          />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function GoalProgressBars() {
  return (
    <div className="goals-card" aria-label="HR Goals Progress">
      <h2 className="chart-title">HR Goals &amp; Progress</h2>
      <ul className="goals-list">
        {goals.map((goal) => {
          const pct = Math.round((goal.current / goal.total) * 100);
          return (
            <li key={goal.label} className="goal-item">
              <div className="goal-header">
                <span className="goal-label">{goal.label}</span>
                <span className="goal-stat">
                  {goal.current} / {goal.total}
                  <span className="goal-pct"> ({pct}%)</span>
                </span>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={goal.label}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: pct >= 80 ? '#34c38f' : pct >= 50 ? '#4f6ef7' : '#f4a261',
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ActivityFeed() {
  const [visibleCount, setVisibleCount] = useState(4);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, activityFeed.length));
  };

  const handleShowLess = () => {
    setVisibleCount(4);
  };

  const visible = activityFeed.slice(0, visibleCount);

  return (
    <div className="activity-card" aria-label="HR Activity Feed">
      <h2 className="chart-title">Recent HR Activity</h2>
      <ul className="activity-list">
        {visible.map((item) => (
          <li key={item.id} className="activity-item">
            <div
              className="activity-avatar"
              style={{ backgroundColor: activityTypeColor[item.type] ?? '#6b7280' }}
              aria-hidden="true"
            >
              {item.avatar}
            </div>
            <div className="activity-body">
              <p className="activity-message">{item.message}</p>
              <span className="activity-time">{item.time}</span>
            </div>
            <span
              className="activity-badge"
              style={{ backgroundColor: `${activityTypeColor[item.type] ?? '#6b7280'}22`, color: activityTypeColor[item.type] ?? '#6b7280' }}
            >
              {item.type}
            </span>
          </li>
        ))}
      </ul>
      <div className="activity-controls">
        {visibleCount < activityFeed.length && (
          <button className="btn-link" onClick={handleShowMore}>
            Show more
          </button>
        )}
        {visibleCount > 4 && (
          <button className="btn-link" onClick={handleShowLess}>
            Show less
          </button>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <main className="dashboard-page" aria-label="HRMS Dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back — here's your workforce overview for October 2024.</p>
        </div>
        <div className="dashboard-date">
          <span className="date-badge">📅 October 2024</span>
        </div>
      </div>

      <KpiCards />

      <section className="charts-row" aria-label="Charts">
        <HeadcountChart />
        <DepartmentPieChart />
      </section>

      <section className="bottom-row" aria-label="Goals and Activity">
        <GoalProgressBars />
        <ActivityFeed />
      </section>
    </main>
  );
}