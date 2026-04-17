import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Info,
  DollarSign,
  Calendar,
  Layers,
  X,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { cn } from '../lib/utils';
import { QuoteItem } from '../types';
import { PLAN_COSTS, SERVICES, PACKAGES } from '../constants';

export const CreateQuote = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientIdFromUrl = searchParams.get('clientId');
  const { clients, addQuote } = useApp();

  const [formData, setFormData] = useState({
    clientId: clientIdFromUrl || '',
    items: [] as QuoteItem[],
    sellingPrice: 0,
    setupFee: 0,
    monthlyFee: 0,
    contractTerm: 'Monthly' as const,
    notes: '',
    autoActivate: true,
  });

  const totalDigisuiteCost = formData.items.reduce((sum, item) => sum + item.digisuiteCost, 0);

  // Auto-fill monthly fee if selling price changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, monthlyFee: prev.sellingPrice }));
  }, [formData.sellingPrice]);

  const toggleItem = (service: typeof SERVICES[number], pkg: typeof PACKAGES[number]) => {
    const itemKey = `${service}-${pkg}`;
    const cost = PLAN_COSTS[itemKey] || 0;
    
    setFormData(prev => {
      const exists = prev.items.find(i => i.serviceType === service && i.package === pkg);
      let newItems;
      if (exists) {
        newItems = prev.items.filter(i => !(i.serviceType === service && i.package === pkg));
      } else {
        newItems = [...prev.items, { serviceType: service, package: pkg, digisuiteCost: cost, sellingPrice: cost * 2 }];
      }
      
      const newTotalCost = newItems.reduce((sum, item) => sum + item.digisuiteCost, 0);
      const newTotalSelling = newItems.reduce((sum, item) => sum + item.sellingPrice, 0);
      
      return { 
        ...prev, 
        items: newItems,
        sellingPrice: newTotalSelling,
        monthlyFee: newTotalSelling
      };
    });
  };

  const updateItemSellingPrice = (index: number, price: number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], sellingPrice: price };
      const newTotalSelling = newItems.reduce((sum, item) => sum + item.sellingPrice, 0);
      return { 
        ...prev, 
        items: newItems,
        sellingPrice: newTotalSelling,
        monthlyFee: newTotalSelling
      };
    });
  };

  const handleSave = (status: 'Draft' | 'Sent') => {
    if (!formData.clientId) {
      alert('Please select a client');
      return;
    }
    if (formData.items.length === 0) {
      alert('Please select at least one service');
      return;
    }
    addQuote({
      ...formData,
      status,
    });
    navigate(`/clients/${formData.clientId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Quote</h1>
            <p className="text-muted-foreground mt-1">Generate a new service proposal for your client.</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Service Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select 
                  value={formData.clientId} 
                  onValueChange={(v) => setFormData({ ...formData, clientId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.company} ({c.name})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                {SERVICES.map(service => (
                  <div key={service} className="space-y-3">
                    <h4 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                      <Layers className="w-3 h-3" /> {service} Packages
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {PACKAGES.map(pkg => {
                        const isSelected = formData.items.some(i => i.serviceType === service && i.package === pkg);
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
                            <p className="text-[10px] text-muted-foreground mb-2">Internal Cost: ${cost}</p>
                            <div className="flex items-center gap-1">
                              <Badge variant="secondary" className="text-[9px] px-1 h-4">Plan: {service} {pkg}</Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Contract Term</Label>
                  <Select 
                    value={formData.contractTerm} 
                    onValueChange={(v: any) => setFormData({ ...formData, contractTerm: v })}
                  >
                    <SelectTrigger>
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
                      checked={formData.autoActivate}
                      onCheckedChange={(v: any) => setFormData({ ...formData, autoActivate: !!v })}
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
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Pricing Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Cost Breakdown Section */}
              {formData.items.length > 0 && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan Cost Breakdown</h4>
                  <div className="space-y-3">
                    {formData.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <div className="col-span-5 flex items-center gap-2">
                          <Check className="w-3 h-3 text-green-600" />
                          <span className="font-bold text-slate-700 text-xs">{item.serviceType} {item.package}</span>
                        </div>
                        <div className="col-span-3">
                          <Label className="text-[10px] text-muted-foreground mb-1 block">Digi Cost (Fixed)</Label>
                          <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1.5 rounded border border-slate-100">
                            <DollarSign className="w-3 h-3 opacity-30" />
                            {item.digisuiteCost}
                          </div>
                        </div>
                        <div className="col-span-4">
                          <Label className="text-[10px] text-primary mb-1 block">Selling Price</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                            <Input 
                              type="number" 
                              className="pl-6 h-8 text-xs font-bold bg-white"
                              value={item.sellingPrice}
                              onChange={(e) => updateItemSellingPrice(idx, Number(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-2 bg-slate-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600">Total Digi Cost</span>
                    <span className="text-sm font-black text-primary">${totalDigisuiteCost}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Digisuite Cost (Fixed Summary) <Info className="w-3 h-3 text-muted-foreground" />
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                    <Input 
                      type="number" 
                      className="pl-10 bg-slate-50 cursor-not-allowed text-muted-foreground font-semibold" 
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
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
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
                      value={formData.setupFee}
                      onChange={(e) => setFormData({ ...formData, setupFee: Number(e.target.value) })}
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
                      value={formData.monthlyFee}
                      onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 sticky top-24 self-start">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50">
              <CardTitle className="text-lg font-semibold">Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Selected Services</p>
                  {formData.items.length > 0 ? (
                    <div className="space-y-2">
                      {formData.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm items-center">
                          <span className="font-medium">{item.serviceType} {item.package}</span>
                          <span className="text-muted-foreground text-xs">${item.digisuiteCost} cost</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No services selected</p>
                  )}
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-muted-foreground">Term</span>
                    <span className="font-medium">{formData.contractTerm}</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Internal Cost</span>
                    <span className="font-medium">${totalDigisuiteCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Setup Fee</span>
                    <span className="font-medium">${formData.setupFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Fee</span>
                    <span className="font-medium font-bold text-primary">${formData.monthlyFee}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                  <span className="font-semibold text-green-800 text-sm">Est. Monthly Profit</span>
                  <span className="text-green-700 font-black">${formData.sellingPrice - totalDigisuiteCost}</span>
                </div>
                <div className="pt-2 space-y-2">
                  <Button className="w-full font-bold h-11" onClick={() => handleSave('Sent')}>
                    <Send className="w-4 h-4 mr-2" /> Send Quote
                  </Button>
                  <Button variant="outline" className="w-full h-11" onClick={() => handleSave('Draft')}>
                    <Save className="w-4 h-4 mr-2" /> Save Draft
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary/5 border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Digisuite Fulfillment</h4>
                  <p className="text-xs text-muted-foreground">{formData.items.length} plans to activate</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Costs are calculated based on registered DigiSuite service plans. These represent your internal agency procurement costs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

