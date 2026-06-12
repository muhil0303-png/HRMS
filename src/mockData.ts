import type {
  Employee,
  LeaveRequest,
  JobOpening,
  ActivityLog,
  NotificationItem
} from './types';

export const initialEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@company.com',
    role: 'VP of Human Resources',
    department: 'HR',
    status: 'Active',
    joinDate: '2020-03-15',
    phone: '+1 (555) 019-2834',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'EMP-002',
    name: 'David Chen',
    email: 'david.chen@company.com',
    role: 'Lead Software Engineer',
    department: 'Engineering',
    status: 'Active',
    joinDate: '2021-06-01',
    phone: '+1 (555) 014-3920',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'EMP-003',
    name: 'Elena Rostova',
    email: 'elena.rostova@company.com',
    role: 'Senior Product Designer',
    department: 'Design',
    status: 'Active',
    joinDate: '2021-11-10',
    phone: '+1 (555) 017-4829',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  {
    id: 'EMP-004',
    name: 'Marcus Thompson',
    email: 'marcus.thompson@company.com',
    role: 'DevOps Engineer',
    department: 'Engineering',
    status: 'On Leave',
    joinDate: '2022-02-15',
    phone: '+1 (555) 012-9483',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    id: 'EMP-005',
    name: 'Aisha Rahman',
    email: 'aisha.rahman@company.com',
    role: 'Marketing Director',
    department: 'Marketing',
    status: 'Active',
    joinDate: '2019-08-24',
    phone: '+1 (555) 011-2948',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    id: 'EMP-006',
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@company.com',
    role: 'Financial Analyst',
    department: 'Finance',
    status: 'Active',
    joinDate: '2023-01-15',
    phone: '+1 (555) 015-8392',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  },
  {
    id: 'EMP-007',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@company.com',
    role: 'Account Executive',
    department: 'Sales',
    status: 'Active',
    joinDate: '2022-05-12',
    phone: '+1 (555) 016-7291',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  },
  {
    id: 'EMP-008',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    role: 'Frontend Developer',
    department: 'Engineering',
    status: 'Active',
    joinDate: '2023-03-10',
    phone: '+1 (555) 018-3829',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'
  },
  {
    id: 'EMP-009',
    name: 'Chloe Dubois',
    email: 'chloe.dubois@company.com',
    role: 'HR Specialist',
    department: 'HR',
    status: 'Active',
    joinDate: '2022-09-01',
    phone: '+1 (555) 013-4820',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  },
  {
    id: 'EMP-010',
    name: 'Ryan Patel',
    email: 'ryan.patel@company.com',
    role: 'Full Stack Engineer',
    department: 'Engineering',
    status: 'On Leave',
    joinDate: '2022-10-15',
    phone: '+1 (555) 019-4821',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
  }
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR-101',
    employeeId: 'EMP-004',
    employeeName: 'Marcus Thompson',
    employeeRole: 'DevOps Engineer',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    type: 'Annual',
    startDate: '2025-03-10',
    endDate: '2025-03-17',
    days: 5,
    reason: 'Family vacation trip to Hawaii.',
    status: 'Approved',
    appliedDate: '2025-02-20'
  },
  {
    id: 'LR-102',
    employeeId: 'EMP-010',
    employeeName: 'Ryan Patel',
    employeeRole: 'Full Stack Engineer',
    employeeAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    type: 'Sick',
    startDate: '2025-03-12',
    endDate: '2025-03-14',
    days: 2,
    reason: 'Recovering from dental surgery.',
    status: 'Approved',
    appliedDate: '2025-03-11'
  },
  {
    id: 'LR-103',
    employeeId: 'EMP-003',
    employeeName: 'Elena Rostova',
    employeeRole: 'Senior Product Designer',
    employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    type: 'Annual',
    startDate: '2025-04-05',
    endDate: '2025-04-12',
    days: 6,
    reason: 'Attending a design conference and personal days.',
    status: 'Pending',
    appliedDate: '2025-03-01'
  },
  {
    id: 'LR-104',
    employeeId: 'EMP-007',
    employeeName: 'Sophia Martinez',
    employeeRole: 'Account Executive',
    employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    type: 'Maternity',
    startDate: '2025-05-01',
    endDate: '2025-07-24',
    days: 60,
    reason: 'Maternity leave.',
    status: 'Pending',
    appliedDate: '2025-02-28'
  },
  {
    id: 'LR-105',
    employeeId: 'EMP-008',
    employeeName: 'James Wilson',
    employeeRole: 'Frontend Developer',
    employeeAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    type: 'Unpaid',
    startDate: '2025-03-25',
    endDate: '2025-03-26',
    days: 1,
    reason: 'Personal urgent matters.',
    status: 'Pending',
    appliedDate: '2025-03-05'
  },
  {
    id: 'LR-106',
    employeeId: 'EMP-006',
    employeeName: 'Liam O\'Connor',
    employeeRole: 'Financial Analyst',
    employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    type: 'Other',
    startDate: '2025-02-10',
    endDate: '2025-02-11',
    days: 1,
    reason: 'Moving to a new apartment.',
    status: 'Rejected',
    appliedDate: '2025-02-05'
  }
];

