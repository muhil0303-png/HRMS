import React, { useState, useMemo } from 'react';
import { 
  Users, Briefcase, FileText, Clock, Calendar, Search, Check, X, UserPlus, Trash2 
} from 'lucide-react';
import type { Employee, Activity, LeaveRequest, LeaveType } from './types';

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Alice Johnson', email: 'alice.j@company.com', department: 'Human Resources', role: 'HR Manager', status: 'Active', joinDate: '2023-01-15' },
  { id: 'emp-2', name: 'Bob Smith', email: 'bob.s@company.com', department: 'Engineering', role: 'Senior Developer', status: 'Active', joinDate: '2023-06-20' },
  { id: 'emp-3', name: 'Charlie Brown', email: 'charlie.b@company.com', department: 'Design', role: 'Product Designer', status: 'Active', joinDate: '2024-02-10' },
  { id: 'emp-4', name: 'Diana Prince', email: 'diana.p@company.com', department: 'Engineering', role: 'QA Engineer', status: 'Inactive', joinDate: '2024-05-12' }
];

const INITIAL_LEAVES: LeaveRequest[] = [
  { id: 'leave-1', employeeId: 'emp-2', employeeName: 'Bob Smith', type: 'Annual', startDate: '2025-03-10', endDate: '2025-03-15', status: 'Pending', reason: 'Family vacation' },
  { id: 'leave-2', employeeId: 'emp-3', employeeName: 'Charlie Brown', type: 'Sick', startDate: '2025-02-20', endDate: '2025-02-22', status: 'Approved', reason: 'Dental surgery' }
];

