import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Building2,
  Settings,
  LogOut
} from 'lucide-react';

export type TabType = 'dashboard' | 'employees' | 'leaves';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  pendingLeavesCount?: number;
}

interface SidebarContentProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isCollapsed: boolean;
  pendingLeavesCount?: number;
  onCloseMobile?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  pendingLeavesCount = 0,
  onCloseMobile,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'leaves', label: 'Leave Requests', icon: CalendarDays, badge: pendingLeavesCount },
  ];

  return (
    <div className="flex flex-col h-full bg-sidebar-background text-sidebar-text">
      {/* Header */}
      <div className={`flex items-center h-16 px-4 border-b border-slate-700/50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500 text-white shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-lg leading-none tracking-tight text-white truncate">TalentFlow</span>
              <span className="text-xs text-sidebar-muted font-medium mt-0.5">HRMS Portal</span>
            </div>
          )}
        </div>
        
        {/* Mobile close button */}
        {onCloseMobile && (
          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-sidebar-muted hover:text-white hover:bg-sidebar-hover focus-ring lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto sidebar-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative focus-ring ${
                isActive 
                  ? 'bg-sidebar-active text-white shadow-inner border-l-4 border-brand-500 pl-2' 
                  : 'text-sidebar-muted hover:text-white hover:bg-sidebar-hover'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-brand-400' : 'group-hover:text-white'}`} />
              
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-bold rounded-full shrink-0 ${
                  isActive 
                    ? 'bg-brand-500 text-white' 
                    : 'bg-rose-500 text-white'
                } ${isCollapsed ? 'absolute top-1 right-1' : ''}`}>
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 shadow-md">
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && ` (${item.badge})`}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Admin Avatar" 
            className="w-9 h-9 rounded-full border border-slate-700 object-cover shrink-0"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Alex Morgan</p>
              <p className="text-xs text-sidebar-muted truncate">HR Director</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-sidebar-muted">
            <button 
              className="p-1.5 rounded-md hover:text-white hover:bg-sidebar-hover focus-ring"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              className="p-1.5 rounded-md hover:text-rose-400 hover:bg-sidebar-hover focus-ring"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
  pendingLeavesCount = 0,
}) => {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-background shadow-2xl lg:hidden transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={false}
          pendingLeavesCount={pendingLeavesCount}
          onCloseMobile={() => setIsOpen(false)}
        />
      </div>

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 border-r border-slate-800 bg-sidebar-background transition-all duration-300 relative ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isCollapsed}
          pendingLeavesCount={pendingLeavesCount}
        />

        {/* Collapse Toggle Button (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-20 -right-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full p-1 shadow-md border border-slate-700 z-40 hidden lg:flex items-center justify-center focus-ring transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>
    </>
  );
};