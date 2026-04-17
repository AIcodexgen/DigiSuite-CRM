import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  ArrowLeft,
  X,
  Play
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Button, buttonVariants } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from './ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from './ui/dialog';
import { Label } from './ui/label';
import { useApp } from '../context/AppContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '../lib/utils';

export const ClientList = () => {
  const navigate = useNavigate();
  const { clients, addClient, plans, invoices } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAdding = searchParams.get('add') === 'true';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    notes: '',
    status: 'Quote' as const,
  });

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && c.status === 'Active';
    if (activeTab === 'onboarding') return matchesSearch && c.status === 'Onboarding';
    return matchesSearch;
  });

  const onboardingCount = clients.filter(c => c.status === 'Onboarding').length;

  const handleSave = () => {
    addClient(newClient);
    setSearchParams({});
    setNewClient({
      name: '',
      company: '',
      email: '',
      phone: '',
      website: '',
      notes: '',
      status: 'Quote',
    });
  };

  return (
    <div className="space-y-6">
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
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground mt-1">Manage your agency's client relationships.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setSearchParams({ add: 'true' })}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
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

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white border rounded-lg p-1 h-10 flex items-center">
          <TabsList className="bg-transparent h-8 border-none gap-2">
            <TabsTrigger value="all" className="text-xs font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md h-7">All</TabsTrigger>
            <TabsTrigger value="active" className="text-xs font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md h-7">Active</TabsTrigger>
            <TabsTrigger value="onboarding" className="text-xs font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md h-7">
               Onboarding
               {onboardingCount > 0 && (
                 <span className="ml-1.5 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{onboardingCount}</span>
               )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-none">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12">Name</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12">Company</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12">Status</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12">Plans</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12">Billing</TableHead>
              <TableHead className="text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => {
              const clientPlans = plans.filter(p => p.clientId === client.id);
              const unpaidInvoices = invoices.filter(i => i.clientId === client.id && i.status !== 'Paid');
              
              return (
                <TableRow key={client.id} className="hover:bg-secondary/20 border-b border-border">
                  <TableCell className="py-4">
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#e2e8f0] rounded-full flex items-center justify-center text-xs font-bold text-[#64748b]">
                          {client.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-[#1e293b]">{client.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/clients/${client.id}`}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-primary hover:underline bg-slate-50 px-2 py-1 rounded shrink-0"
                        >
                          <Eye className="w-3 h-3" />
                          Profile
                        </Link>
                        {client.status === 'Onboarding' && (
                          <Link 
                            to={`/onboarding?resume=${client.id}`}
                            className="flex items-center gap-1 text-[10px] font-black italic text-primary hover:bg-primary hover:text-white bg-primary/10 px-2.5 py-1.5 rounded-full shrink-0 animate-pulse shadow-sm shadow-primary/20"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            RESUME
                          </Link>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{client.company}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border-none",
                      client.status === 'Active' ? "bg-[#d1fae5] text-[#065f46]" : 
                      client.status === 'Onboarding' ? "bg-primary/10 text-primary animate-pulse" :
                      client.status === 'Quote' ? "bg-[#fef3c7] text-[#92400e]" : "bg-slate-100 text-slate-500"
                    )}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {clientPlans.length > 0 ? clientPlans.map(p => (
                        <Badge key={p.id} variant="outline" className="text-[10px] px-1.5 py-0 border-border bg-white text-muted-foreground">
                          {p.serviceType}
                        </Badge>
                      )) : <span className="text-xs text-muted-foreground">None</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {unpaidInvoices.length > 0 ? (
                      <Badge className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border-none bg-red-50 text-red-700">
                        Pending
                      </Badge>
                    ) : (
                      <Badge className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border-none bg-green-50 text-green-700">
                        Paid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                          <Eye className="w-4 h-4 mr-2" /> View Profile
                        </DropdownMenuItem>
                        {client.status === 'Onboarding' && (
                          <DropdownMenuItem onClick={() => navigate(`/onboarding?resume=${client.id}`)} className="text-primary font-bold">
                             <Play className="w-4 h-4 mr-2 fill-current" /> Resume Onboarding
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAdding} onOpenChange={(open) => !open && setSearchParams({})}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  placeholder="ABC Inc" 
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="+1 (555) 000-0000" 
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  placeholder="https://example.com" 
                  value={newClient.website}
                  onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input 
                id="notes" 
                placeholder="Additional information..." 
                value={newClient.notes}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSearchParams({})}>Cancel</Button>
            <Button onClick={handleSave}>Save Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
