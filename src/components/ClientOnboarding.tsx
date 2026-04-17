import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserPlus, 
  FileText, 
  Send, 
  CheckCircle2, 
  CreditCard, 
  Zap, 
  Briefcase, 
  Clock, 
  FilePieChart,
  ArrowRight,
  Loader2,
  ChevronRight,
  Building2,
  Mail,
  Check,
  AlertCircle,
  ShieldCheck,
  Layers,
  Search,
  Globe,
  Phone,
  Layout,
  DollarSign,
  Download,
  MessageSquare,
  FileDown,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { QuoteItem } from '../types';
import { cn } from '../lib/utils';
import { Separator } from './ui/separator';
import { PLAN_COSTS, SERVICES, PACKAGES } from '../constants';

const STEPS = [
  { id: 'client', title: 'Add Client', icon: UserPlus },
  { id: 'quote', title: 'Create Quote', icon: FileText },
  { id: 'send', title: 'Send Quote', icon: Send },
  { id: 'accept', title: 'Acceptance', icon: CheckCircle2 },
  { id: 'payment', title: 'Payment', icon: CreditCard },
  { id: 'activate', title: 'Activation', icon: Zap },
  { id: 'project', title: 'Project', icon: Briefcase },
  { id: 'approval', title: 'Approval', icon: Clock },
  { id: 'report', title: 'Reporting', icon: FilePieChart },
];

