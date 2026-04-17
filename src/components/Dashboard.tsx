import React from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Circle,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button, buttonVariants } from './ui/button';
import { Badge } from './ui/badge';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { clients, quotes, invoices, plans, tasks, reports, tickets, toggleTask } = useApp();

  const stats = [
    { 
      label: 'Total Clients', 
      value: clients.length, 
      icon: Users, 
      trend: '+12%', 
      trendUp: true,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: 'Active Plans', 
      value: plans.filter(p => p.status === 'Active').length, 
      icon: TrendingUp, 
      trend: '+5%', 
      trendUp: true,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      label: 'Support Alerts', 
      value: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length, 
      icon: AlertCircle, 
      trend: '0', 
      trendUp: false, 
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    { 
      label: 'Revenue', 
      value: `$${invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0)}`, 
      icon: TrendingUp, 
      trend: '+18%', 
      trendUp: true,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/clients?add=true" className={cn(buttonVariants({ variant: "outline" }), "flex items-center")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Link>
          <Link to="/quotes/new" className={cn(buttonVariants(), "flex items-center")}>
            <FileText className="w-4 h-4 mr-2" />
            Create Quote
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-border shadow-none rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <div className={cn(
                  "flex items-center text-xs font-semibold",
                  stat.trendUp ? "text-green-600" : "text-muted-foreground"
                )}>
                  {stat.trend}
                </div>
              </div>
              <h3 className={cn("text-2xl font-bold", stat.label === 'Alerts' && stat.value > 0 ? "text-red-500" : "text-[#1e293b]")}>
                {stat.value}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        <Card className="border border-border shadow-none rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-5 py-4 border-b border-border bg-white">
            <CardTitle className="text-[15px] font-bold">Recent Clients</CardTitle>
            <Link to="/clients" className={cn(buttonVariants({ variant: "link" }), "text-primary text-xs font-semibold p-0 h-auto")}>
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-[1fr_1fr_100px] px-5 py-3 bg-[#f8fafc] border-b border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Name</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Plan</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</span>
            </div>
            <div className="divide-y divide-border">
              {clients.slice(0, 5).map((client) => {
                const plan = plans.find(p => p.clientId === client.id);
                return (
                  <div key={client.id} className="grid grid-cols-[1fr_1fr_100px] items-center px-5 py-3 hover:bg-secondary/20 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-[#1e293b]">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.company}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan?.name || 'None'}
                    </div>
                    <div>
                      <Badge className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border-none",
                        client.status === 'Active' ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fef3c7] text-[#92400e]"
                      )}>
                        {client.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-none rounded-xl overflow-hidden">
          <CardHeader className="px-5 py-4 border-b border-border bg-white">
            <CardTitle className="text-[15px] font-bold">Pending Quotes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {quotes.filter(q => q.status === 'Sent' || q.status === 'Viewed').slice(0, 5).map((quote) => {
                const client = clients.find(c => c.id === quote.clientId);
                return (
                  <div key={quote.id} className="grid grid-cols-[1fr_80px_100px] items-center px-5 py-3 hover:bg-secondary/20 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-[#1e293b]">#{quote.id}</p>
                      <p className="text-xs text-muted-foreground">{quote.serviceType} Strategy</p>
                    </div>
                    <div className="text-sm font-bold text-right pr-4">
                      ${quote.monthlyFee}
                    </div>
                    <div className="text-right">
                      <Badge className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border-none",
                        quote.status === 'Sent' ? "bg-[#fef3c7] text-[#92400e]" : "bg-[#dbeafe] text-[#1e40af]"
                      )}>
                        {quote.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border shadow-none rounded-xl overflow-hidden">
          <CardHeader className="px-5 py-4 border-b border-border bg-white flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] font-bold">Recent Reports</CardTitle>
            <Link to="/reports" className={cn(buttonVariants({ variant: "link" }), "text-primary text-xs font-semibold p-0 h-auto")}>
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {reports.slice(0, 4).map((report) => {
                const client = clients.find(c => c.id === report.clientId);
                return (
                  <div key={report.id} className="flex items-center justify-between px-5 py-3 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded flex items-center justify-center text-white font-bold text-[10px]",
                        report.serviceType === 'SEO' ? "bg-blue-500" : "bg-purple-500"
                      )}>
                        {report.serviceType}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1e293b]">{client?.company}</p>
                        <p className="text-[10px] text-muted-foreground">{report.date}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-[10px] font-bold uppercase tracking-wider"
                      onClick={() => navigate('/reports')}
                    >
                      View
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-none rounded-xl overflow-hidden">
          <CardHeader className="px-5 py-4 border-b border-border bg-white">
            <CardTitle className="text-[15px] font-bold">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between px-5 py-4 hover:bg-secondary/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                        task.completed ? "bg-green-500 border-green-500 text-white" : "border-muted-foreground/30 hover:border-primary"
                      )}
                    >
                      {task.completed && <CheckCircle className="w-4 h-4" />}
                    </button>
                    <div>
                      <p className={cn(
                        "text-sm font-medium",
                        task.completed ? "text-muted-foreground line-through" : "text-[#1e293b]"
                      )}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8">
                    <Plus className="w-4 h-4 rotate-45" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="bg-[#eff6ff] border border-dashed border-[#2563eb] p-6 rounded-xl flex flex-col justify-center gap-4 text-[#2563eb]">
          <div className="w-12 h-12 rounded-full bg-[#2563eb]/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg">Agency Growth Insights</h4>
            <p className="text-sm mt-1 leading-relaxed">
              {quotes.filter(q => q.status === 'Accepted').length} quotes were accepted today. {reports.filter(r => r.date.startsWith('2026-04')).length} new reports have been generated this month.
            </p>
          </div>
          <Button 
            className="w-fit bg-[#2563eb] hover:bg-[#1d4ed8]"
            onClick={() => navigate('/reports')}
          >
            View Growth Report
          </Button>
        </div>
      </div>
    </div>
  );
};