export const initialJobOpenings: JobOpening[] = [
  {
    id: 'JOB-001',
    title: 'Senior React Developer',
    department: 'Engineering',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    status: 'Active',
    applicantsCount: 24,
    postedDate: '2025-02-15'
  },
  {
    id: 'JOB-002',
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote (US/Canada)',
    type: 'Remote',
    status: 'Active',
    applicantsCount: 42,
    postedDate: '2025-02-20'
  },
  {
    id: 'JOB-003',
    title: 'HR Generalist',
    department: 'HR',
    location: 'New York, NY (On-site)',
    type: 'Full-time',
    status: 'Active',
    applicantsCount: 12,
    postedDate: '2025-03-01'
  },
  {
    id: 'JOB-004',
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'London, UK (Hybrid)',
    type: 'Full-time',
    status: 'Draft',
    applicantsCount: 0,
    postedDate: '2025-03-04'
  },
  {
    id: 'JOB-005',
    title: 'Sales Development Representative',
    department: 'Sales',
    location: 'Austin, TX (On-site)',
    type: 'Full-time',
    status: 'Closed',
    applicantsCount: 56,
    postedDate: '2025-01-10'
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'ACT-001',
    type: 'employee',
    message: 'New employee Sarah Jenkins was added to HR department.',
    timestamp: '2 hours ago',
    user: {
      name: 'Admin User',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    }
  },
  {
    id: 'ACT-002',
    type: 'leave',
    message: 'Marcus Thompson\'s leave request was approved.',
    timestamp: '4 hours ago',
    user: {
      name: 'Sarah Jenkins',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    }
  },
  {
    id: 'ACT-003',
    type: 'job',
    message: 'New job opening "Senior React Developer" was posted.',
    timestamp: '1 day ago',
    user: {
      name: 'Sarah Jenkins',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    }
  },
  {
    id: 'ACT-004',
    type: 'leave',
    message: 'Elena Rostova submitted a new leave request for Annual Leave.',
    timestamp: '2 days ago',
    user: {
      name: 'Elena Rostova',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    }
  },
  {
    id: 'ACT-005',
    type: 'system',
    message: 'Monthly payroll processing completed successfully.',
    timestamp: '3 days ago',
    user: {
      name: 'System Bot'
    }
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'NOT-001',
    title: 'New Leave Request',
    message: 'Elena Rostova requested 6 days of Annual Leave.',
    time: '10 minutes ago',
    read: false,
    type: 'info'
  },
  {
    id: 'NOT-002',
    title: 'Job Application',
    message: 'John Doe applied for the Senior React Developer position.',
    time: '1 hour ago',
    read: false,
    type: 'success'
  },
  {
    id: 'NOT-003',
    title: 'System Maintenance',
    message: 'The HRMS portal will undergo scheduled maintenance tonight at 12:00 AM EST.',
    time: '5 hours ago',
    read: true,
    type: 'warning'
  },
  {
    id: 'NOT-004',
    title: 'Leave Approved',
    message: 'Your leave request for March 10 - March 17 has been approved.',
    time: '1 day ago',
    read: true,
    type: 'success'
  }
];