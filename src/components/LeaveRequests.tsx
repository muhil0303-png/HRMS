import React, { useState, useMemo } from 'react';
import {
  Check,
  X,
  Calendar,
  Clock,
  Search,
  Filter,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
  FileText,
  Briefcase,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import type { LeaveRequest, LeaveStatus, LeaveType, Department } from '../types';

interface LeaveRequestsProps {
  requests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const LEAVE_TYPES: (LeaveType | 'All')[] = ['All', 'Annual', 'Sick', 'Maternity', 'Paternity', 'Unpaid', 'Other'];

const getLeaveTypeColor = (type: LeaveType): string => {
  switch (type) {
    case 'Annual':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Sick':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Maternity':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Paternity':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Unpaid':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getStatusColor = (status: LeaveStatus): string => {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export default function LeaveRequests({ requests, onApprove, onReject }: LeaveRequestsProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<LeaveType | 'All'>('All');
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    id: string;
    employeeName: string;
    type: 'approve' | 'reject';
  } | null>(null);

  const pendingCount = useMemo(() => {
    return requests.filter((r) => r.status === 'Pending').length;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesTab = activeTab === 'pending' ? req.status === 'Pending' : req.status !== 'Pending';
      
      const matchesSearch =
        req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'All' || req.type === selectedType;

      return matchesTab && matchesSearch && matchesType;
    });
  }, [requests, activeTab, searchQuery, selectedType]);

  const toggleExpand = (id: string) => {
    setExpandedRequestId((prev) => (prev === id ? null : id));
  };

  const handleActionClick = (id: string, employeeName: string, type: 'approve' | 'reject') => {
    setConfirmModal({ id, employeeName, type });
  };

  const handleConfirmAction = () => {
    if (!confirmModal) return;
    if (confirmModal.type === 'approve') {
      onApprove(confirmModal.id);
    } else {
      onReject(confirmModal.id);
    }
    setConfirmModal(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Leave Requests</h2>
            <p className="text-sm text-slate-500">Review and manage employee time-off applications</p>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => {
                setActiveTab('pending');
                setExpandedRequestId(null);
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-150 flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending
              {pendingCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-brand-600 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                setExpandedRequestId(null);
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by employee, department, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-2 min-w-[180px]">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as LeaveType | 'All')}
              className="w-full py-2 pl-2 pr-8 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '16px'
              }}
            >
              {LEAVE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Leave Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="divide-y divide-slate-100">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400 mb-3">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No requests found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {searchQuery || selectedType !== 'All'
                ? "We couldn't find any leave requests matching your search criteria. Try adjusting your filters."
                : activeTab === 'pending'
                ? "Hooray! There are no pending leave requests to review right now."
                : "No historical leave requests found in the system."}
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => {
            const isExpanded = expandedRequestId === request.id;
            return (
              <div
                key={request.id}
                className={`transition-colors duration-150 ${
                  isExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'
                }`}
              >
                {/* Main Row */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Employee Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={request.employeeAvatar}
                      alt={request.employeeName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          request.employeeName
                        )}&background=e0f2fe&color=0369a1`;
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {request.employeeName}
                        </h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                          {request.department}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Applied on {formatDate(request.appliedDate)}
                      </p>
                    </div>
                  </div>

                  {/* Leave Details Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-4 lg:gap-8 flex-1 lg:justify-end">
                    {/* Leave Type */}
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Type
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLeaveTypeColor(
                          request.type
                        )}`}
                      >
                        {request.type}
                      </span>
                    </div>

                    {/* Duration */}
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Duration
                      </span>
                      <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {request.days} {request.days === 1 ? 'day' : 'days'}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Period
                      </span>
                      <span className="text-xs text-slate-600 block">
                        {formatDate(request.startDate)} – {formatDate(request.endDate)}
                      </span>
                    </div>

                    {/* Status (History Tab only) */}
                    {activeTab === 'history' && (
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Status
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status === 'Approved' ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {request.status}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
                    <button
                      onClick={() => toggleExpand(request.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="View Details"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {request.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleActionClick(request.id, request.employeeName, 'reject')}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                          title="Reject Request"
                          aria-label="Reject request"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleActionClick(request.id, request.employeeName, 'approve')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                          title="Approve Request"
                          aria-label="Approve request"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                            <FileText className="h-3.5 w-3.5" />
                            Reason for Leave
                          </span>
                          <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 text-xs leading-relaxed">
                            {request.reason || 'No reason provided.'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5" />
                            Request Summary
                          </span>
                          <div className="text-xs space-y-1.5 text-slate-600">
                            <div className="flex justify-between">
                              <span>Employee ID:</span>
                              <span className="font-medium text-slate-900">{request.employeeId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Days:</span>
                              <span className="font-medium text-slate-900">{request.days} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <span className="font-medium text-slate-900">{request.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full shrink-0 ${
                    confirmModal.type === 'approve'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {confirmModal.type === 'approve' ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {confirmModal.type === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Are you sure you want to {confirmModal.type} the leave request for{' '}
                    <span className="font-semibold text-slate-800">{confirmModal.employeeName}</span>? This action
                    will update the employee's status and notify them immediately.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  confirmModal.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'
                }`}
              >
                Confirm {confirmModal.type === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}