import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import LeaveRequests from './components/LeaveRequests';
import RecentActivity from './components/RecentActivity';
import EmployeeList from './components/EmployeeList';
import type { 
  Employee, 
  LeaveRequest, 
  Activity, 
  StatCardData, 
  EmploymentStatus, 
  LeaveType,
  Department
} from './types';
import { Plus, Calendar, Users, Check, X } from 'lucide-react';

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    status: 'Active',
    joinDate: '2022-03-15',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 'EMP-002',
    name: 'Michael Chen',
    email: 'michael.c@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'Lead Product Manager',
    department: 'Product',
    status: 'Remote',
    joinDate: '2021-10-10',
    phone: '+1 (555) 345-6789'
  },
  {
    id: 'EMP-003',
    name: 'Alisha Patel',
    email: 'alisha.p@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'Senior UI/UX Designer',
    department: 'Design',
    status: 'On Leave',
    joinDate: '2023-01-15',
    phone: '+1 (555) 456-7890'
  },
  {
    id: 'EMP-004',
    name: 'David Ross',
    email: 'david.r@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'Growth Marketing Manager',
    department: 'Marketing',
    status: 'Active',
    joinDate: '2022-08-01',
    phone: '+1 (555) 567-8901'
  },
  {
    id: 'EMP-005',
    name: 'Emily Wong',
    email: 'emily.w@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'HR Operations Specialist',
    department: 'HR',
    status: 'Active',
    joinDate: '2020-05-20',
    phone: '+1 (555) 678-9012'
  },
  {
    id: 'EMP-006',
    name: 'James Carter',
    email: 'james.c@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'Enterprise Account Executive',
    department: 'Sales',
    status: 'Active',
    joinDate: '2023-05-10',
    phone: '+1 (555) 789-0123'
  },
  {
    id: 'EMP-007',
    name: 'Sophia Martinez',
    email: 'sophia.m@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    role: 'Financial Controller',
    department: 'Finance',
    status: 'Active',
    joinDate: '2021-11-01',
    phone: '+1 (555) 890-1234'
  },
  {
    id: 'EMP-008',
    name: 'Robert Taylor',
    email: 'robert.t@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'DevOps Engineer',
    department: 'Engineering',
    status: 'Remote',
    joinDate: '2022-11-15',
    phone: '+1 (555) 901-2345'
  }
];

