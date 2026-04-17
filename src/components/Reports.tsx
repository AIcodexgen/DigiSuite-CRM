import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Search, 
  Download, 
  Eye, 
  Calendar,
  Filter,
  Plus,
  ArrowLeft,
  X,
  Share2,
  TrendingUp,
  MousePointer2,
  Users as UsersIcon,
  Mail,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const analyticsData = [
  { name: 'Jan', traffic: 4000, conversions: 240 },
  { name: 'Feb', traffic: 3000, conversions: 198 },
  { name: 'Mar', traffic: 2000, conversions: 150 },
  { name: 'Apr', traffic: 2780, conversions: 190 },
  { name: 'May', traffic: 1890, conversions: 120 },
  { name: 'Jun', traffic: 2390, conversions: 170 },
];

export const Reports = () => {
  const navigate = useNavigate();
  const { reports, clients, addReport, shareReport } = useApp();
  const [isAdding, setIsAdding] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState<any>(null);
  const [shareEmail, setShareEmail] = React.useState('');
  
  const [newReport, setNewReport] = React.useState({
    clientId: '',
    serviceType: 'SEO' as const,
    date: new Date().toISOString().split('T')[0],
    url: '#',
  });

  const handleSave = () => {
    if (!newReport.clientId) return;
    addReport(newReport);
    setIsAdding(false);
  };

  const handleShare = (report: any) => {
    const client = clients.find(c => c.id === report.clientId);
    setSelectedReport(report);
    setShareEmail(client?.email || '');
    setIsSharing(true);
  };

  const confirmShare = () => {
    if (selectedReport && shareEmail) {
      shareReport(selectedReport.id, shareEmail);
      setIsSharing(false);
      setSelectedReport(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="shrink-0 h-9 w-9"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Deep dive into performance metrics and client deliverables.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" /> Generate Report
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Aggregate Traffic Growth</CardTitle>
                <CardDescription>Total organic traffic across all managed clients.</CardDescription>
              </div>
              <Badge className="bg-green-50 text-green-700 border-green-100">+24% vs Last Month</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="traffic" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTraffic)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">Total Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-black">1,088</h2>
                <span className="text-xs font-bold mb-1 opacity-80">+12.5%</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/4 rounded-full" />
              </div>
              <p className="text-[10px] mt-2 opacity-70 font-medium">75% of monthly target achieved</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                  <MousePointer2 className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg. CTR</p>
                <h4 className="text-lg font-bold">4.2%</h4>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
                  <UsersIcon className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">New Users</p>
                <h4 className="text-lg font-bold">12.4k</h4>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Deliverables</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search reports..." className="pl-10 h-9 text-xs" />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const client = clients.find(c => c.id === report.clientId);
            return (
              <Card key={report.id} className="border-none shadow-sm group hover:ring-1 hover:ring-primary/20 transition-all overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">{report.serviceType}</Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-1">Monthly Performance</h3>
                    <p className="text-sm text-muted-foreground mb-4">Client: {client?.company}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-6">
                      <Calendar className="w-3.5 h-3.5" /> {report.date}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 h-9 text-xs font-bold">
                        <Download className="w-3.5 h-3.5 mr-2" /> PDF
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 h-9 text-xs font-bold bg-slate-50 hover:bg-slate-100"
                        onClick={() => handleShare(report)}
                      >
                        <Share2 className="w-3.5 h-3.5 mr-2" /> Share
                      </Button>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-slate-100">
                    <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-500" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={isSharing} onOpenChange={setIsSharing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
            <DialogDescription>
              Send this report directly to the client's email address.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold">Monthly Performance Report</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  {selectedReport?.serviceType} • {selectedReport?.date}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  className="pl-10" 
                  placeholder="client@example.com" 
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message (Optional)</Label>
              <textarea 
                className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Hi, here is your performance report for this month..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSharing(false)}>Cancel</Button>
            <Button onClick={confirmShare} className="bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4 mr-2" /> Send to Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Report Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select 
                value={newReport.clientId} 
                onValueChange={(v) => setNewReport({ ...newReport, clientId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select 
                value={newReport.serviceType} 
                onValueChange={(v: any) => setNewReport({ ...newReport, serviceType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEO">SEO</SelectItem>
                  <SelectItem value="SMM">SMM</SelectItem>
                  <SelectItem value="Combo">Combo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Report Date</Label>
              <Input 
                type="date" 
                value={newReport.date}
                onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleSave}>Generate & Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
