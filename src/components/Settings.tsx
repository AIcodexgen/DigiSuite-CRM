import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  X, 
  Palette, 
  CreditCard, 
  Users, 
  Plus, 
  Trash2, 
  Save, 
  Upload,
  Globe,
  Clock,
  Shield,
  Mail,
  MoreVertical,
  CheckCircle,
  Package,
  ShoppingCart,
  Lock,
  Key,
  Settings2,
  Users2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const Settings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'branding';

  const { 
    agencySettings, 
    updateAgencySettings, 
    plans,
    buyPlan,
    deactivatePlan,
    users,
    addUser,
    removeUser
  } = useApp();

  const [branding, setBranding] = useState(agencySettings);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Staff' as const });

  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab')!);
    }
  }, [searchParams]);

  const handleSaveBranding = () => {
    updateAgencySettings(branding);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    addUser(newUser);
    setIsAddingUser(false);
    setNewUser({ name: '', email: '', role: 'Staff' });
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
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your agency branding, billing, and team access.</p>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100/50 p-1 mb-8">
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="w-4 h-4" /> Branding
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Marketplace & Plans
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Team Access
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Lock className="w-4 h-4" /> Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Agency Identity</CardTitle>
                  <CardDescription>Customize how your agency appears to clients.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Agency Name</Label>
                      <Input 
                        value={branding.name} 
                        onChange={(e) => setBranding({ ...branding, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="color" 
                          className="w-12 p-1 h-10"
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                        />
                        <Input 
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Agency Logo URL</Label>
                    <div className="flex gap-4">
                      <Input 
                        value={branding.logo}
                        onChange={(e) => setBranding({ ...branding, logo: e.target.value })}
                      />
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" /> Upload
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select 
                        value={branding.currency}
                        onValueChange={(v) => setBranding({ ...branding, currency: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select 
                        value={branding.timezone}
                        onValueChange={(v) => setBranding({ ...branding, timezone: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">EST</SelectItem>
                          <SelectItem value="PST">PST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <Separator />
                <div className="p-6 flex justify-end">
                  <Button onClick={handleSaveBranding}>
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8">
                  <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4 overflow-hidden border-4 border-white">
                    <img src={branding.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold">{branding.name}</h3>
                  <p className="text-sm text-muted-foreground">Client Portal Branding</p>
                  
                  <div className="mt-8 w-full space-y-3">
                    <div className="h-2 w-full bg-slate-200 rounded-full" />
                    <div className="h-2 w-2/3 bg-slate-200 rounded-full" />
                    <div 
                      className="h-10 w-full rounded-lg mt-4 flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      Primary Button
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="flex flex-col gap-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-primary text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Plan Fulfillment</CardTitle>
                    <CardDescription className="text-primary-foreground/70">Activate and manage client service plans via DigiSuite.</CardDescription>
                  </div>
                  <Package className="w-8 h-8 opacity-20" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {plans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs",
                          plan.status === 'Active' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {plan.serviceType}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{plan.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {plan.status === 'Active' ? `Expires: ${plan.renewalDate}` : 'Pending Activation'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={plan.status === 'Active' ? 'default' : 'outline'} className={cn(
                          "font-bold uppercase tracking-wider text-[10px]",
                          plan.status === 'Active' ? "bg-green-500 hover:bg-green-600" : ""
                        )}>
                          {plan.status}
                        </Badge>
                        {plan.status === 'Active' ? (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="h-8 font-bold text-xs"
                            onClick={() => {
                              if (confirm(`Are you sure you want to deactivate ${plan.name}?`)) {
                                deactivatePlan(plan.id);
                              }
                            }}
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="h-8 font-bold text-xs"
                            onClick={() => buyPlan(plan.id)}
                          >
                            Buy & Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {plans.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>No plans available for fulfillment.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Standard SEO Fulfillment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Cost</span>
                    <span className="font-bold font-mono">$199.00</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Includes backlink building, technical SEO audits, and content optimization.</p>
                  <Button variant="outline" className="w-full h-8 text-xs font-bold" onClick={() => navigate('/quotes/new')}>Create Quote</Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Standard SMM Fulfillment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Cost</span>
                    <span className="font-bold font-mono">$99.00</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Includes 12 posts per month, basic engagement, and monthly analysis.</p>
                  <Button variant="outline" className="w-full h-8 text-xs font-bold" onClick={() => navigate('/quotes/new')}>Create Quote</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your agency staff and their access levels. Configure role-based permissions in the <button onClick={() => setActiveTab('permissions')} className="text-primary hover:underline">Permissions</button> tab.</CardDescription>
              </div>
              <Button onClick={() => setIsAddingUser(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Member
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge variant="outline" className={cn(
                        "font-bold uppercase tracking-wider text-[10px]",
                        user.role === 'Admin' ? "bg-purple-50 text-purple-700 border-purple-100" :
                        user.role === 'Manager' ? "bg-blue-50 text-blue-700 border-blue-100" :
                        "bg-slate-50 text-slate-700 border-slate-100"
                      )}>
                        {user.role}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        {user.role !== 'Admin' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/5"
                            onClick={() => removeUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Role-Based Access Control
              </CardTitle>
              <CardDescription>
                Define what different team roles can see and do within the agency portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/3">Permission</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Admin</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Manager</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Staff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { key: 'manage_billing', label: 'Manage Billing & Plans', desc: 'Can purchase plans and view invoices.' },
                      { key: 'manage_team', label: 'Manage Team Members', desc: 'Can invite, remove and edit team members.' },
                      { key: 'manage_clients', label: 'Manage Clients', desc: 'Can add, edit and delete client records.' },
                      { key: 'manage_projects', label: 'Manage Projects', desc: 'Can track progress and fulfill deliverables.' },
                      { key: 'view_reports', label: 'View Reports', desc: 'Can access and share client reports.' },
                      { key: 'approve_work', label: 'Approve Work', desc: 'Can finalise deliverables for client review.' },
                    ].map((permission) => (
                      <tr key={permission.key} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold">{permission.label}</p>
                          <p className="text-xs text-muted-foreground">{permission.desc}</p>
                        </td>
                        {['Admin', 'Manager', 'Staff'].map((role) => (
                          <td key={`${permission.key}-${role}`} className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={branding.rolePermissions[role as any][permission.key as any]}
                                disabled={role === 'Admin'} // Admins usually have all permissions
                                onCheckedChange={(checked) => {
                                  const newPermissions = { ...branding.rolePermissions };
                                  newPermissions[role as any][permission.key as any] = checked as boolean;
                                  setBranding({ ...branding, rolePermissions: newPermissions });
                                }}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <Separator />
            <div className="p-6 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                Admin permissions are fixed and cannot be modified.
              </div>
              <Button onClick={handleSaveBranding}>
                <Save className="w-4 h-4 mr-2" /> Save Permissions
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-blue-50/30 border-blue-100 italic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-600" />
                  Security Best Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Always follow the principle of least privilege. Only grant staff the permissions they absolutely need for their day-to-day fulfillment tasks.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-purple-50/30 border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Users2 className="w-4 h-4 text-purple-600" />
                  Audit Logging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Changes to permissions are logged in the agency audit trail. Ensure your team is aware of their access levels.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Invite a new member to your agency team.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                placeholder="John Doe" 
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input 
                type="email" 
                placeholder="john@agency.com" 
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select 
                value={newUser.role}
                onValueChange={(v: any) => setNewUser({ ...newUser, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingUser(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
