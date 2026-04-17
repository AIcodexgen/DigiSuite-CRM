import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ClientList } from './components/ClientList';
import { ClientProfile } from './components/ClientProfile';
import { CreateQuote } from './components/CreateQuote';
import { CustomerQuote } from './components/CustomerQuote';
import { Projects } from './components/Projects';
import { Reports } from './components/Reports';
import { Billing } from './components/Billing';
import { QuotesList } from './components/QuotesList';
import { Team } from './components/Team';
import { Support } from './components/Support';
import { Settings } from './components/Settings';
import { ClientOnboarding } from './components/ClientOnboarding';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/quote/:id" element={<CustomerQuote />} />
          
          {/* Internal Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<ClientList />} />
            <Route path="clients/:id" element={<ClientProfile />} />
            <Route path="quotes" element={<QuotesList />} />
            <Route path="quotes/new" element={<CreateQuote />} />
            <Route path="onboarding" element={<ClientOnboarding />} />
            <Route path="projects" element={<Projects />} />
            <Route path="billing" element={<Billing />} />
            <Route path="reports" element={<Reports />} />
            <Route path="team" element={<Team />} />
            <Route path="support" element={<Support />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}
