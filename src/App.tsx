import React, { useState, useMemo } from 'react';
import {
  Users,
  Calendar,
  Briefcase,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  Clock,
  Plus,
  Check,
  AlertCircle,
  ChevronDown,
  LogOut,
  User,
  FileText
} from 'lucide-react';
import type { Employee, LeaveRequest, JobPosting, Notification } from './types';
import { initialEmployees, initialLeaveRequests, initialJobPostings, initialNotifications } from './mockData';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { LeaveManagement } from './components/LeaveManagement';
import { DashboardCharts } from './components/DashboardCharts';
import { AddEmployeeModal, RequestLeaveModal } from './components/Modals';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [jobPostings] = useState<JobPosting[]>(initialJobPostings);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'leave' | 'jobs' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isRequestLeaveOpen, setIsRequestLeaveOpen] = useState(false);

  const addNotification = (title: string, message: string, type: 'info' | 'warning' | 'success') => {
    const newNotif: Notification = {
      id: `NT-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleAddEmployee = (newEmp: Omit<Employee, 'id'>) => {
    const employee: Employee = {
      ...newEmp,
      id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setEmployees(prev => [employee, ...prev]);
    setIsAddEmployeeOpen(false);
    addNotification('New Employee Added', `${employee.name} has joined the ${employee.department} department.`, 'success');
  };

  const handleUpdateEmployee = (updated: Employee) => {
    setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
    addNotification('Employee Updated', `Profile details for ${updated.name} have been updated.`, 'info');
  };

  const handleDeleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    if (emp) {
      addNotification('Employee Removed', `${emp.name} has been removed from the directory.`, 'warning');
    }
  };

  const handleApproveLeave = (id: string) => {
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === id) {
        setEmployees(empPrev => empPrev.map(emp => emp.id === req.employeeId ? { ...emp, status: 'On Leave' } : emp));
        return { ...req, status: 'Approved' };
      }
      return req;
    }));
    addNotification('Leave Approved', 'The leave request has been approved successfully.', 'success');
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Rejected' } : req));
    addNotification('Leave Rejected', 'The leave request has been rejected.', 'warning');
  };

  const handleRequestLeave = (newLeave: Omit<LeaveRequest, 'id' | 'status'>) => {
    const request: LeaveRequest = {
      ...newLeave,
      id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending'
    };
    setLeaveRequests(prev => [request, ...prev]);
    setIsRequestLeaveOpen(false);
    addNotification('Leave Requested', `${request.employeeName} has submitted a new leave request.`, 'info');
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const renderDashboard = () => {
    const totalEmployees = employees.length;
    const onLeaveToday = employees.filter(e => e.status === 'On Leave').length;
    const pendingRequests = leaveRequests.filter(r => r.status === 'Pending').length;
    const activeJobs = jobPostings.filter(j => j.status === 'Active').length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: 'Total Employees', value: totalEmployees, change: '+12% from last month', icon: Users, color: 'text-indigo-600 bg-indigo-50' },
            { title: 'On Leave Today', value: onLeaveToday, change: 'Active leaves today', icon: Calendar, color: 'text-amber-600 bg-amber-50', action: () => setActiveTab('leave') },
            { title: 'Pending Requests', value: pendingRequests, change: 'Requires HR approval', icon: Clock, color: 'text-rose-600 bg-rose-50', action: () => setActiveTab('leave') },
            { title: 'Active Job Openings', value: activeJobs, change: 'Recruiting positions', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50', action: () => setActiveTab('jobs') },
          ].map((card, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{card.value}</h3>
                <p className="text-xs text-slate-500 mt-1">{card.change}</p>
                {card.action && (
                  <button onClick={card.action} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold mt-2 inline-flex items-center gap-1">
                    View details &rarr;
                  </button>
                )}
              </div>
              <div className={`p-4 rounded-xl ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        <DashboardCharts employees={employees} leaveRequests={leaveRequests} />
      </div>
    );
  };

  const renderJobs = () => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Job Openings</h2>
          <p className="text-sm text-slate-500">Manage active job postings and recruitment pipelines</p>
        </div>
        <button 
          onClick={() => alert('Add Job feature is coming soon!')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Job Posting
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-semibold">
              <th className="py-3 px-4">Job Title</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Applicants</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
            {jobPostings.map(job => (
              <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 font-medium text-slate-900">{job.title}</td>
                <td className="py-3.5 px-4">{job.department}</td>
                <td className="py-3.5 px-4">{job.location}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                    {job.type}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-indigo-600">{job.applicantsCount}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    job.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900 mb-2">System Settings</h2>
      <p className="text-sm text-slate-500 mb-6">Configure your HRMS preferences and company profile</p>
      <form onSubmit={(e) => { e.preventDefault(); alert('Settings saved successfully!'); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
          <input type="text" defaultValue="Acme Corporation" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
          <input type="email" defaultValue="hr@acme.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>
        <div className="flex items-center justify-between py-3 border-t border-slate-100">
          <div>
            <p className="text-sm font-medium text-slate-900">Email Notifications</p>
            <p className="text-xs text-slate-500">Receive daily summaries of leave requests</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
        </div>
        <div className="flex items-center justify-between py-3 border-t border-slate-100">
          <div>
            <p className="text-sm font-medium text-slate-900">Automatic Approvals</p>
            <p className="text-xs text-slate-500">Auto-approve sick leaves under 2 days</p>
          </div>
          <input type="checkbox" className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
        </div>
        <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          Save Changes
        </button>
      </form>
    </div>
  );

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'leave', label: 'Leave Management', icon: Calendar },
    { id: 'jobs', label: 'Job Openings', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2.5">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <Briefcase className="w-6 h-6" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">HRMS Portal</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Jane Doe</p>
              <p className="text-xs text-slate-500 truncate">HR Director</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-slate-900 text-slate-300 h-full">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="font-bold text-white text-lg">HRMS Portal</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-700">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search employees, requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-100 shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                    <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                    <button onClick={markAllNotificationsRead} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-3 text-left hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-indigo-50/30' : ''}`}>
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-100 shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-sm font-semibold text-slate-900">Jane Doe</p>
                    <p className="text-xs text-slate-500">hr@acme.com</p>
                  </div>
                  <button onClick={() => setActiveTab('settings')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <User className="w-4 h-4" /> Profile Settings
                  </button>
                  <button onClick={() => alert('Logged out successfully!')} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-50">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeTab}</h1>
                <p className="text-sm text-slate-500">Welcome back, Jane. Here is your HR overview.</p>
              </div>
              {activeTab === 'employees' && (
                <button
                  onClick={() => setIsAddEmployeeOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Employee
                </button>
              )}
              {activeTab === 'leave' && (
                <button
                  onClick={() => setIsRequestLeaveOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Request Leave
                </button>
              )}
            </div>

            {/* Tab Renderers */}
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'employees' && (
              <EmployeeDirectory
                employees={employees}
                onUpdate={handleUpdateEmployee}
                onDelete={handleDeleteEmployee}
                searchQuery={searchQuery}
              />
            )}
            {activeTab === 'leave' && (
              <LeaveManagement
                leaveRequests={leaveRequests}
                onApprove={handleApproveLeave}
                onReject={handleRejectLeave}
              />
            )}
            {activeTab === 'jobs' && renderJobs()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onAdd={handleAddEmployee}
      />

      <RequestLeaveModal
        isOpen={isRequestLeaveOpen}
        onClose={() => setIsRequestLeaveOpen(false)}
        employees={employees}
        onRequest={handleRequestLeave}
      />
    </div>
  );
}