import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  BarChart3, 
  Briefcase,
  Zap,
  Layers,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Zap, label: 'Client Onboarding', path: '/onboarding' },
  { icon: Users, label: 'Clients', path: '/clients' },
  { icon: Briefcase, label: 'Projects', path: '/projects' },
  { icon: FileText, label: 'Quotes', path: '/quotes' },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Users, label: 'Team', path: '/team' },
];

const bottomItems = [
  { icon: HelpCircle, label: 'Support', path: '/support' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useApp();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-[#0f172a] border-r border-[#1e293b] flex flex-col z-50 transition-all duration-300",
      collapsed ? "w-[80px]" : "w-[220px]"
    )}>
      <div className="p-6 pb-8 flex items-center justify-between">
        {!collapsed && <span className="font-extrabold text-xl tracking-tighter text-white">DIGISUITE</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#94a3b8] hover:text-white hover:bg-white/5 h-8 w-8"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-0 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : ''}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all border-l-[3px] border-transparent",
              isActive 
                ? "bg-white/5 text-white border-l-[#2563eb]" 
                : "text-[#94a3b8] hover:bg-white/5 hover:text-white",
              collapsed && "px-0 justify-center border-l-0"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="py-4 border-t border-[#1e293b] space-y-0">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : ''}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all border-l-[3px] border-transparent",
              isActive 
                ? "bg-white/5 text-white border-l-[#2563eb]" 
                : "text-[#94a3b8] hover:bg-white/5 hover:text-white",
              collapsed && "px-0 justify-center border-l-0"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
