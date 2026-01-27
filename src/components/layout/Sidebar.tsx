import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Shield,
  Calculator
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Applicants', path: '/applicants', icon: Users },
  { label: 'Live Assessment', path: '/credit-scoring', icon: Calculator },
  { label: 'Asset Management', path: '/asset-management', icon: TrendingUp },
  { label: 'Admin', path: '/admin/asset-management', icon: Shield },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-sidebar-border">
        {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-accent">
          <Shield className="h-5 w-5 text-sidebar-primary" />
        </div> */}
        {!collapsed && (
          <div className="flex flex-col">
            <img
              src="/logo.png"
              alt="Sycamore logo"
              className="h-9 w-auto object-contain"
            />

          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/applicants' && location.pathname.startsWith('/applicant'));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-colors",
                isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-primary"
              )} />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Stats Preview */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-risk-low" />
              <span className="text-xs font-medium text-sidebar-foreground/80">Risk Overview</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-risk-low/20 rounded px-2 py-1 text-center">
                <span className="text-xs font-semibold text-risk-low">Low</span>
              </div>
              <div className="flex-1 bg-risk-medium/20 rounded px-2 py-1 text-center">
                <span className="text-xs font-semibold text-risk-medium">Med</span>
              </div>
              <div className="flex-1 bg-risk-high/20 rounded px-2 py-1 text-center">
                <span className="text-xs font-semibold text-risk-high">High</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-primary hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};
