import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Download, 
  Layers,
  Check,
  ShieldCheck,
  ArrowLeft,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const CustomerQuote = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { quotes, clients, updateQuoteStatus } = useApp();
  const quote = quotes.find(q => q.id === id);
  const client = quote ? clients.find(c => c.id === quote.clientId) : null;
  
  const [step, setStep] = useState<'view' | 'accepted' | 'paid'>('view');

  if (!quote || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full text-center p-8">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Quote Not Found</h2>
          <p className="text-muted-foreground mt-2">This quote link may have expired or is invalid.</p>
        </Card>
      </div>
    );
  }

  const handleAccept = () => {
    updateQuoteStatus(quote.id, 'Accepted');
    setStep('accepted');
  };

  const handlePay = () => {
    updateQuoteStatus(quote.id, 'Paid');
    setStep('paid');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Agency Logo/Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="shrink-0 h-10 w-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Layers className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">DigiSuite Agency</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/quotes')}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {step === 'paid' ? (
            <Card className="border-none shadow-xl overflow-hidden text-center py-16 px-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
              <p className="text-xl text-muted-foreground max-w-lg mx-auto mb-8">
                Thank you for your business. Your services ({quote.items.map(i => i.serviceType).join(' & ')}) are being activated and your project manager will be in touch shortly.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg">Go to Dashboard</Button>
                <Button variant="outline" size="lg">View Receipt</Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-none shadow-lg overflow-hidden">
                  <div className="bg-primary p-8 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-3xl font-bold">
                          {quote.items.length > 1 
                            ? `${quote.items[0].serviceType} + ${quote.items.length - 1} more` 
                            : quote.items[0]?.serviceType + ' ' + quote.items[0]?.package
                          }
                        </h1>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {quote.items.map((item, idx) => (
                            <Badge key={idx} className="bg-white/20 text-white border-none py-0 px-2 text-[10px]">
                              {item.serviceType} {item.package}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-primary-foreground/80 mt-2 font-medium">Prepared for {client.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-80 uppercase tracking-widest">Quote ID</p>
                        <p className="text-2xl font-mono font-bold">#{quote.id}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" /> Included Deliverables
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          'Comprehensive Site Audit',
                          'Keyword Research & Strategy',
                          'On-Page Optimization',
                          'Monthly Performance Reports',
                          'Dedicated Account Manager',
                          'Technical SEO Fixes'
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-3 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-bold mb-4">Terms & Conditions</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        This proposal is valid for 14 days. Service will commence immediately upon payment of the setup fee and first month's subscription. The contract term is {quote.contractTerm} with automatic renewal.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Secure Payment Guarantee</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your payment is processed securely via Stripe. We never store your credit card information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-lg sticky top-8">
                  <CardHeader>
                    <CardTitle>Investment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Setup Fee</span>
                        <span className="font-bold">${quote.setupFee}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Monthly Fee</span>
                        <span className="font-bold">${quote.monthlyFee}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Contract Term</span>
                        <span className="font-medium">{quote.contractTerm}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="bg-secondary/50 p-4 rounded-xl">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Due Today</p>
                      <p className="text-4xl font-black text-primary">${quote.setupFee + quote.monthlyFee}</p>
                    </div>

                    <div className="space-y-3 pt-4">
                      {step === 'view' ? (
                        <>
                          <Button className="w-full h-12 text-lg" onClick={handleAccept}>
                            Accept Proposal
                          </Button>
                          <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/5">
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700" onClick={handlePay}>
                          <CreditCard className="w-5 h-5 mr-2" /> Pay Now
                        </Button>
                      )}
                    </div>

                    <p className="text-[10px] text-center text-muted-foreground mt-4">
                      By clicking the button above, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm font-medium mb-4">Need help with this quote?</p>
                    <Button variant="outline" className="w-full">Chat with Support</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
