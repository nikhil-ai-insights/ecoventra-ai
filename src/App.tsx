/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './components/AppContext';
import { ThemeProvider } from './components/ThemeContext';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import AuthScreens from './components/AuthScreens';
import DashboardAnalytics from './components/DashboardAnalytics';
import CalculatorForm from './components/CalculatorForm';
import CoachChat from './components/CoachChat';
import BillAnalyzerWidget from './components/BillAnalyzerWidget';
import GoalPlannerWidget from './components/GoalPlannerWidget';
import GamificationCenter from './components/GamificationCenter';
import ReportsCenter from './components/ReportsCenter';
import ProfileCenter from './components/ProfileCenter';
import SettingsCenter from './components/SettingsCenter';
import AdminPanel from './components/AdminPanel';

function AppContent() {
  const { user, login } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('landing');

  // Sync route safety guards
  useEffect(() => {
    if (!user && currentTab !== 'landing' && currentTab !== 'auth') {
      setCurrentTab('landing');
    } else if (user && (currentTab === 'landing' || currentTab === 'auth')) {
      setCurrentTab('dashboard');
    }
  }, [user, currentTab]);

  const handleTryDemo = () => {
    // Automatically logs in user as an administrator so they can test both User & System Admin features
    login("homeworkout169@gmail.com", "admin");
    setCurrentTab('dashboard');
  };

  // Render correct sub-page depending on state-based router
  const renderActiveView = () => {
    switch (currentTab) {
      case 'landing':
        return (
          <LandingPage 
            onLoginClick={() => setCurrentTab('auth')} 
            onTryDemo={handleTryDemo} 
          />
        );
      case 'auth':
        return (
          <AuthScreens 
            onSuccess={() => setCurrentTab('dashboard')} 
          />
        );
      
      // Logged in views requiring Layout
      case 'dashboard':
        return <DashboardAnalytics onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'calculator':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h1 className="text-3xl font-display font-extrabold tracking-tight">Scope-3 Carbon Calculator</h1>
              <p className="text-sm text-slate-450 dark:text-slate-400">Complete our simple planetary questionnaire to evaluate emissions quotients.</p>
            </div>
            <CalculatorForm onSuccess={() => setCurrentTab('dashboard')} />
          </div>
        );
      case 'coach':
        return <CoachChat />;
      case 'bills':
        return <BillAnalyzerWidget />;
      case 'goals':
        return <GoalPlannerWidget />;
      case 'challenges':
        return <GamificationCenter />;
      case 'reports':
        return <ReportsCenter />;
      case 'profile':
        return <ProfileCenter />;
      case 'settings':
        return <SettingsCenter />;
      case 'admin':
        // Role check
        if (user?.role !== 'admin') {
          return (
            <div className="p-8 text-center bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-3xl max-w-xl mx-auto">
              <h3 className="font-bold text-lg">System Access Restricted</h3>
              <p className="text-xs opacity-90 mt-1">This panel is restricted to users with direct administrative roles.</p>
            </div>
          );
        }
        return <AdminPanel />;
      
      default:
        return <DashboardAnalytics onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  // Handle wrappers: landing and auth screens do NOT have layout menus
  const needsLayout = currentTab !== 'landing' && currentTab !== 'auth';

  if (needsLayout) {
    return (
      <Layout currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)}>
        {renderActiveView()}
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {renderActiveView()}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
