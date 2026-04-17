import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LifeBuoy, 
  Send, 
  FileText, 
  ArrowLeft, 
  X, 
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
import { cn } from '../lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export const Support = () => {
  const navigate = useNavigate();
  const { tickets, clients, addTicket, updateTicketStatus } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTicket, setNewTicket] = useState({
    clientId: '',
    subject: '',
    description: '',
    priority: 'Medium' as const,
    category: 'Technical' as const,
    status: 'Open' as const,
  });

  const handleSave = () => {
    if (!newTicket.clientId || !newTicket.subject) return;
    addTicket(newTicket);
    setIsAdding(false);
    setNewTicket({
      clientId: '',
      subject: '',
      description: '',
      priority: 'Medium',
      category: 'Technical',
      status: 'Open',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Open</Badge>;
      case 'In Progress': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">In Progress</Badge>;
      case 'Resolved': return <Badge className="bg-green-100 text-green-700 border-green-200">Resolved</Badge>;
      case 'Closed': return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Closed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'High': return <Badge className="bg-orange-100 text-orange-700 border-orange-200">High</Badge>;
      case 'Medium': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Medium</Badge>;
      case 'Low': return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Low</Badge>;
      default: return <Badge>{priority}</Badge>;
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
            <p className="text-muted-foreground mt-1">Get help with your agency fulfillment and platform features.</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm hover:ring-1 hover:ring-primary/20 transition-all">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
              <LifeBuoy className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Knowledge Base</h3>
              <p className="text-sm text-muted-foreground mt-1">Browse articles on SEO, SMM, and agency scaling.</p>
            </div>
            <Button variant="outline" className="w-full bg-slate-50 border-slate-200 hover:bg-slate-100">
              Browse Articles
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:ring-1 hover:ring-primary/20 transition-all">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Live Chat</h3>
              <p className="text-sm text-muted-foreground mt-1">Chat with our fulfillment experts in real-time.</p>
            </div>
            <Button variant="outline" className="w-full bg-slate-50 border-slate-200 hover:bg-slate-100">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:ring-1 hover:ring-primary/20 transition-all">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Submit Ticket</h3>
              <p className="text-sm text-muted-foreground mt-1">Open a technical or billing support ticket.</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full bg-slate-50 border-slate-200 hover:bg-slate-100"
              onClick={() => setIsAdding(true)}
            >
              Open Ticket
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Ticket Management</h2>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search tickets..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-slate-100/50 p-1">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {filteredTickets.map((ticket) => {
                const client = clients.find(c => c.id === ticket.clientId);
                return (
                  <Card key={ticket.id} className="border-none shadow-sm hover:ring-1 hover:ring-primary/10 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                            <h4 className="font-bold text-lg">{ticket.subject}</h4>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Opened on {new Date(ticket.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-[10px] font-normal">{ticket.category}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              Priority: {getPriorityBadge(ticket.priority)}
                            </div>
                            <div className="font-medium text-slate-900">
                              Client: {client?.company || 'Unknown'}
                            </div>
                            {ticket.resolvedAt && (
                              <div className="flex items-center gap-1 text-green-600 font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                Resolved on {new Date(ticket.resolvedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateTicketStatus(ticket.id, 'Resolved')}
                            >
                              Mark Resolved
                            </Button>
                          )}
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredTickets.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No tickets found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="open" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {filteredTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').map((ticket) => {
                const client = clients.find(c => c.id === ticket.clientId);
                return (
                  <Card key={ticket.id} className="border-none shadow-sm">
                    <CardContent className="p-6">
                      {/* Same card content as above, could be extracted to a sub-component */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                            <h4 className="font-bold text-lg">{ticket.subject}</h4>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{ticket.description}</p>
                          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Opened on {new Date(ticket.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              Priority: {getPriorityBadge(ticket.priority)}
                            </div>
                            <div className="font-medium text-slate-900">
                              Client: {client?.company}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateTicketStatus(ticket.id, 'Resolved')}
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {filteredTickets.filter(t => t.status === 'Resolved').map((ticket) => {
                const client = clients.find(c => c.id === ticket.clientId);
                return (
                  <Card key={ticket.id} className="border-none shadow-sm opacity-80">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                            <h4 className="font-bold text-lg">{ticket.subject}</h4>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{ticket.description}</p>
                          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Opened on {new Date(ticket.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Resolved on {new Date(ticket.resolvedAt!).toLocaleDateString()}
                            </div>
                            <div className="font-medium text-slate-900">
                              Client: {client?.company}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit Support Ticket</DialogTitle>
            <DialogDescription>
              Describe the issue you're experiencing and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select 
                  value={newTicket.clientId} 
                  onValueChange={(v) => setNewTicket({ ...newTicket, clientId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={newTicket.category} 
                  onValueChange={(v: any) => setNewTicket({ ...newTicket, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select 
                value={newTicket.priority} 
                onValueChange={(v: any) => setNewTicket({ ...newTicket, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input 
                placeholder="Brief summary of the issue" 
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea 
                className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Provide more details about your request..."
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleSave}>Submit Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
