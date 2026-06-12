import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, Filter } from 'lucide-react';
import type { Employee, Department, EmployeeStatus } from '../types';

interface EmployeeDirectoryProps {
  employees: Employee[];
  onAddEmployeeClick: () => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

type SortField = 'name' | 'department' | 'status' | 'joinDate';
type SortOrder = 'asc' | 'desc';

const DEPARTMENTS: Department[] = ['Engineering', 'HR', 'Design', 'Marketing', 'Sales', 'Finance'];
const STATUSES: EmployeeStatus[] = ['Active', 'On Leave', 'Terminated'];

export default function EmployeeDirectory({
  employees,
  onAddEmployeeClick,
  onEditEmployee,
  onDeleteEmployee,
}: EmployeeDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Handle sorting toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesSearch =
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
        const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortField === 'department') {
          comparison = a.department.localeCompare(b.department);
        } else if (sortField === 'status') {
          comparison = a.status.localeCompare(b.status);
        } else if (sortField === 'joinDate') {
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [employees, searchTerm, selectedDept, selectedStatus, sortField, sortOrder]);

  // Pagination calculations
  const totalItems = filteredAndSortedEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = useMemo(() => {
    return filteredAndSortedEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedEmployees, startIndex]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDept, selectedStatus]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadgeClass = (status: EmployeeStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'On Leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Terminated':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header & Controls */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Employee Directory</h2>
            <p className="text-sm text-slate-500">Manage and monitor your organization's workforce</p>
          </div>
          <button
            onClick={onAddEmployeeClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>

        {/* Filters Bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">Filters:</span>
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as Department | 'All')}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as EmployeeStatus | 'All')}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="inline-flex items-center gap-1 hover:text-slate-700"
                >
                  Employee
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('department')}
                  className="inline-flex items-center gap-1 hover:text-slate-700"
                >
                  Department
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('joinDate')}
                  className="inline-flex items-center gap-1 hover:text-slate-700"
                >
                  Join Date
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('status')}
                  className="inline-flex items-center gap-1 hover:text-slate-700"
                >
                  Status
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {employee.avatarUrl ? (
                        <img
                          src={employee.avatarUrl}
                          alt={employee.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                          {getInitials(employee.name)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{employee.name}</div>
                        <div className="text-xs text-slate-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{employee.role}</td>
                  <td className="p-4 text-sm text-slate-600">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      {employee.department}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(employee.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                        employee.status
                      )}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onEditEmployee(employee)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                        title="Edit Employee"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteEmployee(employee.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  <div className="max-w-xs mx-auto">
                    <p className="font-medium text-slate-700 mb-1">No employees found</p>
                    <p className="text-xs text-slate-400">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-700">{startIndex + 1}</span> to{' '}
            <span className="font-medium text-slate-700">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>{' '}
            of <span className="font-medium text-slate-700">{totalItems}</span> employees
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-brand-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}