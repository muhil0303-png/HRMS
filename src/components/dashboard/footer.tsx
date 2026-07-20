'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * Reusable, enterprise-grade Footer component for the HRMS Dashboard.
 * Displays copyright information, system status, current UTC time, and helpful links.
 */
export function Footer({ className, ...props }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [systemTime, setSystemTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: HH:MM:SS UTC
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setSystemTime(`${hours}:${minutes}:${seconds} UTC`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      className={cn(
        'w-full border-t border-border bg-card text-card-foreground py-6 px-4 md:px-8 transition-colors duration-200',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        {/* Left Section: Copyright & Version */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-semibold text-foreground tracking-tight">
            HRMS Portal
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span>&copy; {currentYear} Enterprise Inc. All rights reserved.</span>
          <span className="hidden sm:inline text-border">|</span>
          <Badge variant="outline" className="text-[10px] font-mono py-0 px-1.5 h-5 bg-background">
            v1.4.2-stable
          </Badge>
        </div>

        {/* Middle Section: System Status */}
        <div className="flex items-center gap-3 bg-background/80 border border-border/80 px-3.5 py-1.5 rounded-full shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            All Systems Operational
          </span>
          {systemTime && (
            <>
              <span className="text-border">|</span>
              <span className="font-mono text-[10px] tracking-wider text-muted-foreground/80">
                {systemTime}
              </span>
            </>
          )}
        </div>

        {/* Right Section: Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-medium">
          <a
            href="#privacy"
            className="hover:text-foreground transition-colors duration-150"
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            className="hover:text-foreground transition-colors duration-150"
            aria-label="Terms of Service"
          >
            Terms of Service
          </a>
          <a
            href="#support"
            className="hover:text-foreground transition-colors duration-150"
            aria-label="Contact Support"
          >
            Support Center
          </a>
          <a
            href="#docs"
            className="hover:text-foreground transition-colors duration-150"
            aria-label="System Documentation"
          >
            Documentation
          </a>
        </div>
      </div>
    </footer>
  );
}