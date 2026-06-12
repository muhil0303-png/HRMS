import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  X, 
  Briefcase, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  Filter,
  Trash2,
  ChevronRight
} from 'lucide-react';
import type { Employee, Department, EmploymentStatus, EmployeeFilters } from '../types';

interface EmployeeListProps {
  employees: Employee[];
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onDeleteEmployee?: (id: string) => void;
}

const DEPARTMENTS: Department[] = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'HR',
  'Sales',
  'Finance'
];

const STATUSES: EmploymentStatus[] = ['Active', 'On Leave', 'Remote'];

export default function EmployeeList({ 
  employees, 
  onAddEmployee,
  onDeleteEmployee 
}: EmployeeListProps) {
  // Filter States
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: '',
    department: 'All',
    status: 'All',
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Engineering' as Department,
    status: 'Active' as EmploymentStatus,
    joinDate: new Date().toISOString().split('T')[0],
  });

  // Filter Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.role.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesDept = filters.department === 'All' || employee.department === filters.department;
      const matchesStatus = filters.status === 'All' || employee.status === filters.status;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, filters]);

  // Form Validation & Submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (min 10 digits)';
    }
    if (!formData.role.trim()) newErrors.role = 'Role/Designation is required';
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Generate a clean UI Avatar based on initials
    const initials = formData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.name) + '&background=0ea5e9&color=fff&bold=true';

    onAddEmployee({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      joinDate: formData.joinDate,
      avatar: avatarUrl,
    });

    // Reset Form & Close Modal
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: 'Engineering',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    setIsModalOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: 'All',
      status: 'All',
    });
  };

  const getStatusBadgeClass = (status: EmploymentStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'On Leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Remote':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employee Directory</h1>
          <p className="text-sm text-slate-500">
            Manage, filter, and onboard members of your organization.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus-ring transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Filters Panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Search Input */}
          <div className="relative md:col-span-5">
            <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <div className="md:col-span-3">
            <select
              value={filters.department}
              onChange={(e) => 
                setFilters({ ...filters, department: e.target.value as Department | 'All' })
              }
              className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={filters.status}
              onChange={(e) => 
                setFilters({ ...filters, status: e.target.value as EmploymentStatus | 'All' })
              }
              className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-center justify-end md:col-span-1">
            <button
              onClick={handleResetFilters}
              disabled={filters.search === '' && filters.department === 'All' && filters.status === 'All'}
              className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-slate-50 md:w-9"
              title="Reset Filters"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700">
              <tr>
                <th scope="col" className="px-6 py-4">Employee</th>
                <th scope="col" className="px-6 py-4">Department</th>
                <th scope="col" className="px-6 py-4">Role</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Join Date</th>
                {onDeleteEmployee && <th scope="col" className="px-6 py-4"><span className="sr-only">Actions</span></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 border-t border-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={onDeleteEmployee ? 6 : 5} className="px-6 py-10 text-center text-slate-400">
                    No employees found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50/50">
                    <td className="flex gap-3 px-6 py-4 font-normal text-slate-900">
                      <div className="relative h-10 w-10 shrink-0">
                        <img
                          className="h-full w-full rounded-full object-cover"
                          src={employee.avatar}
                          alt={employee.name}
                        />
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold text-slate-800">{employee.name}</div>
                        <div className="text-slate-400">{employee.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/10">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{employee.role}</td>
                    <td className="px-6 py-4">
                      <span className={'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ' + getStatusBadgeClass(employee.status)}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{employee.joinDate}</td>
                    {onDeleteEmployee && (
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => onDeleteEmployee(employee.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete Employee"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">Add New Employee</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <User className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder="john.doe@company.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Phone Number
                </label>
                <div className="relative mt-1">
                  <Phone className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder="+1 555-0100"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role / Designation
                  </label>
                  <div className="relative mt-1">
                    <Briefcase className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                      placeholder="Software Engineer"
                    />
                  </div>
                  {errors.role && <p className="mt-1 text-xs text-rose-500">{errors.role}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                    className="mt-1 w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status & Join Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EmploymentStatus })}
                    className="mt-1 w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Join Date
                  </label>
                  <div className="relative mt-1">
                    <Calendar className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  {errors.joinDate && <p className="mt-1 text-xs text-rose-500">{errors.joinDate}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}