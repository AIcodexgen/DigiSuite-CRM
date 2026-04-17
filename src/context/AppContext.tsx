import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Quote, Invoice, Plan, Project, Report, User, Ticket, AgencySettings, ProjectApproval, Notification } from '../types';

interface AppContextType {
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  plans: Plan[];
  projects: Project[];
  reports: Report[];
  users: User[];
  tickets: Ticket[];
  projectApprovals: ProjectApproval[];
  notifications: Notification[];
  agencySettings: AgencySettings;
  tasks: { id: string; title: string; completed: boolean; dueDate: string }[];
  currentUser: User | null;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => string;
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt'>) => string;
  updateQuoteStatus: (quoteId: string, status: Quote['status']) => void;
  activatePlan: (planId: string) => string | void;
  deactivatePlan: (planId: string) => void;
  buyPlan: (planId: string) => void;
  payInvoice: (invoiceId: string) => void;
  addUser: (user: Omit<User, 'id'>) => string;
  removeUser: (userId: string) => void;
  toggleTask: (taskId: string) => void;
  addReport: (report: Omit<Report, 'id'>) => string;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => string;
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => string;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  updateAgencySettings: (settings: AgencySettings) => void;
  updateApprovalStatus: (approvalId: string, status: ProjectApproval['status'], feedback?: string) => void;
  addProjectApproval: (approval: Omit<ProjectApproval, 'id' | 'createdAt'>) => string;
  markNotificationAsRead: (notificationId: string) => void;
  dismissNotification: (notificationId: string) => void;
  shareReport: (reportId: string, email: string) => void;
  runProjectAgent: (projectId: string) => void;
  saveOnboardingProgress: (clientId: string, step: number, data: any) => void;
  updateClient: (clientId: string, clientData: Partial<Client>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Doe',
      company: 'ABC Inc',
      email: 'john@abc.com',
      phone: '123-456-7890',
      website: 'abc.com',
      notes: 'Initial client',
      status: 'Active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Mike Smith',
      company: 'XYZ LLC',
      email: 'mike@xyz.com',
      phone: '098-765-4321',
      website: 'xyz.com',
      notes: 'Potential lead',
      status: 'Quote',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Sarah Jenkins',
      company: 'TechFlow Solutions',
      email: 'sarah@techflow.io',
      phone: '555-0123',
      website: 'techflow.io',
      notes: 'High growth startup',
      status: 'Active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'David Wilson',
      company: 'Wilson & Co',
      email: 'david@wilson.com',
      phone: '555-4567',
      website: 'wilson.com',
      notes: 'Traditional business looking to modernize',
      status: 'Quote',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Emily Brown',
      company: 'Creative Studio',
      email: 'emily@creative.design',
      phone: '555-8901',
      website: 'creative.design',
      notes: 'Design agency partner',
      status: 'Active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'Robert Miller',
      company: 'Miller Logistics',
      email: 'robert@millerlog.com',
      phone: '555-2222',
      website: 'millerlog.com',
      notes: 'Paused at Create Quote step',
      status: 'Onboarding',
      onboardingStep: 1, // Step 1 is 'quote'
      onboardingData: JSON.stringify({
        client: { name: 'Robert Miller', company: 'Miller Logistics', email: 'robert@millerlog.com', phone: '555-2222', website: 'millerlog.com', notes: 'Paused at Create Quote step' }
      }),
      createdAt: new Date().toISOString(),
    },
    {
      id: '7',
      name: 'Alice Cooper',
      company: 'Cooper Designs',
      email: 'alice@cooper.design',
      phone: '555-3333',
      website: 'cooper.design',
      notes: 'Quote sent, waiting for acceptance',
      status: 'Onboarding',
      onboardingStep: 2, // Step 2 is 'send'
      onboardingData: JSON.stringify({
        client: { name: 'Alice Cooper', company: 'Cooper Designs', email: 'alice@cooper.design', phone: '555-3333', website: 'cooper.design', notes: 'Quote sent, waiting for acceptance' },
        quote: { items: [{ serviceType: 'SEO', package: 'Pro', digisuiteCost: 199, sellingPrice: 599 }], setupFee: 299, monthlyFee: 599, contractTerm: 'Monthly' }
      }),
      createdAt: new Date().toISOString(),
    },
  ]);

  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 'Q123',
      clientId: '1',
      items: [
        { serviceType: 'SEO', package: 'Pro', digisuiteCost: 199, sellingPrice: 399 }
      ],
      sellingPrice: 399,
      setupFee: 0,
      monthlyFee: 399,
      contractTerm: 'Monthly',
      notes: 'Standard SEO package',
      autoActivate: true,
      status: 'Sent',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'Q124',
      clientId: '3',
      items: [
        { serviceType: 'SEO', package: 'Premium', digisuiteCost: 499, sellingPrice: 999 }
      ],
      sellingPrice: 999,
      setupFee: 500,
      monthlyFee: 999,
      contractTerm: '12mo',
      notes: 'Full enterprise SEO strategy',
      autoActivate: true,
      status: 'Accepted',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'Q125',
      clientId: '4',
      items: [
        { serviceType: 'SMM', package: 'Basic', digisuiteCost: 99, sellingPrice: 199 }
      ],
      sellingPrice: 199,
      setupFee: 0,
      monthlyFee: 199,
      contractTerm: 'Monthly',
      notes: 'Social media management starter',
      autoActivate: false,
      status: 'Sent',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV123',
      clientId: '1',
      quoteId: 'Q123',
      amount: 399,
      status: 'Paid',
      dueDate: '2026-04-10',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'INV124',
      clientId: '1',
      quoteId: 'Q123',
      amount: 399,
      status: 'Unpaid',
      dueDate: '2026-04-15',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'INV125',
      clientId: '3',
      quoteId: 'Q124',
      amount: 1499,
      status: 'Paid',
      dueDate: '2026-04-12',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'INV126',
      clientId: '5',
      amount: 500,
      status: 'Overdue',
      dueDate: '2026-04-01',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'P1',
      clientId: '1',
      serviceType: 'SEO',
      name: 'SEO Pro',
      status: 'Active',
      startDate: '2026-04-01',
      renewalDate: '2026-05-30',
    },
    {
      id: 'P1_SMM',
      clientId: '1',
      serviceType: 'SMM',
      name: 'SMM Pro',
      status: 'Ready for Activation',
    },
    {
      id: 'P2',
      clientId: '2',
      serviceType: 'SMM',
      name: 'SMM Basic',
      status: 'Not Active',
    },
    {
      id: 'P3',
      clientId: '3',
      serviceType: 'SEO',
      name: 'SEO Enterprise',
      status: 'Active',
      startDate: '2026-04-12',
      renewalDate: '2026-05-12',
    },
    {
      id: 'P4_SMM',
      clientId: '4',
      serviceType: 'SMM',
      name: 'SMM Pro',
      status: 'Not Active',
    },
    {
      id: 'P4',
      clientId: '5',
      serviceType: 'Combo',
      name: 'Full Digital Suite',
      status: 'Active',
      startDate: '2026-03-15',
      renewalDate: '2026-04-15',
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'PRJ1',
      clientId: '1',
      serviceType: 'SEO',
      status: 'Active',
      progress: 40,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'PRJ2',
      clientId: '3',
      serviceType: 'SEO',
      status: 'Onboarding',
      progress: 15,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'PRJ3',
      clientId: '5',
      serviceType: 'Combo',
      status: 'Active',
      progress: 75,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [reports, setReports] = useState<Report[]>([
    {
      id: 'R1',
      clientId: '1',
      serviceType: 'SEO',
      date: '2026-04-10',
      url: '#',
    },
    {
      id: 'R2',
      clientId: '3',
      serviceType: 'SEO',
      date: '2026-04-14',
      url: '#',
    },
    {
      id: 'R3',
      clientId: '5',
      serviceType: 'Combo',
      date: '2026-03-30',
      url: '#',
    },
    {
      id: 'R4',
      clientId: '1',
      serviceType: 'SMM',
      date: '2026-04-12',
      url: '#',
    },
    {
      id: 'R5',
      clientId: '3',
      serviceType: 'SMM',
      date: '2026-04-15',
      url: '#',
    },
    {
      id: 'R6',
      clientId: '5',
      serviceType: 'SEO',
      date: '2026-04-05',
      url: '#',
    },
    {
      id: 'R7',
      clientId: '2',
      serviceType: 'SMM',
      date: '2026-03-25',
      url: '#',
    },
    {
      id: 'R8',
      clientId: '4',
      serviceType: 'SMM',
      date: '2026-04-15',
      url: '#',
    },
    {
      id: 'R9',
      clientId: '4',
      serviceType: 'SEO',
      date: '2026-04-01',
      url: '#',
    },
    {
      id: 'R10',
      clientId: '1',
      serviceType: 'SEO',
      date: '2026-03-10',
      url: '#',
    },
    {
      id: 'R11',
      clientId: '3',
      serviceType: 'SEO',
      date: '2026-03-14',
      url: '#',
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: 'U1',
      name: 'Admin User',
      email: 'admin@digisuite.com',
      role: 'Admin',
      avatar: 'https://picsum.photos/seed/admin/200'
    }
  ]);

  const [tasks, setTasks] = useState([
    { id: 'T1', title: 'Review SEO Strategy for ABC Inc', completed: false, dueDate: '2026-04-16' },
    { id: 'T2', title: 'Send invoice to XYZ LLC', completed: true, dueDate: '2026-04-15' },
    { id: 'T3', title: 'Onboard new team member', completed: false, dueDate: '2026-04-18' },
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TIC101',
      clientId: '1',
      subject: 'Billing discrepancy in last invoice',
      description: 'The amount charged is higher than the agreed monthly fee.',
      status: 'Open',
      priority: 'High',
      category: 'Billing',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'TIC102',
      clientId: '3',
      subject: 'SEO report not loading',
      description: 'The link provided in the email leads to a 404 page.',
      status: 'In Progress',
      priority: 'Medium',
      category: 'Technical',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'TIC103',
      clientId: '5',
      subject: 'Update social media handles',
      description: 'We have changed our Twitter handle to @CreativeStudio_New.',
      status: 'Resolved',
      priority: 'Low',
      category: 'General',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ]);

  const [projectApprovals, setProjectApprovals] = useState<ProjectApproval[]>([
    {
      id: 'APP1',
      projectId: 'PRJ1',
      clientId: '1',
      title: 'Website Analysis Setup',
      description: 'Initial analysis and tracking setup for the project.',
      status: 'Approved',
      type: 'Strategy',
      dueDate: '2026-04-10',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'APP-SEO-1',
      projectId: 'PRJ1',
      clientId: '1',
      title: 'M Technical Audit',
      description: 'Monthly technical health check and crawl report.',
      status: 'Pending',
      type: 'Technical',
      dueDate: '2026-04-20',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'APP-SEO-2',
      projectId: 'PRJ1',
      clientId: '1',
      title: 'Q SEO Audit',
      description: 'Quarterly deep dive into SEO performance and opportunities.',
      status: 'Pending',
      type: 'Strategy',
      dueDate: '2026-04-25',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'APP-SEO-3',
      projectId: 'PRJ1',
      clientId: '1',
      title: 'Keyword Analysis',
      description: 'Identification of high-intent search terms for content targeting.',
      status: 'Approved',
      type: 'Strategy',
      dueDate: '2026-04-15',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'APP-SEO-4',
      projectId: 'PRJ1',
      clientId: '1',
      title: 'LLMS Audit',
      description: 'LLM visibility and optimization analysis.',
      status: 'Pending',
      type: 'Technical',
      dueDate: '2026-04-22',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'APP-SEO-5',
      projectId: 'PRJ1',
      clientId: '1',
      title: '2 Competitor Analysis',
      description: 'Benchmark analysis against top 2 competitors.',
      status: 'Pending',
      type: 'Strategy',
      dueDate: '2026-04-28',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'APP-SEO-6',
      projectId: 'PRJ1',
      clientId: '1',
      title: 'Content Generation',
      description: 'Batch of 4 target-specific blog posts for review.',
      status: 'Pending',
      type: 'Content',
      dueDate: '2026-04-30',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'APP-SEO-7',
      projectId: 'PRJ1',
      clientId: '1',
      title: 'Content Calender',
      description: 'Next months publishing schedule and topic clusters.',
      status: 'Changes Requested',
      type: 'Content',
      dueDate: '2026-04-18',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      feedback: 'Please add 2 more topics related to local services.'
    },
    {
      id: 'APP-SEO-8',
      projectId: 'PRJ1',
      clientId: '1',
      title: 'Analytics Reporting',
      description: 'Custom looker studio dashboard setup for real-time tracking.',
      status: 'Pending',
      type: 'Technical',
      dueDate: '2026-04-24',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'APP-SEO-9',
      projectId: 'PRJ1',
      clientId: '1',
      title: 'R Local SEO',
      description: 'Google Business Profile and local citation audit.',
      status: 'Pending',
      type: 'Strategy',
      dueDate: '2026-04-26',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'APP-SEO-10',
      projectId: 'PRJ1',
      clientId: '1',
      title: 'E Integrations',
      description: 'Search console and third-party API connectivity check.',
      status: 'Approved',
      type: 'Technical',
      dueDate: '2026-04-12',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'APP2',
      projectId: 'PRJ1',
      clientId: '1',
      title: 'Homepage Content Optimization',
      description: 'Revised copy for the main landing page focusing on conversion.',
      status: 'Approved',
      type: 'Content',
      dueDate: '2026-04-15',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'APP3',
      projectId: 'PRJ3',
      clientId: '5',
      title: 'Social Media Ad Creatives',
      description: 'Visual assets for the upcoming Facebook and Instagram campaign.',
      status: 'Changes Requested',
      type: 'Design',
      dueDate: '2026-04-18',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      feedback: 'Please use a more vibrant blue for the call-to-action buttons.'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'N1',
      title: 'New Quote Accepted',
      message: 'John Doe has accepted Quote #Q123.',
      type: 'Success',
      read: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      link: '/quotes'
    },
    {
      id: 'N2',
      title: 'Invoice Overdue',
      message: 'Invoice #INV126 for Creative Studio is 15 days overdue.',
      type: 'Warning',
      read: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      link: '/billing'
    },
    {
      id: 'N3',
      title: 'Project Milestone Reached',
      message: 'Keyword Research Strategy for ABC Inc is ready for review.',
      type: 'Info',
      read: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      link: '/projects'
    }
  ]);

  const [agencySettings, setAgencySettings] = useState<AgencySettings>({
    name: 'DigiSuite Agency',
    logo: 'https://picsum.photos/seed/agency/200',
    primaryColor: '#2563eb',
    currency: 'USD',
    timezone: 'UTC',
    rolePermissions: {
      Admin: {
        manage_billing: true,
        manage_team: true,
        view_reports: true,
        manage_clients: true,
        manage_projects: true,
        approve_work: true,
      },
      Manager: {
        manage_billing: false,
        manage_team: false,
        view_reports: true,
        manage_clients: true,
        manage_projects: true,
        approve_work: true,
      },
      Staff: {
        manage_billing: false,
        manage_team: false,
        view_reports: true,
        manage_clients: true,
        manage_projects: true,
        approve_work: false,
      }
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(users[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newClient: Client = {
      ...clientData,
      id,
      createdAt: new Date().toISOString(),
    };
    setClients([...clients, newClient]);
    return id;
  };

  const addQuote = (quoteData: Omit<Quote, 'id' | 'createdAt'>) => {
    const id = 'Q' + Math.floor(Math.random() * 1000);
    const newQuote: Quote = {
      ...quoteData,
      id,
      createdAt: new Date().toISOString(),
    };
    setQuotes([...quotes, newQuote]);
    return id;
  };

  const updateQuoteStatus = (quoteId: string, status: Quote['status']) => {
    setQuotes(prevQuotes => {
      const updatedQuotes = prevQuotes.map(q => q.id === quoteId ? { ...q, status } : q);
      
      if (status === 'Paid') {
        const quote = prevQuotes.find(q => q.id === quoteId);
        if (quote) {
          const newPlans: Plan[] = [];
          const newProjects: Project[] = [];

          quote.items.forEach(item => {
            const newPlan: Plan = {
              id: 'P' + Math.floor(Math.random() * 10000),
              clientId: quote.clientId,
              serviceType: item.serviceType,
              name: `${item.serviceType} ${item.package}`,
              status: quote.autoActivate ? 'Active' : 'Ready for Activation',
              startDate: quote.autoActivate ? new Date().toISOString().split('T')[0] : undefined,
              renewalDate: quote.autoActivate ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
            };
            newPlans.push(newPlan);
            
            if (quote.autoActivate) {
              const newProject: Project = {
                id: 'PRJ' + Math.floor(Math.random() * 10000),
                clientId: quote.clientId,
                serviceType: item.serviceType,
                status: 'Setup',
                progress: 10,
                createdAt: new Date().toISOString(),
              };
              newProjects.push(newProject);
            }
          });

          setPlans(prevPlans => [...prevPlans, ...newPlans]);
          if (newProjects.length > 0) {
            setProjects(prevProjects => [...prevProjects, ...newProjects]);
          }
        }
      }
      return updatedQuotes;
    });
  };

  const activatePlan = (planId: string) => {
    let newProjectId: string | undefined;
    setPlans(prevPlans => {
      const plan = prevPlans.find(p => p.id === planId);
      if (!plan) return prevPlans;

      if (plan.status === 'Active') return prevPlans;

      const updatedPlans = prevPlans.map(p => p.id === planId ? { 
        ...p, 
        status: 'Active', 
        startDate: new Date().toISOString().split('T')[0],
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      } : p);

      newProjectId = 'PRJ' + Math.floor(Math.random() * 1000);
      const newProject: Project = {
        id: newProjectId,
        clientId: plan.clientId,
        serviceType: plan.serviceType,
        status: 'Setup',
        progress: 10,
        createdAt: new Date().toISOString(),
      };
      setProjects(prevProjects => [...prevProjects, newProject]);
      
      setTimeout(() => {
        runProjectAgent(newProject.id);
      }, 1000);

      return updatedPlans;
    });
    return newProjectId;
  };

  const deactivatePlan = (planId: string) => {
    setPlans(prevPlans => prevPlans.map(p => p.id === planId ? { 
      ...p, 
      status: 'Not Active', 
    } : p));

    // Update notification
    const plan = plans.find(p => p.id === planId);
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Plan Deactivated',
      message: `Successfully deactivated ${plan?.name}. Fulfillment tasks have been paused.`,
      type: 'Warning',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/billing'
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const buyPlan = (planId: string) => {
    // Mocking a direct purchase from DigiSuite 
    // Instead of immediate activation, we set to 'Ready for Activation'
    setPlans(prevPlans => prevPlans.map(p => p.id === planId ? { 
      ...p, 
      status: 'Ready for Activation'
    } : p));
    
    // Add a notification for the purchase
    const plan = plans.find(p => p.id === planId);
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Plan Purchased',
      message: `Successfully purchased ${plan?.name} via DigiSuite. Ready to launch agent.`,
      type: 'Success',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/billing'
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const payInvoice = (invoiceId: string) => {
    setInvoices(prevInvoices => {
      return prevInvoices.map(inv => {
        if (inv.id === invoiceId) {
          if (inv.quoteId) {
            updateQuoteStatus(inv.quoteId, 'Paid');
          }
          return { ...inv, status: 'Paid' as const };
        }
        return inv;
      });
    });
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const id = 'U' + Math.floor(Math.random() * 1000);
    const newUser: User = {
      ...userData,
      id,
    };
    setUsers([...users, newUser]);
    return id;
  };

  const removeUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const addReport = (reportData: Omit<Report, 'id'>) => {
    const id = 'R' + Math.floor(Math.random() * 1000);
    const newReport: Report = {
      ...reportData,
      id,
    };
    setReports([...reports, newReport]);
    return id;
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const id = 'INV' + Math.floor(Math.random() * 1000);
    const newInvoice: Invoice = {
      ...invoiceData,
      id,
      createdAt: new Date().toISOString(),
    };
    setInvoices([...invoices, newInvoice]);
    return id;
  };

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt'>) => {
    const id = 'TIC' + Math.floor(Math.random() * 1000);
    const newTicket: Ticket = {
      ...ticketData,
      id,
      createdAt: new Date().toISOString(),
    };
    setTickets([...tickets, newTicket]);
    return id;
  };

  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(tickets.map(t => t.id === ticketId ? { 
      ...t, 
      status,
      resolvedAt: status === 'Resolved' ? new Date().toISOString() : t.resolvedAt
    } : t));
  };

  const updateApprovalStatus = (approvalId: string, status: ProjectApproval['status'], feedback?: string) => {
    setProjectApprovals(prev => prev.map(app => 
      app.id === approvalId ? { ...app, status, feedback: feedback || app.feedback } : app
    ));
  };

  const addProjectApproval = (approvalData: Omit<ProjectApproval, 'id' | 'createdAt'>) => {
    const id = 'APP' + Math.floor(Math.random() * 1000);
    const newApproval: ProjectApproval = {
      ...approvalData,
      id,
      createdAt: new Date().toISOString(),
    };
    setProjectApprovals(prev => [...prev, newApproval]);
    return id;
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const runProjectAgent = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.isAgentRunning) return;

    // Set agent as running
    setProjects(prev => prev.map(p => p.id === projectId ? { 
      ...p, 
      isAgentRunning: true, 
      agentStatus: `Running ${p.serviceType} Agent...` 
    } : p));

    let currentProgress = project.progress;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 5) + 2;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        setProjects(prev => prev.map(p => p.id === projectId ? { 
          ...p, 
          progress: 100, 
          isAgentRunning: false, 
          agentStatus: 'Agent Completed',
          status: 'Active'
        } : p));

        // Send notification
        const notification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          title: 'Agent Task Completed',
          message: `${project.serviceType} manual optimization has been completed.`,
          type: 'Success',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/projects'
        };
        setNotifications(prev => [notification, ...prev]);
      } else {
        setProjects(prev => prev.map(p => p.id === projectId ? { 
          ...p, 
          progress: currentProgress,
          agentStatus: `Processing ${p.serviceType} optimizations... (${currentProgress}%)`
        } : p));
      }
    }, 1500);
  };

  const shareReport = (reportId: string, email: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Report Shared',
      message: `Report for ${report.serviceType} has been shared with ${email}`,
      type: 'Success',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/reports'
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const updateAgencySettings = (settings: AgencySettings) => {
    setAgencySettings(settings);
  };

  const saveOnboardingProgress = (clientId: string, step: number, onboardingData: any) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, onboardingStep: step, onboardingData, status: 'Onboarding' } : c));
  };

  const updateClient = (clientId: string, clientData: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...clientData } : c));
  };

  return (
    <AppContext.Provider value={{ 
      clients, quotes, invoices, plans, projects, reports, users, currentUser,
      sidebarCollapsed, setSidebarCollapsed, tasks, tickets, projectApprovals, notifications,
      agencySettings,
      addClient, addQuote, updateQuoteStatus, activatePlan, deactivatePlan, buyPlan, payInvoice, addUser, removeUser, toggleTask,
      addReport, addInvoice, addTicket, updateTicketStatus, updateAgencySettings,
      updateApprovalStatus, addProjectApproval, markNotificationAsRead, dismissNotification, shareReport, runProjectAgent,
      saveOnboardingProgress, updateClient
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
