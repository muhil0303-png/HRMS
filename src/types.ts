export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

export type ActivityType = 'employee_added' | 'leave_requested' | 'leave_approved' | 'leave_rejected' | 'other';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  user?: string;
}

export type LeaveType = 'Annual' | 'Sick' | 'Maternity' | 'Paternity' | 'Unpaid' | 'Other';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string;
}

export interface Metrics {
  totalEmployees: number;
  employeeTrend: number;
  activeProjects: number;
  openPositions: number;
  pendingLeaveRequests: number;
}