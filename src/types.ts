export type Department = 'Engineering' | 'Product' | 'Design' | 'Marketing' | 'HR' | 'Sales' | 'Finance';

export type EmploymentStatus = 'Active' | 'On Leave' | 'Remote';

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: Department;
  status: EmploymentStatus;
  joinDate: string;
  phone: string;
}

export type LeaveType = 'Annual' | 'Sick' | 'Maternity' | 'Paternity' | 'Unpaid' | 'Other';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: Department;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
}

export type ActivityType = 'onboarding' | 'leave_approved' | 'leave_rejected' | 'leave_applied' | 'status_change';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  userName: string;
  userAvatar?: string;
}

export interface StatCardData {
  id: string;
  title: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  iconName: 'Users' | 'UserCheck' | 'Clock' | 'CalendarDays';
  color: 'blue' | 'green' | 'amber' | 'purple' | 'rose' | 'slate';
}

export interface EmployeeFilters {
  search: string;
  department: Department | 'All';
  status: EmploymentStatus | 'All';
}

export interface NewEmployeeInput {
  name: string;
  email: string;
  role: string;
  department: Department;
  status: EmploymentStatus;
  phone: string;
  joinDate: string;
}