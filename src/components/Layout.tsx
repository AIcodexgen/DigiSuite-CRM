import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const Layout = () => {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300",
        sidebarCollapsed ? "pl-[80px]" : "pl-[220px]"
      )}>
        <Topbar />
        <main className="flex-1 p-8 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
