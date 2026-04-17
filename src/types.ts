export type ClientStatus = 'Active' | 'Quote' | 'Inactive' | 'Onboarding';
export type QuoteStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Paid';
export type InvoiceStatus = 'Paid' | 'Unpaid' | 'Overdue';
export type PlanStatus = 'Not Active' | 'Ready for Activation' | 'Active';
export type ProjectStatus = 'Setup' | 'Active' | 'Completed' | 'On Hold';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  notes: string;
  status: ClientStatus;
  createdAt: string;
  onboardingStep?: number;
  onboardingData?: any;
}

export interface Ticket {
  id: string;
  clientId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: 'Technical' | 'Billing' | 'General';
  createdAt: string;
  resolvedAt?: string;
}

export interface QuoteItem {
  serviceType: 'SEO' | 'SMM' | 'Combo';
  package: 'Basic' | 'Pro' | 'Premium';
  digisuiteCost: number;
  sellingPrice: number;
}

export interface Quote {
  id: string;
  clientId: string;
  items: QuoteItem[];
  sellingPrice: number;
  setupFee: number;
  monthlyFee: number;
  contractTerm: 'Monthly' | '6mo' | '12mo';
  notes: string;
  autoActivate: boolean;
  status: QuoteStatus;
  createdAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  quoteId: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  clientId: string;
  serviceType: string;
  name: string;
  status: PlanStatus;
  startDate?: string;
  renewalDate?: string;
}

export interface Project {
  id: string;
  clientId: string;
  serviceType: string;
  status: ProjectStatus;
  progress: number;
  createdAt: string;
  isAgentRunning?: boolean;
  agentStatus?: string;
}

export interface Report {
  id: string;
  clientId: string;
  serviceType: string;
  date: string;
  url: string;
}

export interface ProjectApproval {
  id: string;
  projectId: string;
  clientId: string;
  title: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Changes Requested';
  type: 'Design' | 'Content' | 'Strategy' | 'Technical';
  dueDate: string;
  createdAt: string;
  feedback?: string;
}

export type UserRole = 'Admin' | 'Manager' | 'Staff';

export interface PermissionSet {
  manage_billing: boolean;
  manage_team: boolean;
  view_reports: boolean;
  manage_clients: boolean;
  manage_projects: boolean;
  approve_work: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AgencySettings {
  name: string;
  logo: string;
  primaryColor: string;
  currency: string;
  timezone: string;
  rolePermissions: Record<UserRole, PermissionSet>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Success' | 'Warning' | 'Error';
  read: boolean;
  createdAt: string;
  link?: string;
}
