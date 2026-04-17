import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  ArrowUpRight,
  Plus,
  Check,
  ArrowLeft,
  X
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
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const Billing = () => {
  const navigate = useNavigate();
  const { invoices, clients, quotes, addInvoice, payInvoice } = useApp();
  const [isAdding, setIsAdding] = React.useState(false);
  const [newInvoice, setNewInvoice] = React.useState({
    clientId: '',
    amount: 0,
    status: 'Unpaid' as const,
    dueDate: new Date().toISOString().split('T')[0],
    quoteId: '',
  });

  const handleSave = () => {
    if (!newInvoice.clientId || newInvoice.amount <= 0) return;
    addInvoice(newInvoice);
    setIsAdding(false);
  };

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const outstandingRevenue = invoices.filter(i => i.status === 'Unpaid' || i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;

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
            <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
            <p className="text-muted-foreground mt-1">Manage invoices, payments, and financial records.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Invoice
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
          <h3 className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}.00</h3>
          <div className="flex items-center text-xs text-green-600 mt-2">
            <ArrowUpRight className="w-3 h-3 mr-1" /> +12% from last month
          </div>
        </div>
        <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
          <h3 className="text-2xl font-bold mt-1">${outstandingRevenue.toLocaleString()}.00</h3>
          <div className="flex items-center text-xs text-red-600 mt-2">
            <ArrowUpRight className="w-3 h-3 mr-1" /> {overdueCount} invoices overdue
          </div>
        </div>
        <div className="p-6 rounded-xl bg-white border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Pending Quotes</p>
          <h3 className="text-2xl font-bold mt-1">${quotes.filter(q => q.status === 'Sent' || q.status === 'Viewed').reduce((acc, curr) => acc + curr.monthlyFee, 0).toLocaleString()}.00</h3>
          <div className="flex items-center text-xs text-blue-600 mt-2">
            <ArrowUpRight className="w-3 h-3 mr-1" /> {quotes.filter(q => q.status === 'Sent' || q.status === 'Viewed').length} quotes active
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="pl-10" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30">
              <TableHead className="font-semibold">Invoice ID</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              const client = clients.find(c => c.id === invoice.clientId);
              return (
                <TableRow key={invoice.id} className="hover:bg-secondary/20">
                  <TableCell className="font-mono text-xs font-medium">{invoice.id}</TableCell>
                  <TableCell>
                    <span className="font-medium">{client?.company}</span>
                  </TableCell>
                  <TableCell className="font-semibold">${invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === 'Paid' ? 'default' : 'destructive'} className={cn(
                      invoice.status === 'Paid' ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100" : ""
                    )}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {invoice.status !== 'Paid' && (
                          <DropdownMenuItem onClick={() => payInvoice(invoice.id)}>
                            <Check className="w-4 h-4 mr-2" /> Mark as Paid
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" /> Download PDF
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

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select 
                value={newInvoice.clientId} 
                onValueChange={(v) => setNewInvoice({ ...newInvoice, clientId: v })}
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
              <Label>Amount ($)</Label>
              <Input 
                type="number" 
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input 
                type="date" 
                value={newInvoice.dueDate}
                onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleSave}>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
