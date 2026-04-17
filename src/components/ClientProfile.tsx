import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  Plus, 
  FileText, 
  CreditCard, 
  Rocket, 
  Briefcase, 
  BarChart3,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  ExternalLink,
  ArrowLeft,
  X,
  XCircle,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  ArrowUpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, buttonVariants } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '../lib/utils';
import { Separator } from './ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

export const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, quotes, invoices, plans, projects, reports, activatePlan, deactivatePlan, buyPlan } = useApp();
  const client = clients.find(c => c.id === id);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold">Client not found</h2>
        <Link to="/clients" className={cn(buttonVariants(), "mt-4")}>
          Back to Clients
        </Link>
      </div>
    );
  }

  const clientQuotes = quotes.filter(q => q.clientId === id);
  const clientInvoices = invoices.filter(i => i.clientId === id);
  const clientPlans = plans.filter(p => p.clientId === id);
  const clientProjects = projects.filter(p => p.clientId === id);
  const clientReports = reports.filter(r => r.clientId === id);
  const { projectApprovals, updateApprovalStatus } = useApp();
  const clientApprovals = projectApprovals.filter(a => a.clientId === id);

  const [isManagePlansOpen, setIsManagePlansOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'select' | 'review'>('select');
  const [selectedPlansToToggle, setSelectedPlansToToggle] = useState<string[]>([]);
  const [selectedUpgrades, setSelectedUpgrades] = useState<string[]>([]);
  const [isLaunchDialogOpen, setIsLaunchDialogOpen] = useState(false);
  const [selectedPlansToLaunch, setSelectedPlansToLaunch] = useState<string[]>([]);

  const UPGRADE_PACKAGES = [
    { category: 'SEO', items: ['SEO Basic', 'SEO Pro', 'SEO Enterprise'] },
    { category: 'SMM', items: ['SMM Basic', 'SMM Pro', 'SMM Premium'] }
  ];

  const handleUpgradePlans = () => {
    // Logic for upgrading plans
    selectedUpgrades.forEach(planName => {
      // Mocking adding a new plan
      const newPlan = {
        id: 'P' + Math.floor(Math.random() * 1000),
        clientId: id || '',
        serviceType: planName.split(' ')[0],
        name: planName,
        status: 'Ready for Activation',
      };
      // Note: Ideally we would have an addPlan function in useApp
      // For now we'll just show success and close
    });
    
    setIsUpgradeDialogOpen(false);
    setSelectedUpgrades([]);
    alert(`Successfully selected ${selectedUpgrades.length} plans for upgrade.`);
  };

  const toggleLaunchSelection = (planId: string) => {
    setSelectedPlansToLaunch(prev => 
      prev.includes(planId) ? prev.filter(id => id !== planId) : [...prev, planId]
    );
  };

  const handleLaunchProjects = () => {
    selectedPlansToLaunch.forEach(planId => {
      // Logic for launching projects
      const plan = clientPlans.find(p => p.id === planId);
      const projectExists = clientProjects.some(pj => pj.serviceType === plan?.serviceType);
      
      if (!projectExists) {
        activatePlan(planId);
        // We find the newly created project to simulate agent run if needed
        // In this mock, we'll just alert that agents are starting
      }
    });
    setIsLaunchDialogOpen(false);
    setSelectedPlansToLaunch([]);
    alert(`Successfully launched ${selectedPlansToLaunch.length} projects! DigiSuite agents have been deployed to start fulfillment.`);
  };

  const toggleUpgradeSelection = (planName: string) => {
    setSelectedUpgrades(prev => 
      prev.includes(planName) ? prev.filter(name => name !== planName) : [...prev, planName]
    );
  };

  const PLAN_PRICES: Record<string, number> = {
    'SEO Pro': 199,
    'SEO Basic': 99,
    'SEO Enterprise': 499,
    'SMM Basic': 49,
    'SMM Pro': 99,
    'SMM Premium': 149,
    'Full Digital Suite': 599,
  };

  const handleApplyPlanChanges = () => {
    selectedPlansToToggle.forEach(planId => {
      const plan = clientPlans.find(p => p.id === planId);
      if (plan) {
        if (plan.status === 'Active') {
          deactivatePlan(planId);
        } else {
          // Use buyPlan for purchasing/activation workflow
          buyPlan(planId);
        }
      }
    });
    setIsManagePlansOpen(false);
    setSelectedPlansToToggle([]);
    setCheckoutStep('select');
  };

  const totalCheckoutAmount = selectedPlansToToggle.reduce((sum, id) => {
    const plan = clientPlans.find(p => p.id === id);
    return sum + (plan ? (PLAN_PRICES[plan.name] || 99) : 0);
  }, 0);

  const togglePlanSelection = (planId: string) => {
    setSelectedPlansToToggle(prev => 
      prev.includes(planId) ? prev.filter(id => id !== planId) : [...prev, planId]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="shrink-0 h-10 w-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar className="w-20 h-20 border-4 border-secondary">
              <AvatarImage src={`https://picsum.photos/seed/${client.id}/200`} />
              <AvatarFallback className="text-2xl">{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
                <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground mt-1">{client.company}</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" /> {client.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" /> {client.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" /> {client.website}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link 
              to={`/quotes/new?clientId=${client.id}`} 
              className={cn(buttonVariants({ variant: "outline" }), "flex items-center")}
            >
              <FileText className="w-4 h-4 mr-2" /> Create Quote
            </Link>
            
            <Dialog open={isManagePlansOpen} onOpenChange={(open) => {
              setIsManagePlansOpen(open);
              if (!open) {
                setCheckoutStep('select');
                setSelectedPlansToToggle([]);
              }
            }}>
              <DialogTrigger 
                render={
                  <Button 
                    variant={clientPlans.some(p => p.status === 'Active') ? "outline" : "default"}
                    size="lg"
                    className="shadow-md hover:scale-105 transition-transform bg-primary"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" /> Purchase Plans
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {checkoutStep === 'select' ? <ShoppingBag className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                    </div>
                    <DialogTitle className="text-xl">
                      {checkoutStep === 'select' ? 'Select DigiSuite Plans' : 'Checkout Review'}
                    </DialogTitle>
                  </div>
                  <DialogDescription>
                    {checkoutStep === 'select' 
                      ? `Choose the services to activate for ${client.company}.`
                      : 'Please review the internal costs for activation.'}
                  </DialogDescription>
                </DialogHeader>

                {checkoutStep === 'select' ? (
                  <div className="py-4 space-y-4">
                    {clientPlans.length > 0 ? (
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {clientPlans.map((plan) => {
                          const price = PLAN_PRICES[plan.name] || 99;
                          return (
                            <div 
                              key={plan.id} 
                              className={cn(
                                "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                                selectedPlansToToggle.includes(plan.id) 
                                  ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm" 
                                  : "border-border hover:bg-slate-50"
                              )}
                              onClick={() => togglePlanSelection(plan.id)}
                            >
                              <div className="flex items-center gap-4">
                                <Checkbox 
                                  checked={selectedPlansToToggle.includes(plan.id)}
                                  onCheckedChange={() => togglePlanSelection(plan.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div>
                                  <p className="font-bold text-sm">{plan.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={plan.status === 'Active' ? 'default' : 'secondary'} className="text-[10px] h-4">
                                      {plan.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-black text-primary tracking-tighter">${price}</span>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold leading-none">/mo</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
                        <Rocket className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">No plans found for this client.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order Summary</h4>
                      <div className="space-y-2">
                        {selectedPlansToToggle.map(id => {
                          const plan = clientPlans.find(p => p.id === id);
                          const price = PLAN_PRICES[plan?.name || ''] || 99;
                          return (
                            <div key={id} className="flex justify-between text-sm items-center">
                              <span className="font-medium">{plan?.name}</span>
                              <span className="font-mono font-bold">${price}</span>
                            </div>
                          );
                        })}
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold">Total Internal Cost</span>
                        <span className="text-lg font-black text-primary">${totalCheckoutAmount}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 italic text-[11px] text-blue-700">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      Purchasing these plans will trigger immediate DigiSuite fulfillment. This cost is fixed per month.
                    </div>
                  </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                  {checkoutStep === 'select' ? (
                    <>
                      <Button variant="ghost" onClick={() => setIsManagePlansOpen(false)}>Cancel</Button>
                      <Button 
                        onClick={() => setCheckoutStep('review')}
                        disabled={selectedPlansToToggle.length === 0}
                        className="font-bold px-8 shadow-lg shadow-primary/20"
                      >
                        Checkout Review <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" onClick={() => setCheckoutStep('select')}>Back</Button>
                      <Button 
                        onClick={handleApplyPlanChanges}
                        className="font-bold px-8 shadow-lg shadow-primary/20"
                      >
                        Confirm & Purchase (${totalCheckoutAmount})
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isLaunchDialogOpen} onOpenChange={setIsLaunchDialogOpen}>
              <DialogTrigger 
                render={
                  <Button 
                    variant="default"
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 shadow-md hover:scale-105 transition-transform"
                    disabled={!clientPlans.some(p => p.status === 'Active' || p.status === 'Ready for Activation')}
                  >
                    <Rocket className="w-5 h-5 mr-2" /> Launch DigiSuite
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <div className="p-2 rounded-lg bg-orange-100 italic">
                      <Rocket className="w-6 h-6 animate-bounce" />
                    </div>
                    <DialogTitle className="text-xl font-black italic tracking-tighter">Launch Digi Suite</DialogTitle>
                  </div>
                  <DialogDescription>
                    Select the service agents you want to launch into production for this client.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                  <div className="space-y-3 max-h-[350px] overflow-y-auto">
                    {clientPlans.filter(p => (p.status === 'Active' || p.status === 'Ready for Activation')).map((plan) => {
                      const isLaunched = clientProjects.some(proj => proj.serviceType === plan.serviceType);
                      return (
                        <div 
                          key={plan.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                            selectedPlansToLaunch.includes(plan.id) 
                              ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500" 
                              : "border-border hover:bg-slate-50"
                          )}
                          onClick={() => !isLaunched && toggleLaunchSelection(plan.id)}
                        >
                          <div className="flex items-center gap-4">
                            <Checkbox 
                              checked={selectedPlansToLaunch.includes(plan.id)}
                              onCheckedChange={() => toggleLaunchSelection(plan.id)}
                              disabled={isLaunched}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div>
                              <p className="font-bold text-sm tracking-tight">{plan.name} Agent</p>
                              <div className="flex items-center gap-2 mt-1">
                                {isLaunched ? (
                                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> ACTIVE
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="border-orange-200 text-orange-700">
                                    READY FOR TAKEOFF
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {isLaunched && (
                            <span className="text-[10px] font-bold text-green-600 lowercase tracking-widest italic">Live in Orbit</span>
                          )}
                        </div>
                      );
                    })}
                    {clientPlans.filter(p => (p.status === 'Active' || p.status === 'Ready for Activation')).length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground italic">Purchase a plan first to see it here.</p>
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsLaunchDialogOpen(false)}>Standby</Button>
                  <Button 
                    onClick={handleLaunchProjects}
                    disabled={selectedPlansToLaunch.length === 0}
                    className="bg-orange-600 hover:bg-orange-700 font-bold px-8 shadow-lg shadow-orange-200"
                  >
                    LAUNCH CHANNELS <Rocket className="w-4 h-4 ml-2" />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/clients')}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-white p-1 border border-border rounded-xl shadow-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active MRR</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const activePlans = clientPlans.filter(p => p.status === 'Active');
                  const totalMrr = activePlans.reduce((sum, p) => sum + (PLAN_PRICES[p.name] || 99), 0);
                  return (
                    <>
                      <div className="text-2xl font-bold">${totalMrr}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] h-4">
                          {activePlans.length} Agents Active
                        </Badge>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${clientInvoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">Lifetime Billing ({clientInvoices.length} invoices)</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit (Est.)</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const totalPaid = clientInvoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
                  // Fixed 64% margin mock or calc from real items
                  const profit = Math.floor(totalPaid * 0.64);
                  return (
                    <>
                      <div className="text-2xl font-bold">${profit}</div>
                      <span className="text-xs text-green-600 font-medium mt-1">64% Profit Margin</span>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientApprovals.filter(a => a.status === 'Pending').length}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-orange-600 uppercase">Requires Review</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Quote #Q123 Sent</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Invoice #INV123 Paid</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">SEO Pro Plan Activated</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Client Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {client.notes || 'No notes available for this client.'}
                </p>
                <Button variant="link" className="px-0 mt-4 h-auto">Edit Notes</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quotes">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Quotes</CardTitle>
              <Link 
                to={`/quotes/new?clientId=${client.id}`} 
                className={cn(buttonVariants({ size: "sm" }), "flex items-center")}
              >
                <Plus className="w-4 h-4 mr-2" /> Create Quote
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {quote.items.map((item, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 h-5 bg-secondary text-secondary-foreground font-bold border-none">
                              {item.serviceType} {item.package}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>${quote.monthlyFee}/mo</TableCell>
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
                        <Link 
                          to={`/quote/${quote.id}`} 
                          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex items-center justify-center")}
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {clientQuotes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No quotes found for this client.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Invoices</CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" /> New Invoice
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>${invoice.amount}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'Paid' ? 'default' : 'destructive'} className={cn(
                          invoice.status === 'Paid' ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100" : ""
                        )}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {clientInvoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No invoices found for this client.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clientPlans.map((plan) => (
              <Card key={plan.id} className="border-none shadow-sm overflow-hidden">
                <div className={cn(
                  "h-2 w-full",
                  plan.status === 'Active' ? "bg-green-500" : "bg-orange-400"
                )} />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
                    <Badge variant={plan.status === 'Active' ? 'default' : 'secondary'}>
                      {plan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Monthly Cost</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-primary tracking-tighter">
                          ${PLAN_PRICES[plan.name] || 99}
                        </span>
                        <span className="text-xs text-muted-foreground font-bold">/mo</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Renewal</p>
                      <p className="font-bold">{plan.renewalDate || '--'}</p>
                    </div>
                  </div>

                  <Separator className="opacity-50" />

                  <div className="grid grid-cols-1 gap-2">
                    {plan.status === 'Ready for Activation' && (
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 font-bold" onClick={() => activatePlan(plan.id)}>
                        <Rocket className="w-4 h-4 mr-2" /> Launch Agent
                      </Button>
                    )}
                    {plan.status === 'Active' && (
                      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
                      <DialogTrigger 
                        render={
                          <Button variant="outline" className="w-full">
                            <ArrowUpCircle className="w-4 h-4 mr-2" /> Upgrade Plans
                          </Button>
                        }
                      />
                      <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                          <DialogTitle>Upgrade Service Plans</DialogTitle>
                          <DialogDescription>
                            Select additional DigiSuite packages to add to this client's ecosystem.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-6">
                          {UPGRADE_PACKAGES.map((group) => (
                            <div key={group.category} className="space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <Layers className="w-3 h-3" /> {group.category} Services
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {group.items.map((planName) => (
                                  <div 
                                    key={planName}
                                    className={cn(
                                      "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                                      selectedUpgrades.includes(planName) 
                                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm" 
                                        : "border-border hover:bg-slate-50"
                                    )}
                                    onClick={() => toggleUpgradeSelection(planName)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Checkbox 
                                        checked={selectedUpgrades.includes(planName)}
                                        onCheckedChange={() => toggleUpgradeSelection(planName)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <span className="text-sm font-medium">{planName}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] opacity-70">
                                      ${PLAN_PRICES[planName] || 99}/mo
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <DialogFooter>
                          <Button variant="ghost" onClick={() => setIsUpgradeDialogOpen(false)}>Cancel</Button>
                          <Button 
                            onClick={handleUpgradePlans}
                            disabled={selectedUpgrades.length === 0}
                            className="bg-primary font-bold"
                          >
                            Save Upgrades ({selectedUpgrades.length})
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {clientPlans.length === 0 && (
              <Card className="col-span-full border-none shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Layers className="w-12 h-12 mb-4 opacity-20" />
                  <p>No plans found for this client.</p>
                  <Button variant="link" className="mt-2">View available services</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {project.serviceType}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                            onClick={() => window.open(client?.website || '#', '_blank')}
                          >
                            <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-xs font-medium">In Strategy</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-500" 
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Open</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {clientProjects.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No active projects found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Project Approvals & Reviews</CardTitle>
                <p className="text-sm text-muted-foreground">Review and approve project milestones and deliverables.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {clientApprovals
                    .sort((a, b) => {
                      const order = { 'Pending': 0, 'Changes Requested': 1, 'Approved': 2, 'Rejected': 3 };
                      return order[a.status] - order[b.status];
                    })
                    .map((approval) => (
                    <div key={approval.id} className="relative pl-8 border-l-2 border-slate-100 pb-8 last:pb-0">
                      <div className={cn(
                        "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                        approval.status === 'Approved' ? "bg-green-500" :
                        approval.status === 'Pending' ? "bg-blue-500" :
                        approval.status === 'Changes Requested' ? "bg-orange-500" : "bg-slate-300"
                      )} />
                      
                      <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 hover:border-primary/20 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-lg">{approval.title}</h4>
                              <Badge variant="outline" className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                approval.status === 'Approved' ? "bg-green-50 text-green-700 border-green-100" :
                                approval.status === 'Pending' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                "bg-orange-50 text-orange-700 border-orange-100"
                              )}>
                                {approval.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{approval.description}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            Due: {approval.dueDate}
                          </div>
                        </div>

                        {approval.feedback && (
                          <div className="mb-4 p-3 bg-orange-50/50 border border-orange-100 rounded-lg text-sm text-orange-800 italic">
                            " {approval.feedback} "
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                          {approval.status === 'Pending' || approval.status === 'Changes Requested' ? (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => updateApprovalStatus(approval.id, 'Approved')}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  const feedback = prompt('Please provide feedback for changes:');
                                  if (feedback) updateApprovalStatus(approval.id, 'Changes Requested', feedback);
                                }}
                              >
                                <X className="w-4 h-4 mr-2" /> Request Changes
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="ghost" disabled className="text-green-600 font-bold">
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Approved
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-primary">
                            <Download className="w-4 h-4 mr-2" /> View Deliverable
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {clientApprovals.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                      No approval requests at this time.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-blue-50/30">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-600">Workflow Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {[
                    { step: 'Onboarding', status: 'Completed' },
                    { step: 'Strategy', status: 'In Review' },
                    { step: 'Execution', status: 'Pending' },
                    { step: 'Reporting', status: 'Pending' }
                  ].map((item, index, array) => (
                    <React.Fragment key={item.step}>
                      <div className="flex flex-col items-center gap-2">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                          item.status === 'Completed' ? "bg-green-500 text-white" :
                          item.status === 'In Review' ? "bg-blue-500 text-white animate-pulse" :
                          "bg-slate-200 text-slate-500"
                        )}>
                          {index + 1}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-tighter">{item.step}</span>
                        <span className="text-[10px] text-muted-foreground">{item.status}</span>
                      </div>
                      {index < array.length - 1 && (
                        <div className="hidden md:block flex-1 h-0.5 bg-slate-200 mx-4 mt-[-20px]" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientReports.map((report) => (
                  <div key={report.id} className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                        <BarChart3 className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <Badge variant="outline">{report.serviceType}</Badge>
                    </div>
                    <h4 className="font-semibold mb-1">Monthly Performance Report</h4>
                    <p className="text-xs text-muted-foreground mb-4">Generated on {report.date}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-3 h-3 mr-2" /> Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-2" /> View
                      </Button>
                    </div>
                  </div>
                ))}
                {clientReports.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                    No reports generated yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
