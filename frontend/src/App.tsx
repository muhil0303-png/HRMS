import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Briefcase, 
  RefreshCw, 
  AlertCircle,
  Building2,
  Calendar,
  ChevronRight,
  Search,
  Bell,
  HelpCircle
} from 'lucide-react';

interface Summary {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  openPositions: number;
}

interface DepartmentHeadcount {
  name: string;
  headcount: number;
}

interface RecentJoiner {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  joinDate: string;
  avatar: string;
}

interface AttendanceStats {
  Present: number;
  Absent: number;
  Leave: number;
}

function App() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [departments, setDepartments] = useState<DepartmentHeadcount[]>([]);
  const [recentJoiners, setRecentJoiners] = useState<RecentJoiner[]>([]);
  const [attendance, setAttendance] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, deptsRes, joinersRes, attendanceRes] = await Promise.all([
        fetch('/api/dashboard/summary'),
        fetch('/api/dashboard/departments'),
        fetch('/api/dashboard/recent-joiners'),
        fetch('/api/dashboard/attendance')
      ]);

      if (!summaryRes.ok || !deptsRes.ok || !joinersRes.ok || !attendanceRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const summaryData = await summaryRes.json();
      const deptsData = await deptsRes.json();
      const joinersData = await joinersRes.json();
      const attendanceData = await attendanceRes.json();

      setSummary(summaryData);
      setDepartments(deptsData);
      setRecentJoiners(joinersData);
      setAttendance(attendanceData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate attendance rate
  const totalAttendance = attendance ? (attendance.Present + attendance.Absent + attendance.Leave) : 0;
  const attendanceRate = totalAttendance > 0 ? Math.round((attendance!.Present / totalAttendance) * 100) : 0;

  // SVG Donut Chart calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attendanceRate / 100) * circumference;

  // Max headcount for scaling the bar chart
  const maxHeadcount = departments.length > 0 ? Math.max(...departments.map(d => d.headcount)) : 1;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Branding */}
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md shadow-indigo-100">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">HRMS</span>
              <span className="text-xs block text-slate-500 font-medium -mt-1">Enterprise Portal</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-full px-3 py-1.5 w-80 border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <Search className="h-4 w-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search employees, files, settings..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <HelpCircle className="h-5 w-5" />
            </button>
            
            <div className="h-8 w-px bg-slate-200"></div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" 
                alt="Admin Avatar" 
                className="h-9 w-9 rounded-full object-cover border-2 border-indigo-100"
              />
              <div className="hidden sm:block text-left">
                <span className="block text-sm font-semibold text-slate-800">Robert Fox</span>
                <span className="block text-xs text-indigo-600 font-medium">HR Director</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Refresh Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 mt-1">Real-time insights and management of your organization's workforce.</p>
          </div>
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-rose-800">Failed to load dashboard data</h3>
              <p className="text-sm text-rose-700 mt-1">{error}</p>
              <button 
                onClick={fetchData} 
                className="mt-2 text-xs font-semibold text-rose-800 underline hover:text-rose-900"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !summary ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-slate-500 font-medium">Loading HRMS Dashboard...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Card 1: Total Employees */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-500">Total Employees</span>
                  <div className="text-3xl font-bold text-slate-900">{summary?.totalEmployees ?? 0}</div>
                  <span className="text-xs text-emerald-600 font-medium flex items-center">
                    Active workforce
                  </span>
                </div>
                <div className="bg-indigo-50 text-indigo-600 p-4 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              {/* Card 2: Present Today */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-500">Present Today</span>
                  <div className="text-3xl font-bold text-slate-900">{summary?.presentToday ?? 0}</div>
                  <span className="text-xs text-indigo-600 font-medium flex items-center">
                    On-duty staff
                  </span>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl">
                  <UserCheck className="h-6 w-6" />
                </div>
              </div>

              {/* Card 3: On Leave */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-500">On Leave</span>
                  <div className="text-3xl font-bold text-slate-900">{summary?.onLeave ?? 0}</div>
                  <span className="text-xs text-amber-600 font-medium flex items-center">
                    Approved absences
                  </span>
                </div>
                <div className="bg-amber-50 text-amber-600 p-4 rounded-xl">
                  <UserMinus className="h-6 w-6" />
                </div>
              </div>

              {/* Card 4: Open Positions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-500">Open Positions</span>
                  <div className="text-3xl font-bold text-slate-900">{summary?.openPositions ?? 0}</div>
                  <span className="text-xs text-indigo-600 font-medium flex items-center">
                    Active recruitment
                  </span>
                </div>
                <div className="bg-rose-50 text-rose-600 p-4 rounded-xl">
                  <Briefcase className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Department Headcount Bar Chart */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-2 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Department Headcount</h2>
                    <p className="text-xs text-slate-500">Distribution of employees across departments</p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {departments.length} Departments
                  </span>
                </div>

                {/* Custom SVG/HTML Bar Chart */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  {departments.map((dept) => {
                    const percentage = (dept.headcount / maxHeadcount) * 100;
                    return (
                      <div key={dept.name} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-slate-700">{dept.name}</span>
                          <span className="font-bold text-slate-900">{dept.headcount} {dept.headcount === 1 ? 'employee' : 'employees'}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attendance Rate Donut Chart */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-between">
                <div className="w-full text-left mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Attendance Rate</h2>
                  <p className="text-xs text-slate-500">Today's attendance status overview</p>
                </div>

                {/* Donut Chart SVG */}
                <div className="relative flex items-center justify-center h-48 w-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className="text-slate-100"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {/* Foreground circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className="text-indigo-600 transition-all duration-500 ease-out"
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-900">{attendanceRate}%</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="w-full grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100 text-center">
                  <div>
                    <span className="block text-xs text-slate-500 font-medium">Present</span>
                    <span className="text-sm font-bold text-emerald-600">{attendance?.Present ?? 0}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-medium">Absent</span>
                    <span className="text-sm font-bold text-rose-600">{attendance?.Absent ?? 0}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-medium">Leave</span>
                    <span className="text-sm font-bold text-amber-600">{attendance?.Leave ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Joiners Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Recent Joiners</h2>
                  <p className="text-xs text-slate-500">Newly onboarded team members</p>
                </div>
                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center">
                  View Directory <ChevronRight className="h-4 w-4 ml-0.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                      <th className="py-4 px-6">Employee</th>
                      <th className="py-4 px-6">Department</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Join Date</th>
                      <th className="py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {recentJoiners.map((joiner) => (
                      <tr key={joiner.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 flex items-center space-x-3">
                          <img 
                            src={joiner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(joiner.name)}&background=random`} 
                            alt={joiner.name} 
                            className="h-10 w-10 rounded-full object-cover border border-slate-100"
                          />
                          <div>
                            <span className="block font-semibold text-slate-900">{joiner.name}</span>
                            <span className="block text-xs text-slate-500">{joiner.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {joiner.department}
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {joiner.role}
                        </td>
                        <td className="py-4 px-6 text-slate-500 flex items-center space-x-1.5">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>{new Date(joiner.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            joiner.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          }`}>
                            {joiner.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} HRMS Enterprise. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;