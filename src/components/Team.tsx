import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Mail, 
  Shield, 
  MoreHorizontal,
  Search,
  Filter,
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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from './ui/dialog';
import { Label } from './ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { User } from '../types';

export const Team = () => {
  const navigate = useNavigate();
  const { users, addUser } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    role: 'Staff',
    avatar: ''
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    addUser({
      ...newUser,
      avatar: `https://picsum.photos/seed/${newUser.name}/200`
    });
    setNewUser({ name: '', email: '', role: 'Staff', avatar: '' });
    setIsAddDialogOpen(false);
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
            <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground mt-1">Manage your agency team members and their roles.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger className={cn(buttonVariants(), "flex items-center gap-2")}>
              <Plus className="w-4 h-4" /> Add Team Member
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@agency.com" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
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
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddUser}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          <Input placeholder="Search team members..." className="pl-10" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30">
              <TableHead className="font-semibold">Member</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-secondary/20">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className={cn(
                      "w-3.5 h-3.5",
                      user.role === 'Admin' ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="text-sm">{user.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
