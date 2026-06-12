export type Department = 'Engineering' | 'HR' | 'Design' | 'Marketing' | 'Sales' | 'Finance';

export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: Department;
  status: EmployeeStatus;
  joinDate: string;
  phone: string;
  avatarUrl?: string;
}

export type LeaveType = 'Annual' | 'Sick' | 'Maternity' | 'Paternity' | 'Unpaid' | 'Other';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  employeeAvatar?: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
}

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type JobStatus = 'Active' | 'Closed' | 'Draft';

export interface JobOpening {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: JobType;
  status: JobStatus;
  applicantsCount: number;
  postedDate: string;
  description: string;
}

export type ActivityType = 'employee' | 'leave' | 'job' | 'system';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  action: string;
  timestamp: string;
  performedBy: string;
  details?: string;
}

export interface DepartmentStat {
  department: Department;
  count: number;
}

export interface LeaveStat {
  type: LeaveType;
  count: number;
}

export interface MonthlyHiringStat {
  month: string;
  hired: number;
}

export interface DashboardStats {
  totalEmployees: number;
  employeesChangePercentage: number;
  onLeaveToday: number;
  pendingRequests: number;
  activeJobOpenings: number;
  departmentDistribution: DepartmentStat[];
  leaveDistribution: LeaveStat[];
  monthlyHiringTrend: MonthlyHiringStat[];
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  role: string;
  department: Department;
  phone: string;
  avatarUrl?: string;
}

export interface CreateLeaveRequestInput {
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface CreateJobOpeningInput {
  title: string;
  department: Department;
  location: string;
  type: JobType;
  description: string;
}