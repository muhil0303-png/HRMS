import React, { useState, useMemo } from 'react';
import { Check, X, Search, Calendar, Clock, Plus, AlertCircle, Filter } from 'lucide-react';
import type { LeaveRequest, LeaveStatus, LeaveType } from '../types';

interface LeaveManagementProps {
  leaveRequests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestLeaveClick: () => void;
}

export const LeaveManagement: React.FC<LeaveManagementProps> = ({
  leaveRequests,
  onApprove,
  onReject,
  onRequestLeaveClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<LeaveType | 'All'>('All');

  // Calculate quick stats for the header
  const stats = useMemo(() => {
    return leaveRequests.reduce(
      (acc, req) => {
        if (req.status === 'Pending') acc.pending++;
        else if (req.status === 'Approved') acc.approved++;
        else if (req.status === 'Rejected') acc.rejected++;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 }
    );
  }, [leaveRequests]);

  // Filtered leave requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((req) => {
      const matchesSearch =
        req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.employeeRole.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : req.status === statusFilter;
      const matchesType = typeFilter === 'All' ? true : req.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [leaveRequests, searchTerm, statusFilter, typeFilter]);

  const getStatusBadgeClass = (status: LeaveStatus): string => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getLeaveTypeBadgeClass = (type: LeaveType): string => {
    switch (type) {
      case 'Annual':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Sick':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Maternity':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Paternity':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Unpaid':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const clearFilters = (): void => {
    setSearchTerm('');
    setStatusFilter('All');
    setTypeFilter('All');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, approve, or reject employee time-off requests.
          </p>
        </div>
        <button
          onClick={onRequestLeaveClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          <Plus className="w-4 h-4" />
          Request Leave
        </button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Requests</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Approved Requests</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
            <Check className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rejected Requests</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{stats.rejected}</p>
          </div>
          <div className="p-2.5 bg-rose-50 rounded-lg text-rose-600">
            <X className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-card space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by employee name or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500 uppercase">Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeaveStatus | 'All')}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as LeaveType | 'All')}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Types</option>
            <option value="Annual">Annual</option>
            <option value="Sick">Sick</option>
            <option value="Maternity">Maternity</option>
            <option value="Paternity">Paternity</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Other">Other</option>
          </select>

          {(searchTerm || statusFilter !== 'All' || typeFilter !== 'All') && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Leave Requests Table / List */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No leave requests found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search query or filter criteria.
            </p>
            {(searchTerm || statusFilter !== 'All' || typeFilter !== 'All') && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {request.employeeAvatar ? (
                            <img
                              src={request.employeeAvatar}
                              alt={request.employeeName}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
                              {request.employeeName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{request.employeeName}</p>
                            <p className="text-xs text-slate-500">{request.employeeRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getLeaveTypeBadgeClass(request.type)}`}>
                          {request.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 font-medium">
                          {request.days} {request.days === 1 ? 'day' : 'days'}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(request.startDate)} - {formatDate(request.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 max-w-xs truncate" title={request.reason}>
                          {request.reason}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(request.appliedDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {request.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onReject(request.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all"
                              title="Reject Request"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onApprove(request.id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-100 transition-all"
                              title="Approve Request"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {request.employeeAvatar ? (
                        <img
                          src={request.employeeAvatar}
                          alt={request.employeeName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
                          {request.employeeName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{request.employeeName}</h4>
                        <p className="text-xs text-slate-500">{request.employeeRole}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(request.status)}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg text-xs">
                    <div>
                      <span className="text-slate-400 block">Leave Type</span>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full font-medium border ${getLeaveTypeBadgeClass(request.type)}`}>
                        {request.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Duration</span>
                      <span className="font-semibold text-slate-800 block mt-1">
                        {request.days} {request.days === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-slate-400 block">Dates</span>
                      <span className="text-slate-700 font-medium block mt-0.5">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Reason</span>
                    <p className="text-sm text-slate-600 mt-0.5">{request.reason}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      Applied: {formatDate(request.appliedDate)}
                    </span>
                    {request.status === 'Pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onReject(request.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => onApprove(request.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};