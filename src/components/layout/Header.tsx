import * as React from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  Settings, 
  Briefcase, 
  User, 
  ShieldAlert,
  CheckCircle2,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'info' | 'warning' | 'success';
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'New Application',
    description: 'Marcus Vance applied for Senior Frontend Engineer.',
    time: '5m ago',
    unread: true,
    type: 'info',
  },
  {
    id: '2',
    title: 'Compliance Alert',
    description: 'Annual harassment training completion is at 82%.',
    time: '2h ago',
    unread: true,
    type: 'warning',
  },
  {
    id: '3',
    title: 'Offboarding Complete',
    description: 'Exit interview completed for Jane Doe.',
    time: '1d ago',
    unread: false,
    type: 'success',
  },
];

const NAV_LINKS = [
  { label: 'Dashboard', href: '#', active: true },
  { label: 'Directory', href: '#', active: false },
  { label: 'Recruitment', href: '#', active: false },
  { label: 'Training', href: '#', active: false },
  { label: 'Payroll', href: '#', active: false },
];

/**
 * Professional reusable Header component for the HRMS Dashboard.
 * Features global navigation, search, notifications, and user profile dropdown.
 */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = React.useState('');

  const profileRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Left: Branding & Desktop Nav */}
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground hidden sm:block">
                TalentPulse<span className="text-primary">.</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5',
                    link.active ? 'text-foreground border-b-2 border-primary py-[18px] rounded-none' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search employees, documents, tasks..."
              className="pl-9 w-full bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Toggle for Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search">
              <Search className="h-5 w-5 text-muted-foreground" />
            </Button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                aria-label="View notifications"
                aria-haspopup="true"
                aria-expanded={isNotificationsOpen}
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold rounded-full border-2 border-background"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-border bg-card p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <span className="font-semibold text-sm text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNotificationClick(item.id)}
                          className={cn(
                            'w-full text-left flex gap-3 p-3 rounded-md transition-colors hover:bg-secondary/50 focus-visible:bg-secondary/50 focus-visible:outline-none',
                            item.unread && 'bg-primary/5'
                          )}
                        >
                          <div className="mt-0.5">
                            {item.type === 'warning' && <ShieldAlert className="h-5 w-5 text-hrms-amber" />}
                            {item.type === 'success' && <CheckCircle2 className="h-5 w-5 text-hrms-green" />}
                            {item.type === 'info' && <Info className="h-5 w-5 text-hrms-blue" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={cn('text-xs font-semibold text-foreground truncate', item.unread && 'font-bold')}>
                                {item.title}
                              </p>
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
              >
                <div className="h-8 w-8 rounded-full bg-hrms-indigo/10 text-hrms-indigo flex items-center justify-center font-semibold text-sm border border-hrms-indigo/20">
                  SJ
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-foreground leading-none">Sarah Jenkins</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">HR Director</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-foreground">Sarah Jenkins</p>
                    <p className="text-[10px] text-muted-foreground truncate">sarah.j@talentpulse.com</p>
                  </div>
                  <div className="py-1">
                    <a
                      href="#profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-foreground rounded-md hover:bg-secondary/80 transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      My Profile
                    </a>
                    <a
                      href="#settings"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-foreground rounded-md hover:bg-secondary/80 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Account Settings
                    </a>
                  </div>
                  <div className="border-t border-border pt-1 mt-1">
                    <button
                      onClick={() => alert('Logging out...')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive rounded-md hover:bg-destructive/10 transition-colors text-left"
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
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle main menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background px-4 py-3 space-y-3 shadow-inner">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 w-full bg-secondary/50 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  link.active 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}