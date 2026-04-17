import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Send,
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
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const QuotesList = () => {
  const navigate = useNavigate();
  const { quotes, clients } = useApp();

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
            <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
            <p className="text-muted-foreground mt-1">Manage and track all service proposals.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/quotes/new" className={cn(buttonVariants(), "flex items-center")}>
            <FileText className="w-4 h-4 mr-2" /> Create Quote
          </Link>
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
          <Input placeholder="Search quotes..." className="pl-10" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30">
              <TableHead className="font-semibold">Quote ID</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Service</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => {
              const client = clients.find(c => c.id === quote.clientId);
              return (
                <TableRow key={quote.id} className="hover:bg-secondary/20">
                  <TableCell className="font-mono text-xs font-medium">{quote.id}</TableCell>
                  <TableCell>
                    <span className="font-medium">{client?.company}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {quote.items.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 h-5 bg-slate-100 text-slate-700 font-bold border-none">
                          {item.serviceType} {item.package}
                        </Badge>
                      ))}
                      {quote.items.length === 0 && <span className="text-xs text-muted-foreground italic">No items</span>}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">${quote.monthlyFee}/mo</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      quote.status === 'Paid' ? "bg-green-50 text-green-700 border-green-100" :
                      quote.status === 'Sent' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                      "bg-blue-50 text-blue-700 border-blue-200"
                    )}>
                      {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/quote/${quote.id}`} 
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "flex items-center justify-center")}
                        title="View Quote Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Button variant="ghost" size="icon" title="Resend Quote">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