const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'act-1', type: 'leave_approved', message: 'Approved leave request for Charlie Brown', timestamp: '2 hours ago', user: 'Alice Johnson' },
  { id: 'act-2', type: 'employee_added', message: 'Diana Prince joined as QA Engineer in Engineering', timestamp: '1 day ago', user: 'Alice Johnson' }
];

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  const [isAddEmpOpen, setIsAddEmpOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  
  const [newEmp, setNewEmp] = useState<{ name: string; email: string; department: string; role: string; status: 'Active' | 'Inactive' }>({ name: '', email: '', department: '', role: '', status: 'Active' });
  const [newLeave, setNewLeave] = useState({ employeeId: '', type: 'Annual' as LeaveType, startDate: '', endDate: '', reason: '' });

  const activeEmployees = useMemo(() => employees.filter(e => e.status === 'Active'), [employees]);
  const pendingLeavesCount = useMemo(() => leaves.filter(l => l.status === 'Pending').length, [leaves]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.email || !newEmp.department || !newEmp.role) return;
    
    const employee: Employee = {
      id: `emp-${Date.now()}`,
      ...newEmp,
      joinDate: new Date().toISOString().split('T')[0] || '',
    };
    
    setEmployees(prev => [employee, ...prev]);
    setActivities(prev => [{
      id: `act-${Date.now()}`,
      type: 'employee_added',
      message: `${employee.name} joined as ${employee.role} in ${employee.department}`,
      timestamp: 'Just now',
      user: 'HR Admin'
    }, ...prev]);
    
    setIsAddEmpOpen(false);
    setNewEmp({ name: '', email: '', department: '', role: '', status: 'Active' });
  };

  const handleRequestLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeave.employeeId || !newLeave.startDate || !newLeave.endDate || !newLeave.reason) return;
    
    const emp = employees.find(e => e.id === newLeave.employeeId);
    if (!emp) return;
    
    const leave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      type: newLeave.type,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      status: 'Pending',
      reason: newLeave.reason
    };
    
    setLeaves(prev => [leave, ...prev]);
    setActivities(prev => [{
      id: `act-${Date.now()}`,
      type: 'leave_requested',
      message: `${emp.name} requested ${newLeave.type} leave`,
      timestamp: 'Just now',
      user: 'HR Admin'
    }, ...prev]);
    
    setIsLeaveOpen(false);
    setNewLeave({ employeeId: '', type: 'Annual', startDate: '', endDate: '', reason: '' });
  };

  const handleApproveLeave = (id: string) => {
    setLeaves(prev => prev.map(l => {
      if (l.id === id) {
        setActivities(act => [{
          id: `act-${Date.now()}`,
          type: 'leave_approved',
          message: `Approved leave request for ${l.employeeName}`,
          timestamp: 'Just now',
          user: 'HR Admin'
        }, ...act]);
        return { ...l, status: 'Approved' as const };
      }
      return l;
    }));
  };

  const handleRejectLeave = (id: string) => {
    setLeaves(prev => prev.map(l => {
      if (l.id === id) {
        setActivities(act => [{
          id: `act-${Date.now()}`,
          type: 'leave_rejected',
          message: `Rejected leave request for ${l.employeeName}`,
          timestamp: 'Just now',
          user: 'HR Admin'
        }, ...act]);
        return { ...l, status: 'Rejected' as const };
      }
      return l;
    }));
  };

  const handleDeleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    if (confirm(`Are you sure you want to remove ${emp.name}?`)) {
      setEmployees(prev => prev.filter(e => e.id !== id));
      setActivities(prev => [{
        id: `act-${Date.now()}`,
        type: 'other',
        message: `Removed employee ${emp.name}`,
        timestamp: 'Just now',
        user: 'HR Admin'
      }, ...prev]);
    }
  };

  return (
    <div className="hrms-app">
      <style>{`
        .hrms-app { font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; color: #0f172a; min-height: 100vh; padding: 2rem; }
        .hrms-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .hrms-title h1 { margin: 0; font-size: 1.875rem; font-weight: 700; color: #1e293b; }
        .hrms-title p { margin: 0.25rem 0 0 0; color: #64748b; font-size: 0.875rem; }
        .hrms-actions { display: flex; gap: 0.75rem; }
        .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .btn-primary { background-color: #4f46e5; color: #ffffff; }
        .btn-primary:hover { background-color: #4338ca; }
        .btn-secondary { background-color: #ffffff; color: #334155; border-color: #cbd5e1; }
        .btn-secondary:hover { background-color: #f1f5f9; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .metric-card { background: #ffffff; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; border: 1px solid #f1f5f9; }
        .metric-info h3 { margin: 0; font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .metric-value { font-size: 1.75rem; font-weight: 700; margin: 0.5rem 0 0.25rem 0; color: #0f172a; }
        .metric-trend { font-size: 0.75rem; font-weight: 500; color: #10b981; display: flex; align-items: center; gap: 0.25rem; }
        .metric-icon { padding: 0.75rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; }
        .main-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        @media (max-width: 1024px) { .main-layout { grid-template-columns: 1fr; } }
        .section-card { background: #ffffff; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #f1f5f9; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
        .section-header h2 { margin: 0; font-size: 1.125rem; font-weight: 600; color: #1e293b; }
        .search-filter-bar { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .search-input-wrapper { position: relative; flex: 1; min-width: 200px; }
        .search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; width: 1.1rem; height: 1.1rem; }
        .search-input { width: 100%; padding: 0.5rem 0.75rem 0.5rem 2.25rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box; }
        .filter-select { padding: 0.5rem 1.5rem 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; background-color: #ffffff; cursor: pointer; }
        .table-wrapper { overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
        .data-table th { background-color: #f8fafc; padding: 0.75rem 1rem; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
        .data-table td { padding: 0.875rem 1rem; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
        .status-badge { display: inline-flex; align-items: center; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
        .status-active { background-color: #dcfce7; color: #15803d; }
        .status-inactive { background-color: #f1f5f9; color: #475569; }
        .status-pending { background-color: #fef3c7; color: #d97706; }
        .status-approved { background-color: #dcfce7; color: #15803d; }
        .status-rejected { background-color: #fee2e2; color: #b91c1c; }
        .action-icon-btn { background: none; border: none; cursor: pointer; padding: 0.35rem; border-radius: 0.25rem; color: #64748b; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
        .action-icon-btn:hover { background-color: #f1f5f9; }
        .action-icon-btn.delete:hover { color: #ef4444; background-color: #fee2e2; }
        .action-icon-btn.approve:hover { color: #10b981; background-color: #dcfce7; }
        .action-icon-btn.reject:hover { color: #ef4444; background-color: #fee2e2; }
        .activity-list { display: flex; flex-direction: column; gap: 1rem; }
        .activity-item { display: flex; gap: 0.75rem; align-items: flex-start; }
        .activity-icon-wrapper { padding: 0.5rem; border-radius: 50%; background-color: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; }
        .activity-content { flex: 1; }
        .activity-message { font-size: 0.85rem; margin: 0; color: #334155; line-height: 1.4; }
        .activity-time { font-size: 0.75rem; color: #94a3b8; margin-top: 0.15rem; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
        .modal-container { background: #ffffff; border-radius: 0.75rem; width: 100%; max-width: 480px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e2e8f0; }
        .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; color: #1e293b; }
        .modal-close { background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; align-items: center; }
        .modal-close:hover { color: #475569; }
        .modal-body { padding: 1.5rem; }
        .form-group { margin-bottom: 1.25rem; }
        .form-group label { display: block; font-size: 0.875rem; font-weight: 500; color: #475569; margin-bottom: 0.5rem; }
        .form-control { width: 100%; padding: 0.625rem 0.75rem; border-radius: 0.375rem; border: 1px solid #cbd5e1; font-size: 0.875rem; box-sizing: border-box; background-color: #ffffff; }
        .form-control:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
        .modal-footer { padding: 1rem 1.5rem; background-color: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 0.75rem; }
        .empty-state { text-align: center; padding: 2rem; color: #64748b; font-size: 0.875rem; }
      `}</style>

      {/* Header */}
      <header className="hrms-header">
        <div className="hrms-title">
          <h1>HRMS Dashboard</h1>
          <p>Manage your organization's employees, leave requests, and activities.</p>
        </div>
        <div className="hrms-actions">
          <button className="btn btn-secondary" onClick={() => setIsLeaveOpen(true)} aria-label="Request Leave">
            <Calendar size={16} /> Request Leave
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddEmpOpen(true)} aria-label="Add Employee">
            <UserPlus size={16} /> Add Employee
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <section className="metrics-grid" aria-label="Key HR Metrics">
        <div className="metric-card">
          <div className="metric-info">
            <h3>Total Employees</h3>
            <div className="metric-value">{employees.length}</div>
            <span className="metric-trend">+{employees.filter(e => e.status === 'Active').length} Active</span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h3>Active Projects</h3>
            <div className="metric-value">5</div>
            <span className="metric-trend" style={{ color: '#64748b' }}>On Track</span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Briefcase size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h3>Open Positions</h3>
            <div className="metric-value">3</div>
            <span className="metric-trend" style={{ color: '#4f46e5' }}>2 Active Hiring</span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <FileText size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h3>Pending Leaves</h3>
            <div className="metric-value">{pendingLeavesCount}</div>
            <span className="metric-trend" style={{ color: pendingLeavesCount > 0 ? '#f59e0b' : '#10b981' }}>
              {pendingLeavesCount > 0 ? 'Requires Action' : 'All Cleared'}
            </span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
            <Clock size={24} />
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <main className="main-layout">
        {/* Left Column: Directory & Leaves */}
        <div className="layout-left">
          {/* Employee Directory */}
          <section className="section-card" aria-label="Employee Directory">
            <div className="section-header">
              <h2>Employee Directory</h2>
            </div>
            
            <div className="search-filter-bar">
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by name, role, or department..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search employees"
                />
              </div>
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="table-wrapper">
              {filteredEmployees.length === 0 ? (
                <div className="empty-state">No employees found matching the criteria.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Join Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(emp => (
                      <tr key={emp.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{emp.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.email}</div>
                        </td>
                        <td>{emp.department}</td>
                        <td>{emp.role}</td>
                        <td>
                          <span className={`status-badge ${emp.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td>{emp.joinDate}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            className="action-icon-btn delete" 
                            onClick={() => handleDeleteEmployee(emp.id)}
                            title="Remove Employee"
                            aria-label={`Remove ${emp.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Leave Requests */}
          <section className="section-card" aria-label="Leave Requests">
            <div className="section-header">
              <h2>Leave Requests</h2>
            </div>

            <div className="table-wrapper">
              {leaves.length === 0 ? (
                <div className="empty-state">No leave requests submitted yet.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map(leave => (
                      <tr key={leave.id}>
                        <td style={{ fontWeight: 500 }}>{leave.employeeName}</td>
                        <td>{leave.type}</td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{leave.startDate} to {leave.endDate}</div>
                        </td>
                        <td style={{ color: '#64748b', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={leave.reason}>
                          {leave.reason}
                        </td>
                        <td>
                          <span className={`status-badge status-${leave.status.toLowerCase()}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {leave.status === 'Pending' ? (
                            <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                              <button 
                                className="action-icon-btn approve" 
                                onClick={() => handleApproveLeave(leave.id)}
                                title="Approve Leave"
                                aria-label={`Approve leave for ${leave.employeeName}`}
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                className="action-icon-btn reject" 
                                onClick={() => handleRejectLeave(leave.id)}
                                title="Reject Leave"
                                aria-label={`Reject leave for ${leave.employeeName}`}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Recent Activities */}
        <div className="layout-right">
          <section className="section-card" aria-label="Recent Activities">
            <div className="section-header">
              <h2>Recent Activities</h2>
            </div>
            
            {activities.length === 0 ? (
              <div className="empty-state">No recent activities recorded.</div>
            ) : (
              <div className="activity-list">
                {activities.map(act => (
                  <div className="activity-item" key={act.id}>
                    <div className="activity-icon-wrapper">
                      {act.type === 'employee_added' ? <UserPlus size={14} /> : <Calendar size={14} />}
                    </div>
                    <div className="activity-content">
                      <p className="activity-message">{act.message}</p>
                      <span className="activity-time">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Add Employee Modal */}
      {isAddEmpOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Add New Employee</h3>
              <button className="modal-close" onClick={() => setIsAddEmpOpen(false)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddEmployee}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="emp-name">Full Name</label>
                  <input 
                    id="emp-name"
                    type="text" 
                    className="form-control" 
                    required 
                    value={newEmp.name}
                    onChange={(e) => setNewEmp(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emp-email">Email Address</label>
                  <input 
                    id="emp-email"
                    type="email" 
                    className="form-control" 
                    required 
                    value={newEmp.email}
                    onChange={(e) => setNewEmp(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emp-dept">Department</label>
                  <input 
                    id="emp-dept"
                    type="text" 
                    className="form-control" 
                    required 
                    placeholder="e.g. Engineering, HR"
                    value={newEmp.department}
                    onChange={(e) => setNewEmp(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emp-role">Role / Title</label>
                  <input 
                    id="emp-role"
                    type="text" 
                    className="form-control" 
                    required 
                    placeholder="e.g. Senior Developer"
                    value={newEmp.role}
                    onChange={(e) => setNewEmp(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emp-status">Status</label>
                  <select 
                    id="emp-status"
                    className="form-control"
                    value={newEmp.status}
                    onChange={(e) => setNewEmp(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddEmpOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Leave Modal */}
      {isLeaveOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Request Leave</h3>
              <button className="modal-close" onClick={() => setIsLeaveOpen(false)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRequestLeave}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="leave-emp">Employee</label>
                  <select 
                    id="leave-emp"
                    className="form-control" 
                    required
                    value={newLeave.employeeId}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, employeeId: e.target.value }))}
                  >
                    <option value="">Select an employee...</option>
                    {activeEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="leave-type">Leave Type</label>
                  <select 
                    id="leave-type"
                    className="form-control"
                    value={newLeave.type}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, type: e.target.value as LeaveType }))}
                  >
                    <option value="Annual">Annual</option>
                    <option value="Sick">Sick</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Paternity">Paternity</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="leave-start">Start Date</label>
                    <input 
                      id="leave-start"
                      type="date" 
                      className="form-control" 
                      required
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="leave-end">End Date</label>
                    <input 
                      id="leave-end"
                      type="date" 
                      className="form-control" 
                      required
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="leave-reason">Reason</label>
                  <input 
                    id="leave-reason"
                    type="text" 
                    className="form-control" 
                    required
                    placeholder="Brief description of leave reason"
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, reason: e.target.value }))}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsLeaveOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}