const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-101',
    employeeId: 'EMP-003',
    employeeName: 'Alisha Patel',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    department: 'Design',
    type: 'Annual',
    startDate: '2025-03-10',
    endDate: '2025-03-15',
    days: 5,
    reason: 'Family vacation and rest',
    status: 'Pending',
    appliedDate: '2025-02-20'
  },
  {
    id: 'LR-102',
    employeeId: 'EMP-008',
    employeeName: 'Robert Taylor',
    employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    department: 'Engineering',
    type: 'Sick',
    startDate: '2025-02-26',
    endDate: '2025-02-27',
    days: 2,
    reason: 'Medical checkup and recovery',
    status: 'Pending',
    appliedDate: '2025-02-24'
  },
  {
    id: 'LR-103',
    employeeId: 'EMP-002',
    employeeName: 'Michael Chen',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    department: 'Product',
    type: 'Annual',
    startDate: '2025-04-05',
    endDate: '2025-04-08',
    days: 3,
    reason: 'Personal matters',
    status: 'Approved',
    appliedDate: '2025-02-15'
  },
  {
    id: 'LR-104',
    employeeId: 'EMP-007',
    employeeName: 'Sophia Martinez',
    employeeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    department: 'Finance',
    type: 'Unpaid',
    startDate: '2025-02-10',
    endDate: '2025-02-11',
    days: 1,
    reason: 'Urgent home renovation supervision',
    status: 'Rejected',
    appliedDate: '2025-02-05'
  }
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'ACT-001',
    type: 'onboarding',
    message: 'Sarah Jenkins joined the Engineering team as Senior Frontend Engineer.',
    timestamp: '2 hours ago',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'ACT-002',
    type: 'leave_applied',
    message: 'Alisha Patel submitted a leave request for Annual Leave (5 days).',
    timestamp: '4 hours ago',
    userName: 'Alisha Patel',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    id: 'ACT-003',
    type: 'leave_approved',
    message: "Michael Chen's leave request was approved by HR Admin.",
    timestamp: '1 day ago',
    userName: 'Michael Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'ACT-004',
    type: 'leave_rejected',
    message: "Sophia Martinez's leave request was rejected due to quarter-end closing.",
    timestamp: '2 days ago',
    userName: 'Sophia Martinez',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);

  // Leave Request Form State
  const [leaveForm, setLeaveForm] = useState({
    employeeId: '',
    type: 'Annual' as LeaveType,
    startDate: '',
    endDate: '',
    days: 1,
    reason: ''
  });

  // Dynamic Stats Calculation
  const stats = useMemo<StatCardData[]>(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'Active' || e.status === 'Remote').length;
    const pending = leaveRequests.filter(r => r.status === 'Pending').length;
    const approvedLeaves = leaveRequests.filter(r => r.status === 'Approved').length;

    return [
      {
        id: 'stat-total',
        title: 'Total Employees',
        value: total,
        change: 12,
        changeType: 'increase',
        iconName: 'Users',
        color: 'blue'
      },
      {
        id: 'stat-active',
        title: 'Active Now',
        value: active,
        change: 8,
        changeType: 'increase',
        iconName: 'UserCheck',
        color: 'green'
      },
      {
        id: 'stat-pending',
        title: 'Pending Approvals',
        value: pending,
        change: -15,
        changeType: 'decrease',
        iconName: 'Clock',
        color: 'amber'
      },
      {
        id: 'stat-leaves',
        title: 'Upcoming Leaves',
        value: approvedLeaves,
        change: 4,
        changeType: 'increase',
        iconName: 'CalendarDays',
        color: 'purple'
      }
    ];
  }, [employees, leaveRequests]);

  // Handlers
  const handleApproveLeave = (id: string) => {
    const request = leaveRequests.find(r => r.id === id);
    if (!request) return;

    setLeaveRequests(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r)
    );

    setEmployees(prev => 
      prev.map(e => e.id === request.employeeId ? { ...e, status: 'On Leave' } : e)
    );

    const newActivity: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'leave_approved',
      message: `${request.employeeName}'s leave request for ${request.type} Leave was approved.`,
      timestamp: 'Just now',
      userName: request.employeeName,
      userAvatar: request.employeeAvatar
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleRejectLeave = (id: string) => {
    const request = leaveRequests.find(r => r.id === id);
    if (!request) return;

    setLeaveRequests(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r)
    );

    const newActivity: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'leave_rejected',
      message: `${request.employeeName}'s leave request for ${request.type} Leave was rejected.`,
      timestamp: 'Just now',
      userName: request.employeeName,
      userAvatar: request.employeeAvatar
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleAddEmployee = (newEmp: Omit<Employee, 'id' | 'joinDate'>) => {
    const employee: Employee = {
      ...newEmp,
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setEmployees(prev => [employee, ...prev]);

    const newActivity: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'onboarding',
      message: `${employee.name} joined the ${employee.department} team as ${employee.role}.`,
      timestamp: 'Just now',
      userName: employee.name,
      userAvatar: employee.avatar
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleDeleteEmployee = (id: string) => {
    const employee = employees.find(e => e.id === id);
    if (!employee) return;

    setEmployees(prev => prev.filter(e => e.id !== id));

    const newActivity: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'status_change',
      message: `${employee.name} has been offboarded from the company.`,
      timestamp: 'Just now',
      userName: employee.name,
      userAvatar: employee.avatar
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: EmploymentStatus) => {
    const employee = employees.find(e => e.id === id);
    if (!employee) return;

    setEmployees(prev => 
      prev.map(e => e.id === id ? { ...e, status } : e)
    );

    const newActivity: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'status_change',
      message: `${employee.name}'s status was updated to ${status}.`,
      timestamp: 'Just now',
      userName: employee.name,
      userAvatar: employee.avatar
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleCreateLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = employees.find(emp => emp.id === leaveForm.employeeId);
    if (!employee) return;

    const newRequest: LeaveRequest = {
      id: `LR-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeAvatar: employee.avatar,
      department: employee.department,
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      days: Number(leaveForm.days),
      reason: leaveForm.reason,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests(prev => [newRequest, ...prev]);

    const newActivity: Activity = {
      id: `ACT-${Date.now()}`,
      type: 'leave_applied',
      message: `${employee.name} submitted a leave request for ${leaveForm.type} Leave (${leaveForm.days} days).`,
      timestamp: 'Just now',
      userName: employee.name,
      userAvatar: employee.avatar
    };
    setActivities(prev => [newActivity, ...prev]);

    // Reset Form
    setLeaveForm({
      employeeId: '',
      type: 'Annual',
      startDate: '',
      endDate: '',
      days: 1,
      reason: ''
    });
    setIsLeaveModalOpen(false);
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Enterprise Control Center';
      case 'employees': return 'Employee Directory';
      case 'leaves': return 'Leave Management';
      case 'activity': return 'Audit Log & Activities';
      default: return 'HRMS Dashboard';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          title={getHeaderTitle()} 
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(stat => (
                  <StatCard key={stat.id} stat={stat} />
                ))}
              </div>

              {/* Quick Actions & Main Dashboard Content */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Leave Requests & Quick Actions */}
                <div className="space-y-6 lg:col-span-2">
                  {/* Quick Actions Panel */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
                    <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
                    <p className="mt-1 text-sm text-slate-500">Frequently used administrative tasks and shortcuts.</p>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => setActiveTab('employees')}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:bg-slate-100 hover:shadow-sm focus-ring"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Add Employee</p>
                            <p className="text-xs text-slate-500">Onboard a new team member</p>
                          </div>
                        </div>
                        <Plus className="h-5 w-5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setIsLeaveModalOpen(true)}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:bg-slate-100 hover:shadow-sm focus-ring"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Request Leave</p>
                            <p className="text-xs text-slate-500">Submit leave on behalf of staff</p>
                          </div>
                        </div>
                        <Plus className="h-5 w-5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Pending Leave Requests */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Pending Leave Requests</h2>
                        <p className="text-sm text-slate-500">Review and process pending employee time-off requests.</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('leaves')}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        View All
                      </button>
                    </div>
                    <LeaveRequests 
                      requests={leaveRequests.filter(r => r.status === 'Pending')} 
                      onApprove={handleApproveLeave} 
                      onReject={handleRejectLeave} 
                    />
                  </div>
                </div>

                {/* Right Column: Recent Activity Feed */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card h-fit">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                      <p className="text-sm text-slate-500">Real-time log of HR actions.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('activity')}
                      className="text-sm font-medium text-brand-600 hover:text-brand-700"
                    >
                      View Log
                    </button>
                  </div>
                  <RecentActivity activities={activities.slice(0, 6)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employees' && (
            <EmployeeList 
              employees={employees} 
              onAddEmployee={handleAddEmployee} 
              onDeleteEmployee={handleDeleteEmployee}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === 'leaves' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">All Leave Requests</h2>
                    <p className="text-sm text-slate-500">Comprehensive history and management of all time-off requests.</p>
                  </div>
                  <button
                    onClick={() => setIsLeaveModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus-ring"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Leave Request
                  </button>
                </div>
                <LeaveRequests 
                  requests={leaveRequests} 
                  onApprove={handleApproveLeave} 
                  onReject={handleRejectLeave} 
                />
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">System Audit Log</h2>
                  <p className="text-sm text-slate-500">Chronological record of all administrative and employee actions.</p>
                </div>
                <RecentActivity activities={activities} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Submit Leave Request Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">Submit Leave Request</h3>
              <button 
                onClick={() => setIsLeaveModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLeaveRequest} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Select Employee</label>
                <select
                  required
                  value={leaveForm.employeeId}
                  onChange={e => setLeaveForm(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Leave Type</label>
                  <select
                    value={leaveForm.type}
                    onChange={e => setLeaveForm(prev => ({ ...prev, type: e.target.value as LeaveType }))}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="Annual">Annual</option>
                    <option value="Sick">Sick</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Paternity">Paternity</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Total Days</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={90}
                    value={leaveForm.days}
                    onChange={e => setLeaveForm(prev => ({ ...prev, days: Number(e.target.value) }))}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={e => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={e => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Reason</label>
                <textarea
                  required
                  rows={3}
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Provide a brief reason for the leave request..."
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end space-x-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-ring"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus-ring"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}