import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Dashboard.css';

interface StatCard {
  id: string;
  title: string;
  value: string;
  icon: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
}

interface ActivityItem {
  id: string;
  action: string;
  subject: string;
  timestamp: string;
  type: 'hire' | 'leave' | 'promotion' | 'department' | 'general';
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
}

const statCards: StatCard[] = [
  {
    id: 'total-employees',
    title: 'Total Employees',
    value: '1,247',
    icon: '👥',
    trend: '+12 this month',
    trendDirection: 'up',
  },
  {
    id: 'departments',
    title: 'Departments',
    value: '18',
    icon: '🏢',
    trend: '+2 this quarter',
    trendDirection: 'up',
  },
  {
    id: 'open-positions',
    title: 'Open Positions',
    value: '34',
    icon: '📋',
    trend: '-5 from last week',
    trendDirection: 'down',
  },
  {
    id: 'attendance-rate',
    title: 'Attendance Rate',
    value: '96.4%',
    icon: '✅',
    trend: 'Stable',
    trendDirection: 'neutral',
  },
];

const recentActivities: ActivityItem[] = [
  {
    id: 'act-1',
    action: 'New hire onboarded',
    subject: 'Sarah Johnson — Engineering',
    timestamp: '2 hours ago',
    type: 'hire',
  },
  {
    id: 'act-2',
    action: 'Leave request approved',
    subject: 'Michael Chen — Marketing',
    timestamp: '4 hours ago',
    type: 'leave',
  },
  {
    id: 'act-3',
    action: 'Promotion processed',
    subject: 'Emily Davis — Senior Developer',
    timestamp: '1 day ago',
    type: 'promotion',
  },
  {
    id: 'act-4',
    action: 'Department restructured',
    subject: 'Product & Design merged',
    timestamp: '2 days ago',
    type: 'department',
  },
  {
    id: 'act-5',
    action: 'New hire onboarded',
    subject: 'James Wilson — Finance',
    timestamp: '3 days ago',
    type: 'hire',
  },
  {
    id: 'act-6',
    action: 'Leave request approved',
    subject: 'Anna Martinez — HR',
    timestamp: '3 days ago',
    type: 'leave',
  },
];

const quickActions: QuickAction[] = [
  {
    id: 'qa-1',
    label: 'Add Employee',
    icon: '➕',
    description: 'Register a new employee in the system',
  },
  {
    id: 'qa-2',
    label: 'Post Job Opening',
    icon: '📝',
    description: 'Create a new job listing',
  },
  {
    id: 'qa-3',
    label: 'Run Payroll',
    icon: '💰',
    description: 'Process monthly payroll',
  },
  {
    id: 'qa-4',
    label: 'Generate Report',
    icon: '📊',
    description: 'Create HR analytics report',
  },
  {
    id: 'qa-5',
    label: 'Manage Leave',
    icon: '📅',
    description: 'Review and approve leave requests',
  },
  {
    id: 'qa-6',
    label: 'Send Announcement',
    icon: '📢',
    description: 'Broadcast a company-wide message',
  },
];

function getActivityIcon(type: ActivityItem['type']): string {
  switch (type) {
    case 'hire':
      return '🟢';
    case 'leave':
      return '🟡';
    case 'promotion':
      return '🔵';
    case 'department':
      return '🟠';
    case 'general':
      return '⚪';
  }
}

function getTrendClassName(direction: StatCard['trendDirection']): string {
  switch (direction) {
    case 'up':
      return 'dashboard-stat-trend dashboard-stat-trend--up';
    case 'down':
      return 'dashboard-stat-trend dashboard-stat-trend--down';
    case 'neutral':
      return 'dashboard-stat-trend dashboard-stat-trend--neutral';
  }
}

function Dashboard(): React.JSX.Element {
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  function handleQuickAction(action: QuickAction): void {
    setActionFeedback(`"${action.label}" action triggered. This feature is coming soon.`);
    setTimeout(() => {
      setActionFeedback(null);
    }, 3000);
  }

  return (
    <div className="dashboard-page">
      <Header />
      <main className="dashboard-main" role="main" aria-label="Dashboard content">
        <div className="dashboard-container">
          <section className="dashboard-welcome" aria-label="Welcome section">
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">
              Welcome back! Here&apos;s what&apos;s happening in your organization today.
            </p>
          </section>

          {actionFeedback && (
            <div className="dashboard-feedback" role="alert" aria-live="polite">
              {actionFeedback}
            </div>
          )}

          <section className="dashboard-stats" aria-label="Key statistics">
            {statCards.map((card) => (
              <article key={card.id} className="dashboard-stat-card" aria-label={card.title}>
                <div className="dashboard-stat-icon" aria-hidden="true">
                  {card.icon}
                </div>
                <div className="dashboard-stat-content">
                  <h2 className="dashboard-stat-title">{card.title}</h2>
                  <p className="dashboard-stat-value">{card.value}</p>
                  <span className={getTrendClassName(card.trendDirection)}>
                    {card.trend}
                  </span>
                </div>
              </article>
            ))}
          </section>

          <div className="dashboard-grid">
            <section className="dashboard-activity" aria-label="Recent activity">
              <h2 className="dashboard-section-title">Recent Activity</h2>
              <ul className="dashboard-activity-list">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="dashboard-activity-item">
                    <span className="dashboard-activity-icon" aria-hidden="true">
                      {getActivityIcon(activity.type)}
                    </span>
                    <div className="dashboard-activity-content">
                      <p className="dashboard-activity-action">{activity.action}</p>
                      <p className="dashboard-activity-subject">{activity.subject}</p>
                    </div>
                    <time className="dashboard-activity-time">{activity.timestamp}</time>
                  </li>
                ))}
              </ul>
            </section>

            <section className="dashboard-quick-actions" aria-label="Quick actions">
              <h2 className="dashboard-section-title">Quick Actions</h2>
              <div className="dashboard-actions-grid">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className="dashboard-action-button"
                    onClick={() => { handleQuickAction(action); }}
                    aria-label={action.description}
                    type="button"
                  >
                    <span className="dashboard-action-icon" aria-hidden="true">
                      {action.icon}
                    </span>
                    <span className="dashboard-action-label">{action.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;