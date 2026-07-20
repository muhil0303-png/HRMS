import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  ExternalLink, 
  Shield, 
  LifeBuoy, 
  FileText, 
  Globe 
} from 'lucide-react';

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  systemVersion?: string;
  lastSyncTime?: Date;
}

/**
 * Enterprise-grade HRMS Footer component.
 * Contains copyright information, quick links, system status indicator, and support contacts.
 */
export function Footer({ 
  className, 
  systemVersion = 'v2.4.0-stable', 
  lastSyncTime = new Date(),
  ...props 
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Format sync time safely
  const formattedSyncTime = React.useMemo(() => {
    try {
      return lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return 'Just now';
    }
  }, [lastSyncTime]);

  return (
    <footer
      className={cn(
        'w-full border-t border-border bg-card text-card-foreground transition-colors duration-200',
        className
      )}
      aria-label="HRMS System Footer"
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          
          {/* Column 1: Brand & System Status */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                H
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                HRMS <span className="text-primary font-medium">Portal</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enterprise Workforce Management, Analytics, and Strategic HR Planning Suite. Secure, compliant, and optimized for global operations.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400">
                  All Systems Operational
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Platform Navigation
            </h4>
            <nav className="flex flex-col space-y-2" aria-label="Footer Navigation">
              <a 
                href="#dashboard" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Dashboard Overview
              </a>
              <a 
                href="#directory" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Employee Directory
              </a>
              <a 
                href="#recruitment" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Recruitment Pipeline
              </a>
              <a 
                href="#training" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Training & Development
              </a>
            </nav>
          </div>

          {/* Column 3: Support & Resources */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Support & Resources
            </h4>
            <ul className="flex flex-col space-y-2">
              <li>
                <a 
                  href="#help" 
                  className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  <LifeBuoy className="mr-1.5 h-3.5 w-3.5" />
                  Help Center & Knowledgebase
                </a>
              </li>
              <li>
                <a 
                  href="#api" 
                  className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  <Globe className="mr-1.5 h-3.5 w-3.5" />
                  Developer API Docs
                  <ExternalLink className="ml-1 h-2.5 w-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="#security" 
                  className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  <Shield className="mr-1.5 h-3.5 w-3.5" />
                  Security & Compliance
                </a>
              </li>
              <li>
                <a 
                  href="#terms" 
                  className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  Audit Logs & Policies
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & System Info */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              HR Helpdesk Contact
            </h4>
            <ul className="flex flex-col space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center">
                <Mail className="mr-2 h-3.5 w-3.5 text-primary" />
                <a 
                  href="mailto:hr-support@enterprise.com" 
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  hr-support@enterprise.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-3.5 w-3.5 text-primary" />
                <span>+1 (800) 555-0199 (Ext. 400)</span>
              </li>
              <li className="pt-2 border-t border-border/60 mt-2">
                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
                    Last Data Sync
                  </span>
                  <span className="font-mono text-xs text-foreground">
                    Today at {formattedSyncTime}
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Divider */}
        <div className="my-6 border-t border-border/60" />

        {/* Bottom Metadata & Legal Section */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          
          {/* Copyright & Version */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>
              &copy; {currentYear} Enterprise HRMS Solutions Inc. All rights reserved.
            </span>
            <span className="hidden sm:inline text-border/80">|</span>
            <div className="flex items-center space-x-1.5">
              <span>System Version:</span>
              <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0">
                {systemVersion}
              </Badge>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <a 
              href="#privacy" 
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Privacy Policy
            </a>
            <span className="text-border/80">|</span>
            <a 
              href="#terms-of-service" 
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Terms of Service
            </a>
            <span className="text-border/80">|</span>
            <a 
              href="#cookies" 
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Cookie Settings
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}