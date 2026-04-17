import React from 'react';
import { Bell, Search, User, ArrowLeft, ArrowUpRight, ArrowDownRight, Check, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button, buttonVariants } from './ui/button';
import { Input } from './ui/input';
import { cn } from '../lib/utils';

import { useApp } from '../context/AppContext';

export const Topbar = () => {
  const { currentUser, notifications, markNotificationAsRead } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <header className="h-[64px] border-b border-border bg-white sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        {!isDashboard && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="shrink-0 h-9 w-9"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients, projects..." 
            className="pl-10 bg-[#f8fafc] border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative p-2 rounded-full hover:bg-slate-100 transition-colors group">
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white"></span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
            <div className="p-4 border-b border-border bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-sm font-bold">Notifications</h3>
              <Badge variant="secondary" className="text-[10px] font-bold">
                {notifications.filter(n => !n.read).length} New
              </Badge>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={cn(
                        "p-4 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                        !n.read && "bg-blue-50/30"
                      )}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.link) navigate(n.link);
                      }}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          n.type === 'Success' ? "bg-green-100 text-green-600" :
                          n.type === 'Warning' ? "bg-yellow-100 text-yellow-600" :
                          n.type === 'Error' ? "bg-red-100 text-red-600" :
                          "bg-blue-100 text-blue-600"
                        )}>
                          {n.type === 'Success' ? <CheckCircle className="w-4 h-4" /> :
                           n.type === 'Warning' ? <AlertTriangle className="w-4 h-4" /> :
                           n.type === 'Error' ? <AlertTriangle className="w-4 h-4" /> :
                           <Info className="w-4 h-4" />}
                        </div>
                        <div className="space-y-1">
                          <p className={cn("text-xs font-bold leading-none", !n.read ? "text-slate-900" : "text-slate-600")}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-tight">
                            {n.message}
                          </p>
                          <p className="text-[9px] text-muted-foreground pt-1">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      {!n.read && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs">No notifications yet</p>
                </div>
              )}
            </div>
            <div className="p-2 border-t border-border bg-slate-50/50">
              <Button variant="ghost" className="w-full h-8 text-[11px] font-bold text-primary" onClick={() => navigate('/settings')}>
                Notification Settings
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-3 px-2 hover:bg-transparent")}>
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold leading-none text-[#1e293b]">{currentUser?.name || 'Guest'}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">{currentUser?.role || 'User'}</p>
            </div>
            <Avatar className="w-8 h-8 border border-border">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback>{currentUser?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings?tab=branding')}>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings?tab=billing')}>Billing & Subscription</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings?tab=team')}>Team Management</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