export const ClientOnboarding = () => {
  const navigate = useNavigate();
  const { 
    addClient, 
    addQuote, 
    updateQuoteStatus, 
    addProjectApproval,
    addReport,
    notifications,
    dismissNotification,
    plans,
    projects,
    quotes,
    clients,
    saveOnboardingProgress,
    updateClient
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const resumeId = searchParams.get('resume');

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [data, setData] = useState({
    client: { name: '', company: '', email: '', phone: '', website: '', notes: '' },
    quote: { 
      items: [] as QuoteItem[],
      sellingPrice: 0,
      setupFee: 0,
      monthlyFee: 0,
      contractTerm: 'Monthly' as 'Monthly' | '6mo' | '12mo',
      notes: '',
      autoActivate: true,
    },
    clientId: '',
    quoteId: '',
    planId: '',
    projectId: '',
    invoiceId: '',
  });

  // Load resumed data
  useEffect(() => {
    if (resumeId) {
      const client = clients.find(c => c.id === resumeId);
      if (client && client.onboardingData) {
        try {
          const onboardingData = typeof client.onboardingData === 'string' 
            ? JSON.parse(client.onboardingData) 
            : client.onboardingData;
          
          setData(prev => ({
            ...prev,
            ...onboardingData,
            clientId: client.id
          }));
          
          if (client.onboardingStep !== undefined) {
             setCurrentStepIndex(client.onboardingStep);
          }
        } catch (e) {
          console.error("Failed to parse onboarding data", e);
        }
      }
    }
  }, [resumeId, clients]);

  const totalDigisuiteCost = data.quote.items.reduce((sum, item) => sum + item.digisuiteCost, 0);

  const toggleItem = (service: typeof SERVICES[number], pkg: typeof PACKAGES[number]) => {
    const itemKey = `${service}-${pkg}`;
    const cost = PLAN_COSTS[itemKey] || 0;
    
    setData(prev => {
      const exists = prev.quote.items.find(i => i.serviceType === service && i.package === pkg);
      let newItems;
      if (exists) {
        newItems = prev.quote.items.filter(i => !(i.serviceType === service && i.package === pkg));
      } else {
        newItems = [...prev.quote.items, { serviceType: service, package: pkg, digisuiteCost: cost, sellingPrice: cost * 2 }];
      }
      
      const newTotalSelling = newItems.reduce((sum, item) => sum + item.sellingPrice, 0);
      
      return { 
        ...prev, 
        quote: {
          ...prev.quote,
          items: newItems,
          sellingPrice: newTotalSelling,
          monthlyFee: newTotalSelling
        }
      };
    });
  };

  const updateItemSellingPrice = (index: number, price: number) => {
    setData(prev => {
      const newItems = [...prev.quote.items];
      newItems[index] = { ...newItems[index], sellingPrice: price };
      const newTotalSelling = newItems.reduce((sum, item) => sum + item.sellingPrice, 0);
      return { 
        ...prev, 
        quote: {
          ...prev.quote,
          items: newItems,
          sellingPrice: newTotalSelling,
          monthlyFee: newTotalSelling
        }
      };
    });
  };

  const [showTracker, setShowTracker] = useState(true);

  const nextStep = () => {
    const nextIdx = Math.min(currentStepIndex + 1, STEPS.length - 1);
    setCurrentStepIndex(nextIdx);
    
    // Save progress if we have a client ID
    if (data.clientId) {
      saveOnboardingProgress(data.clientId, nextIdx, data);
    }
  };

  // Step 1: Add Client
  const handleAddClient = () => {
    setLoading(true);
    setTimeout(() => {
      let id = data.clientId;
      if (!id) {
        id = addClient({
          ...data.client,
          status: 'Onboarding'
        });
      } else {
        updateClient(id, {
          ...data.client,
          status: 'Onboarding'
        });
      }
      
      setData(prev => ({ ...prev, clientId: id }));
      saveOnboardingProgress(id, currentStepIndex + 1, { ...data, clientId: id });
      setLoading(false);
      nextStep();
    }, 800);
  };

  // Step 2: Create Quote
  const handleCreateQuote = () => {
    if (data.quote.items.length === 0) {
      alert('Please select at least one service');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const qId = addQuote({
        clientId: data.clientId,
        ...data.quote,
        status: 'Draft'
      });
      setData(prev => ({ ...prev, quoteId: qId }));
      setLoading(false);
      nextStep();
    }, 800);
  };

  // Step 3: Send Quote
  const handleSendQuote = () => {
    setLoading(true);
    setTimeout(() => {
      updateQuoteStatus(data.quoteId, 'Sent');
      setLoading(false);
      nextStep();
    }, 1200);
  };

  // Step 4: Customer Accepts
  const handleCustomerAccept = () => {
    setLoading(true);
    setTimeout(() => {
      updateQuoteStatus(data.quoteId, 'Accepted');
      setLoading(false);
      nextStep();
    }, 1000);
  };

  // Step 5: Customer Pays
  const handlePayment = () => {
    setLoading(true);
    setWorkflowError(null);
    
    // 10% chance of simulated failure for realism
    const shouldFail = Math.random() > 0.9;
    
    setTimeout(() => {
      if (shouldFail) {
        setWorkflowError("Payment failed: Insufficient funds or card declined. Please try again with a different payment method.");
        setLoading(false);
        return;
      }
      
      updateQuoteStatus(data.quoteId, 'Paid');
      setLoading(false);
      nextStep();
    }, 1500);
  };

  // Auto-fetch newly created plan/project IDs after payment
  useEffect(() => {
    if (currentStepIndex >= 5 && data.clientId) {
      const clientPlan = plans.find(p => p.clientId === data.clientId && p.serviceType === data.quote.serviceType);
      const clientProject = projects.find(p => p.clientId === data.clientId && p.serviceType === data.quote.serviceType);
      
      if (clientPlan || clientProject) {
        setData(prev => ({
          ...prev,
          planId: clientPlan?.id || prev.planId,
          projectId: clientProject?.id || prev.projectId
        }));
      }
    }
  }, [currentStepIndex, plans, projects, data.clientId, data.quote.serviceType]);

  // Step 8: Trigger Approval
  const handleApprovalSteps = () => {
    addProjectApproval({
      projectId: data.projectId || 'AUTO-GEN',
      clientId: data.clientId,
      title: `${data.quote.serviceType} Initial Strategy Review`,
      description: `Comprehensive strategy and roadmap for ${data.client.company}.`,
      status: 'Pending',
      type: 'Strategy',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    nextStep();
  };

  // Step 9: Delivery
  const handleDeliverySteps = () => {
    addReport({
      clientId: data.clientId,
      serviceType: data.quote.serviceType,
      date: new Date().toISOString().split('T')[0],
      url: '#'
    });
    nextStep();
  };

  const renderStep = () => {
    const step = STEPS[currentStepIndex];
    
    switch (step.id) {
      case 'client':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <UserPlus className="w-3 h-3" /> Contact Name
                </Label>
                <Input 
                  placeholder="e.g. John Doe" 
                  value={data.client.name}
                  onChange={(e) => setData({ ...data, client: { ...data.client, name: e.target.value }})}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building2 className="w-3 h-3" /> Company Name
                </Label>
                <Input 
                  placeholder="e.g. Acme Corp" 
                  value={data.client.company}
                  onChange={(e) => setData({ ...data, client: { ...data.client, company: e.target.value }})}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </Label>
                <Input 
                  type="email" 
                  placeholder="john@example.com" 
                  value={data.client.email}
                  onChange={(e) => setData({ ...data, client: { ...data.client, email: e.target.value }})}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Phone Number
                </Label>
                <Input 
                  placeholder="+1 (555) 000-0000" 
                  value={data.client.phone}
                  onChange={(e) => setData({ ...data, client: { ...data.client, phone: e.target.value }})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Company Website
                </Label>
                <Input 
                  placeholder="acme.com" 
                  value={data.client.website}
                  onChange={(e) => setData({ ...data, client: { ...data.client, website: e.target.value }})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Internal Notes
                </Label>
                <textarea 
                  className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Add any specific background information about this client..."
                  value={data.client.notes}
                  onChange={(e) => setData({ ...data, client: { ...data.client, notes: e.target.value }})}
                />
              </div>
            </div>
            <Button 
              className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20" 
              onClick={handleAddClient}
              disabled={!data.client.name || !data.client.company || loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ChevronRight className="w-5 h-5 mr-2" />}
              Create Real Client & Synchronize
            </Button>
          </motion.div>
        );

      case 'quote':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b pb-4">
                    <CardTitle className="text-lg">Service Selection</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    <div className="space-y-2">
                       <Label>Client</Label>
                       <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                          <span className="font-bold">{data.client.company || 'Selected Client'}</span>
                       </div>
                    </div>

                    <div className="space-y-6">
                      {SERVICES.map(service => (
                        <div key={service} className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Layers className="w-3 h-3 text-primary" /> {service} Packages
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {PACKAGES.map(pkg => {
                              const isSelected = data.quote.items.some(i => i.serviceType === service && i.package === pkg);
                              const cost = PLAN_COSTS[`${service}-${pkg}`];
                              
                              return (
                                <div 
                                  key={`${service}-${pkg}`}
                                  onClick={() => toggleItem(service, pkg)}
                                  className={cn(
                                    "relative p-4 rounded-xl border-2 transition-all cursor-pointer group",
                                    isSelected 
                                      ? "border-primary bg-primary/5 shadow-sm" 
                                      : "border-slate-100 hover:border-slate-200 bg-white"
                                  )}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className={cn(
                                      "font-bold text-sm",
                                      isSelected ? "text-primary" : "text-slate-900"
                                    )}>{pkg}</span>
                                    <div className={cn(
                                      "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                      isSelected ? "bg-primary border-primary" : "bg-white border-slate-300 group-hover:border-slate-400"
                                    )}>
                                      {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground mb-2 whitespace-nowrap">Internal Cost: ${cost}</p>
                                  <Badge variant="secondary" className="text-[8px] px-1 h-3.5 opacity-60">Plan: {service} {pkg}</Badge>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <Label>Contract Term</Label>
                        <Select 
                          value={data.quote.contractTerm} 
                          onValueChange={(v: any) => setData({ ...data, quote: { ...data.quote, contractTerm: v }})}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="6mo">6 Months</SelectItem>
                            <SelectItem value="12mo">12 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 flex flex-col justify-end pb-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="autoActivate" 
                            checked={data.quote.autoActivate}
                            onCheckedChange={(v: any) => setData({ ...data, quote: { ...data.quote, autoActivate: !!v }})}
                          />
                          <Label htmlFor="autoActivate" className="text-sm font-medium leading-none cursor-pointer">
                            Auto Activate After Payment
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Notes / Deliverables</Label>
                      <textarea 
                        className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="List specific deliverables or custom notes..."
                        value={data.quote.notes}
                        onChange={(e) => setData({ ...data, quote: { ...data.quote, notes: e.target.value }})}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b pb-4">
                    <CardTitle className="text-lg">Pricing Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          Digisuite Cost (Fixed Summary)
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                          <Input 
                            type="number" 
                            className="pl-10 bg-slate-50 cursor-not-allowed font-semibold" 
                            value={totalDigisuiteCost}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Total Selling Price /mo</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            className="pl-10 font-bold" 
                            value={data.quote.sellingPrice}
                            onChange={(e) => setData({ 
                              ...data, 
                              quote: { 
                                ...data.quote, 
                                sellingPrice: Number(e.target.value),
                                monthlyFee: Number(e.target.value)
                              } 
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>One-time Setup Fee</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            className="pl-10" 
                            value={data.quote.setupFee}
                            onChange={(e) => setData({ ...data, quote: { ...data.quote, setupFee: Number(e.target.value) }})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Maintenance Fee</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            className="pl-10" 
                            value={data.quote.monthlyFee}
                            onChange={(e) => setData({ ...data, quote: { ...data.quote, monthlyFee: Number(e.target.value) }})}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b py-4">
                    <CardTitle className="text-lg">Quote Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Selected Services</p>
                      {data.quote.items.length > 0 ? (
                        <div className="space-y-2">
                          {data.quote.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs items-center">
                              <span className="font-bold">{item.serviceType} {item.package}</span>
                              <span className="text-muted-foreground">${item.digisuiteCost}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No services selected</p>
                      )}
                      
                      <div className="flex justify-between text-xs pt-2">
                        <span className="text-muted-foreground font-medium">Term</span>
                        <span className="font-black italic text-primary">{data.quote.contractTerm}</span>
                      </div>
                    </div>
                    
                    <Separator className="bg-slate-100" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">Total Internal Cost</span>
                        <span className="">${totalDigisuiteCost}</span>
                      </div>
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">Setup Fee</span>
                        <span className="">${data.quote.setupFee}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-primary">
                        <span className="text-primary/70">Monthly Fee</span>
                        <span className="">${data.quote.monthlyFee}</span>
                      </div>
                    </div>
                    
                    <Separator className="bg-slate-100" />
                    
                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-xl border border-green-100">
                      <span className="font-black text-green-800 text-[10px] uppercase tracking-wider">Est. Monthly Profit</span>
                      <span className="text-green-700 font-black text-lg italic">${data.quote.sellingPrice - totalDigisuiteCost}</span>
                    </div>

                    <div className="pt-2 space-y-3">
                      <Button className="w-full font-black italic h-12 text-sm shadow-xl shadow-primary/20" onClick={handleCreateQuote} disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        SEND QUOTE
                      </Button>
                      <Button variant="outline" className="w-full h-12 font-bold text-xs opacity-60 hover:opacity-100">
                         SAVE AS DRAFT
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-primary/5 border border-primary/10 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs uppercase tracking-tight">Digisuite Fulfillment</h4>
                        <p className="text-[10px] font-bold text-muted-foreground">{data.quote.items.length} plans to activate</p>
                      </div>
                    </div>
                    <p className="text-[10px] leading-relaxed text-muted-foreground font-medium italic">
                      Costs are calculated based on registered DigiSuite service plans. These represent your internal agency procurement costs.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        );

      case 'send':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Quote Header Toolbar */}
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                     <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-black text-slate-800 tracking-tight">DigiSuite Agency</span>
               </div>
               <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold">
                     <Download className="w-3 h-3 mr-1.5" /> Download PDF
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 opacity-20 hover:opacity-100">
                     <X className="w-4 h-4" />
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Quote Content */}
              <div className="lg:col-span-2 space-y-6">
                 <Card className="border-none shadow-xl overflow-hidden rounded-2xl">
                    <div className="bg-primary p-8 text-white relative">
                       <div className="absolute top-0 right-0 p-8 opacity-10">
                          <Layout className="w-32 h-32 rotate-12" />
                       </div>
                       <div className="relative z-10 flex justify-between items-start">
                          <div className="space-y-2">
                             <h1 className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">
                                {data.quote.items.length > 0 ? `${data.quote.items[0].serviceType} ${data.quote.items[0].package}` : 'Digital Strategy'}
                             </h1>
                             <Badge className="bg-white/20 text-white font-bold border-none uppercase text-[10px]">
                                {data.quote.items.length > 0 ? `${data.quote.items[0].serviceType} ${data.quote.items[0].package}` : 'Active Plan'}
                             </Badge>
                             <p className="text-primary-foreground/80 font-medium text-sm mt-4">
                                Prepared for <span className="text-white font-bold">{data.client.company}</span>
                             </p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-60">QUOTE ID</p>
                             <h2 className="text-3xl font-black italic">#Q{Date.now().toString().slice(-4)}</h2>
                          </div>
                       </div>
                    </div>

                    <CardContent className="p-8 space-y-8 bg-white">
                       <div className="space-y-6">
                          <h3 className="font-black text-lg flex items-center gap-2 text-slate-900 italic">
                             <CheckCircle2 className="w-5 h-5 text-primary" /> INCLUDED DELIVERABLES
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                             {[
                                'Comprehensive Site Audit',
                                'Keyword Research & Strategy',
                                'On-Page Optimization',
                                'Monthly Performance Reports',
                                'Dedicated Account Manager',
                                'Technical SEO Fixes'
                             ].map(item => (
                                <div key={item} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                                   <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                   {item}
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h3 className="font-black text-base italic text-slate-900 tracking-tight">Terms & Conditions</h3>
                          <p className="text-[11px] text-muted-foreground leading-relaxed italic border-l-4 border-slate-100 pl-4 max-w-lg">
                             This proposal is valid for 14 days. Service will commence immediately upon payment of the setup fee and first month's subscription. 
                             The contract term is <span className="font-bold text-slate-700">{data.quote.contractTerm}</span> with automatic renewal.
                          </p>
                       </div>
                    </CardContent>
                 </Card>

                 {/* Secure Guarantee */}
                 <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center shrink-0">
                       <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                       <h4 className="font-black text-blue-900 text-xs italic">Secure Payment Guarantee</h4>
                       <p className="text-[10px] text-blue-700/70 font-medium leading-relaxed mt-0.5">
                          Your payment is processed securely via Stripe. We never store your credit card information. 
                          All fulfillment logic is handled asynchronously via DigiSuite agents.
                       </p>
                    </div>
                 </div>
              </div>

              {/* Sidebar Summary */}
              <div className="space-y-6">
                 <Card className="border-none shadow-lg overflow-hidden bg-white rounded-2xl">
                    <CardHeader className="pb-2 pt-6 px-6">
                       <CardTitle className="text-lg font-black tracking-tight italic">Investment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 space-y-6">
                       <div className="space-y-3">
                          <div className="flex justify-between text-xs font-medium">
                             <span className="text-slate-500">Subtotal</span>
                             <span className="font-black">${(data.quote.setupFee + data.quote.monthlyFee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-xs font-medium">
                             <span className="text-slate-500">Tax</span>
                             <span className="font-black">$0.00</span>
                          </div>
                          <div className="flex justify-between text-xs font-medium border-t border-slate-100 pt-3">
                             <span className="text-slate-900 font-bold">Total Due Today</span>
                             <span className="font-black text-primary">${(data.quote.setupFee + data.quote.monthlyFee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-xs font-medium">
                             <span className="text-slate-500 italic">Monthly Subscription</span>
                             <span className="font-black italic">${data.quote.monthlyFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-medium text-slate-400">
                             <span className="">Contract Term</span>
                             <span className="italic">{data.quote.contractTerm}</span>
                          </div>
                       </div>

                       <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Due Today</p>
                          <h3 className="text-5xl font-black italic text-primary tracking-tighter">${(data.quote.setupFee + data.quote.monthlyFee).toLocaleString(undefined, { minimumFractionDigits: 0 })}</h3>
                       </div>

                       <div className="space-y-4">
                          <Button className="w-full h-14 text-lg font-black italic bg-primary shadow-xl shadow-primary/20" onClick={handleSendQuote} disabled={loading}>
                             {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "DISPATCH QUOTE NOW"}
                          </Button>
                          <div className="text-center">
                             <button className="text-[10px] font-black uppercase text-red-500 hover:text-red-600 transition-colors tracking-widest">
                                Reject Protocol
                             </button>
                          </div>
                       </div>

                       <p className="text-[9px] text-center text-slate-400 font-medium px-4 leading-relaxed">
                          By clicking the button above, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
                       </p>
                    </CardContent>
                 </Card>

                 <Card className="border-none shadow-sm bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                    <CardContent className="p-6 text-center space-y-3">
                       <p className="text-[11px] font-bold text-slate-600">Need help with this quote?</p>
                       <Button variant="outline" className="w-full h-10 font-bold text-xs bg-white">
                          <MessageSquare className="w-4 h-4 mr-2 text-primary" /> Chat with Support
                       </Button>
                    </CardContent>
                 </Card>
              </div>
            </div>
          </motion.div>
        );

      case 'accept':
      case 'payment':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Quote Header Toolbar */}
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 h-full w-1.5 bg-orange-500" />
               <div className="flex items-center gap-3 pl-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                     <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-black text-slate-800 tracking-tight">DigiSuite Agency</span>
               </div>
               <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-none font-black italic tracking-widest px-3 text-[9px] h-7">
                    CLIENT PORTAL
                  </Badge>
                  <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold">
                     <Download className="w-3 h-3 mr-1.5" /> Download PDF
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Quote Content */}
              <div className="lg:col-span-2 space-y-6">
                 <Card className="border-none shadow-xl overflow-hidden rounded-2xl">
                    <div className="bg-primary p-8 text-white relative">
                       <div className="absolute top-0 right-0 p-8 opacity-10">
                          <Layout className="w-32 h-32 rotate-12" />
                       </div>
                       <div className="relative z-10 flex justify-between items-start">
                          <div className="space-y-2">
                             <h1 className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">
                                {data.quote.items.length > 0 ? `${data.quote.items[0].serviceType} ${data.quote.items[0].package}` : 'Digital Strategy Proposal'}
                             </h1>
                             <Badge className="bg-white/20 text-white font-bold border-none uppercase text-[10px]">
                                PROPOSAL #{data.quoteId.replace('Q', '')}
                             </Badge>
                             <p className="text-primary-foreground/80 font-medium text-sm mt-4">
                                Prepared for <span className="text-white font-bold">{data.client.company}</span>
                             </p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-60">Investment Required</p>
                             <h2 className="text-4xl font-black italic">${data.quote.monthlyFee}</h2>
                             <p className="text-[10px] font-bold opacity-60">PER MONTH</p>
                          </div>
                       </div>
                    </div>

                    <CardContent className="p-8 space-y-8 bg-white">
                       <div className="space-y-6">
                          <h3 className="font-black text-lg flex items-center gap-2 text-slate-900 italic font-sans uppercase tracking-tight">
                             <CheckCircle2 className="w-5 h-5 text-primary" /> Included Deliverables
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                             {[
                                'Comprehensive Site Audit',
                                'Keyword Research & Strategy',
                                'On-Page Optimization',
                                'Monthly Performance Reports',
                                'Dedicated Account Manager',
                                'Technical SEO Fixes'
                             ].map(item => (
                                <div key={item} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                                   <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                      <Check className="w-3 h-3 text-green-600" />
                                   </div>
                                   {item}
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h3 className="font-black text-base italic text-slate-900 tracking-tight">Terms & Conditions</h3>
                          <p className="text-[11px] text-muted-foreground leading-relaxed italic border-l-4 border-slate-100 pl-4 max-w-lg">
                             This proposal includes full DigiSuite fulfillment. Service will commence immediately upon payment of the setup fee and first month's subscription. 
                             Activation occurs instantly upon payment verification.
                          </p>
                       </div>
                    </CardContent>
                 </Card>

                 {/* Secure Guarantee */}
                 <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center shrink-0">
                       <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                       <h4 className="font-black text-blue-900 text-xs italic">Secure Payment Guarantee</h4>
                       <p className="text-[10px] text-blue-700/70 font-medium leading-relaxed mt-0.5">
                          Your payment is processed securely via Stripe. We never store your credit card information. 
                          All fulfillment logic is handled asynchronously via DigiSuite agents.
                       </p>
                    </div>
                 </div>
              </div>

              {/* Sidebar Summary */}
              <div className="space-y-6">
                 <Card className="border-none shadow-lg overflow-hidden bg-white rounded-2xl">
                    <CardHeader className="pb-2 pt-6 px-6">
                       <CardTitle className="text-lg font-black tracking-tight italic">Investment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 space-y-6">
                       <div className="space-y-3">
                          <div className="flex justify-between text-xs font-medium">
                             <span className="text-slate-500">Subtotal</span>
                             <span className="font-black">${(data.quote.setupFee + data.quote.monthlyFee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-xs font-medium">
                             <span className="text-slate-500">Tax</span>
                             <span className="font-black">$0.00</span>
                          </div>
                          <div className="flex justify-between text-xs font-medium border-t border-slate-100 pt-3">
                             <span className="text-slate-900 font-bold">Total Due Today</span>
                             <span className="font-black text-primary">${(data.quote.setupFee + data.quote.monthlyFee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-xs font-medium">
                             <span className="text-slate-500 italic text-primary">Monthly Subscription</span>
                             <span className="font-black italic text-primary">${data.quote.monthlyFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                       </div>

                       <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Due Today</p>
                          <h3 className="text-5xl font-black italic text-primary tracking-tighter">${(data.quote.setupFee + data.quote.monthlyFee).toLocaleString(undefined, { minimumFractionDigits: 0 })}</h3>
                       </div>

                       <div className="space-y-4">
                          {workflowError && (
                             <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs shadow-inner">
                               <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                               <p className="font-medium">{workflowError}</p>
                             </div>
                          )}

                          {step.id === 'accept' ? (
                             <Button className="w-full h-14 text-xl font-black italic bg-primary shadow-xl shadow-primary/20" onClick={handleCustomerAccept} disabled={loading}>
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Accept Proposal"}
                             </Button>
                          ) : (
                             <Button className="w-full h-14 text-xl font-black italic bg-green-600 hover:bg-green-700 shadow-xl shadow-green-100" onClick={handlePayment} disabled={loading}>
                                {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <CreditCard className="w-6 h-6 mr-2" />}
                                {workflowError ? "RETRY SECURE PAYMENT" : "Secure Payment"}
                             </Button>
                          )}
                          
                          <div className="text-center">
                             <button className="text-[10px] font-black uppercase text-red-500 hover:text-red-600 transition-colors tracking-widest opacity-60">
                                Reject Protocol
                             </button>
                          </div>
                       </div>

                       <p className="text-[9px] text-center text-slate-400 font-medium px-4 leading-relaxed">
                          By clicking the button above, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
                       </p>
                    </CardContent>
                 </Card>

                 <Card className="border-none shadow-sm bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                    <CardContent className="p-6 text-center space-y-3">
                       <p className="text-[11px] font-bold text-slate-600">Need help with this quote?</p>
                       <Button variant="outline" className="w-full h-10 font-bold text-xs bg-white">
                          <MessageSquare className="w-4 h-4 mr-2 text-primary" /> Chat with Support
                       </Button>
                    </CardContent>
                 </Card>
              </div>
            </div>
          </motion.div>
        );

      case 'activate':
      case 'project':
      case 'approval':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 md:space-y-12 text-center py-6 md:py-10"
          >
            <div className="relative w-24 h-24 md:w-40 md:h-40 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-2 md:inset-4 rounded-full border-2 border-primary/10 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                {step.id === 'activate' && <Zap className="w-10 h-10 md:w-16 md:h-16 text-primary animate-pulse" />}
                {step.id === 'project' && <Briefcase className="w-10 h-10 md:w-16 md:h-16 text-primary animate-pulse" />}
                {step.id === 'approval' && <Clock className="w-10 h-10 md:w-16 md:h-16 text-primary animate-pulse" />}
              </div>
            </div>

            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-ping" />
                <span className="text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] text-primary uppercase">Sync Protocol Engaged</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tighter">
                {step.id === 'activate' && "SYNCHRONIZING PLAN"}
                {step.id === 'project' && "ALLOCATING PROJECT"}
                {step.id === 'approval' && "TRIGGERING APPROVAL"}
              </h2>
              <div className="flex flex-col gap-2 max-w-sm md:max-w-md mx-auto">
                <p className="text-xs md:text-muted-foreground font-medium line-clamp-2 md:line-clamp-none">
                  {step.id === 'activate' && "Provisioning DigiSuite service agent and connecting to global fulfillment API."}
                  {step.id === 'project' && "Setting up project roadmap, assigning internal fulfillment lead, and creating workstreams."}
                  {step.id === 'approval' && "Drafting final service strategy and delivering roadmap to client for audit approval."}
                </p>
                <div className="font-mono text-[8px] md:text-[10px] text-slate-400 bg-slate-50 p-1.5 md:p-2 rounded-lg border">
                  {step.id === 'activate' && `PLAN_UID: ${data.planId || 'PENDING_ALLOCATION'}`}
                  {step.id === 'project' && `PROJECT_UID: ${data.projectId || 'PENDING_PROVISIONING'}`}
                  {step.id === 'approval' && `APPROVAL_PROTO: DERIVATIVE_STRATEGY_CHAIN`}
                </div>
              </div>
            </div>

            <div className="w-full max-w-xs md:max-w-md mx-auto bg-slate-100 h-2 md:h-3 rounded-full overflow-hidden shadow-inner p-0.5">
               <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
                onAnimationComplete={() => {
                  if (step.id === 'activate') setCurrentStepIndex(6);
                  if (step.id === 'project') setCurrentStepIndex(7);
                  if (step.id === 'approval') handleApprovalSteps();
                }}
               />
            </div>
          </motion.div>
        );

      case 'report':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 md:space-y-10 text-center py-4 md:py-8"
          >
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 animate-pulse" />
               <div className="relative inline-flex p-6 md:p-10 rounded-2xl md:rounded-[3rem] bg-green-50 text-green-600 mb-2 border border-green-100">
                <Check className="w-10 h-10 md:w-16 md:h-16" strokeWidth={3} />
               </div>
            </div>
            
            <div className="space-y-2 md:space-y-4">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter">SUCCESSFULLY SYNCED</h2>
              <p className="text-sm md:text-xl text-muted-foreground font-medium max-w-md md:max-w-lg mx-auto leading-relaxed">
                The onboarding journey for <strong>{data.client.company}</strong> is complete. 
                All systems, plans, and projects are now live in the global fulfillment ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
              <Card className="text-left bg-blue-50/50 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 p-4 md:p-6">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-[9px] md:text-xs font-black uppercase tracking-widest text-blue-800">Automated Report Sync</CardTitle>
                    <Badge className="bg-blue-600 text-[8px] md:text-[9px] h-3.5 md:h-4">DELIVERED</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 md:pt-2 p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-white rounded-lg md:rounded-xl shadow-sm border border-blue-100">
                      <FilePieChart className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-xs md:text-sm tracking-tight italic leading-tight">Initial Fulfillment Setup</p>
                      <p className="text-[9px] md:text-[11px] text-muted-foreground font-medium">Delivered to client via email system.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-left bg-slate-900 border-none shadow-xl">
                <CardHeader className="pb-2 p-4 md:p-6">
                    <CardTitle className="text-[9px] md:text-xs font-black uppercase tracking-widest text-primary italic">Live Fulfillment Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 md:pt-2 p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 text-white">
                    <div className="p-2 md:p-3 bg-white/10 rounded-lg md:rounded-xl">
                      <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary animate-pulse" />
                    </div>
                    <div>
                      <p className="font-bold text-xs md:text-sm italic leading-tight">Agent Activated</p>
                      <p className="text-[9px] md:text-[11px] text-slate-400 font-medium">Fulfillment tracking is now live 24/7.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="max-w-xs md:max-w-md mx-auto opacity-40" />

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button size="lg" className="px-6 md:px-10 h-12 md:h-14 font-black italic shadow-xl md:shadow-2xl shadow-primary/20 text-sm md:text-base" onClick={() => navigate('/')}>
                RETURN TO HQ DASHBOARD
              </Button>
              <Button size="lg" variant="outline" className="px-6 md:px-10 h-12 md:h-14 font-bold text-sm md:text-base" onClick={() => navigate('/clients/' + data.clientId)}>
                OPEN CLIENT COMMAND CENTER
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-8 py-4 md:py-8 pb-20 px-4 relative">
      {/* Dynamic Header with Exit Option */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {!showTracker && (
             <Button 
               variant="outline" 
               size="sm" 
               onClick={() => setShowTracker(true)}
               className="h-8 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-200"
             >
               Show Tracker
             </Button>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-destructive font-black text-[10px] tracking-widest gap-2"
        >
          <X className="w-4 h-4" /> EXIT ONBOARDING
        </Button>
      </div>

      {/* Onboarding Tracker */}
      {showTracker && (
        <div className="relative px-4 overflow-x-auto no-scrollbar pb-8 group">
          <button 
            onClick={() => setShowTracker(false)}
            className="absolute top-0 right-4 z-20 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white rounded-full p-1.5 shadow-xl hover:scale-110 active:scale-95 transition-all"
            title="Hide Tracker"
          >
            <X className="w-3 h-3" />
          </button>
          <div 
            className="flex items-center justify-between min-w-[800px] relative z-10"
            style={{ paddingLeft: '35px', marginLeft: '1px', paddingTop: '17px', paddingRight: '2.5rem' }}
          >
            <div className="absolute top-6 left-10 right-10 h-1 bg-slate-100 -z-10 rounded-full" />
          <div 
            className="absolute top-6 left-10 h-1 bg-primary -z-10 rounded-full transition-all duration-1000" 
            style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 md:gap-3 relative">
                <motion.div 
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive ? 'var(--color-primary)' : (isCompleted ? '#dcfce7' : '#f8fafc'),
                    color: isActive ? '#ffffff' : (isCompleted ? '#16a34a' : '#94a3b8'),
                    borderColor: isActive ? 'var(--color-primary)' : (isCompleted ? '#86efac' : '#e2e8f0')
                  }}
                  className={cn(
                    "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 border-2 shadow-lg md:shadow-2xl relative",
                    isActive && "ring-4 md:ring-8 ring-primary/10"
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5 md:w-8 md:h-8" strokeWidth={3} /> : <Icon className="w-4 h-4 md:w-6 md:h-6" />}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-4 border-white rounded-full" />
                  )}
                </motion.div>
                <div className="flex flex-col items-center">
                   <span className={cn(
                    "text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-center whitespace-nowrap",
                    isActive ? "text-primary" : "text-slate-400"
                  )}>
                    {step.title}
                  </span>
                  {isActive && (
                    <motion.div layoutId="indicator" className="h-0.5 md:h-1 w-3 md:w-4 bg-primary mt-1 rounded-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      <div className="relative px-4 max-w-5xl mx-auto">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-2xl md:rounded-[2.5rem] overflow-hidden">
               <div className="bg-slate-900 px-6 md:px-10 py-3 md:py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                     <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Live Session: {data.client.company || 'Provisioning...'}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-slate-500 font-mono text-[9px] md:text-[10px]">
                     <span>LOG_LEVEL: VERBOSE</span>
                     <span>ENCRYPTION: AES-256</span>
                  </div>
               </div>
              <CardHeader className="px-6 md:px-10 pt-6 md:pt-10 pb-4 md:pb-6 border-b bg-white hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl md:text-4xl font-black tracking-tighter italic">STEP 0{currentStepIndex + 1}: {STEPS[currentStepIndex].title.toUpperCase()}</CardTitle>
                    <CardDescription className="text-sm md:text-lg font-medium mt-1">DigiSuite Agency Automated Onboarding Protocol</CardDescription>
                  </div>
                  <div className="flex items-center md:flex-col md:items-end gap-2 md:gap-1">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 md:px-4 py-1 md:py-1.5 font-black italic tracking-widest text-[9px] md:text-[10px]">
                      PROTOCOL v4.2.1
                    </Badge>
                    <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Last Synced: Just Now</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-10 bg-white">
                {renderStep()}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Persistence Side-car */}
      <div className="fixed bottom-8 right-8 w-96 space-y-3 pointer-events-none z-50">
        <AnimatePresence>
          {notifications.slice(0, 3).map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: 50 }}
              className="bg-slate-900/95 backdrop-blur-xl p-5 rounded-2xl shadow-3xl border border-white/10 pointer-events-auto flex gap-4 relative group"
            >
              <button 
                onClick={() => dismissNotification(n.id)}
                className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 shadow-lg hover:bg-slate-700 transition-colors opacity-100 lg:opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
              <div className={cn(
                "w-1 rounded-full",
                n.type === 'Success' ? "bg-green-400" : "bg-primary"
              )} />
              <div className="flex-1 space-y-1">
                <p className="text-xs font-black text-primary uppercase tracking-widest">{n.title}</p>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">{n.message}</p>
                <p className="text-[9px] text-slate-500 font-mono uppercase">Status_Code: 200_OK</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
