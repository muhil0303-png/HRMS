import { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  X, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  RefreshCw,
  Shield
} from 'lucide-react';
import type { Activity, ActivityType } from '../types';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: Activity[];
  onClearNotifications?: () => void;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
  notifications,
  onClearNotifications
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'onboarding':
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case 'leave_approved':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'leave_rejected':
        return <XCircle className="h-4 w-4 text-rose-600" />;
      case 'leave_applied':
        return <Calendar className="h-4 w-4 text-amber-600" />;
      case 'status_change':
        return <RefreshCw className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-slate-600" />;
    }
  };

  const getActivityBg = (type: ActivityType) => {
    switch (type) {
      case 'onboarding':
        return 'bg-blue-50 border-blue-100';
      case 'leave_approved':
        return 'bg-emerald-50 border-emerald-100';
      case 'leave_rejected':
        return 'bg-rose-50 border-rose-100';
      case 'leave_applied':
        return 'bg-amber-50 border-amber-100';
      case 'status_change':
        return 'bg-purple-50 border-purple-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left Section: Toggle & Search */}
      <div className="flex flex-1 items-center gap-4">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-ring lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees by name, role, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-8 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Mobile Search Trigger (Visual placeholder or simple toggle could go here, but we keep it clean) */}
        <div className="sm:hidden">
          <button
            type="button"
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-ring"
            aria-label="Search"
            onClick={() => {
              const promptVal = prompt("Search employees:", searchQuery);
              if (promptVal !== null) setSearchQuery(promptVal);
            }}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-ring"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-dropdown focus:outline-none sm:w-96">
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                <h3 className="font-semibold text-slate-900 text-sm">Recent Activity</h3>
                {notifications.length > 0 && onClearNotifications && (
                  <button
                    type="button"
                    onClick={() => {
                      onClearNotifications();
                      setShowNotifications(false);
                    }}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto py-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <Bell className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-xs text-slate-500">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-slate-50"
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${getActivityBg(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed">
                          <span className="font-semibold text-slate-900">{activity.userName}</span>{' '}
                          {activity.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 focus-ring"
            aria-label="User menu"
          >
            <img
              className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Sarah Jenkins"
            />
            <div className="hidden text-left lg:block">
              <p className="text-xs font-semibold text-slate-900">Sarah Jenkins</p>
              <p className="text-[10px] text-slate-500">HR Director</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 lg:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-dropdown focus:outline-none">
              {/* User Info Header */}
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="truncate text-sm font-semibold text-slate-900">s.jenkins@enterprise.com</p>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded-md w-fit">
                  <Shield className="h-3 w-3" />
                  Super Admin
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    alert('Profile settings are managed by enterprise SSO.');
                    setShowProfile(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('System configuration is locked in demo mode.');
                    setShowProfile(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Account Settings
                </button>
              </div>

              {/* Sign Out */}
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to sign out?')) {
                      window.location.reload();
                    }
                    setShowProfile(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}