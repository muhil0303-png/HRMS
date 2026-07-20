'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronDown,
  Briefcase,
  HelpCircle,
  Shield,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  className?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export default function Header({ className }: HeaderProps): React.JSX.Element {
  const [isProfileOpen, setIsProfileOpen] = React.useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState<boolean>(false);

  const profileRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  // Mock notifications
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: '1',
      title: 'New Application',
      description: 'Marcus Vance applied for Senior React Developer.',
      time: '10m ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Leave Request',
      description: 'Elena Rostova requested 3 days of annual leave.',
      time: '2h ago',
      unread: true,
    },
    {
      id: '3',
      title: 'System Update',
      description: 'HRMS platform updated to v2.4.0 successfully.',
      time: '1d ago',
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = (): void => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo & Desktop Navigation */}
        <div className="flex items-center gap-8">
          <a href="/dashboard" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground hidden sm:inline-block">
              HRMS<span className="text-primary">.pro</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/dashboard"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Directory
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Recruitment
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Payroll
            </a>
          </nav>
        </div>

        {/* Right: Search, Notifications, Profile, Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Search Bar - Desktop */}
          <div className="relative hidden lg:block w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employees, files..."
              className="pl-9 h-9 w-full bg-muted/50 focus-visible:bg-background"
            />
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="Toggle notifications"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-[10px] font-bold"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg border border-border bg-card p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'flex flex-col gap-1 rounded-md p-3 text-left transition-colors hover:bg-muted/50',
                          notification.unread && 'bg-primary/5'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            {notification.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {notification.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 py-1.5 h-9 rounded-full hover:bg-muted"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                SJ
              </div>
              <span className="text-sm font-medium text-foreground hidden md:inline-block">
                Sarah Jenkins
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:inline-block" />
            </Button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-border bg-card p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">Sarah Jenkins</p>
                  <p className="text-xs text-muted-foreground truncate">sarah.j@enterprise.com</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <Shield className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-medium text-primary uppercase tracking-wider">
                      HR Director
                    </span>
                  </div>
                </div>
                <div className="py-1">
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Help & Support
                  </a>
                </div>
                <div className="border-t border-border pt-1 mt-1">
                  <button
                    onClick={() => alert('Logging out...')}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-in slide-in-from-top-5 duration-200">
          <div className="relative w-full mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 h-9 w-full bg-muted/50"
            />
          </div>
          <nav className="flex flex-col gap-2">
            <a
              href="/dashboard"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-primary/10 text-primary"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Directory
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Recruitment
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Payroll
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}