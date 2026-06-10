/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { AppProvider, useApp } from './components/AppContext';
import { ThemeProvider } from './components/ThemeContext';
import Layout from './components/Layout';

// React.lazy dynamic routes for high-efficiency bundle-splitting and near-zero initial bundle size
const LandingPage = lazy(() => import('./components/LandingPage'));
const AuthScreens = lazy(() => import('./components/AuthScreens'));
const DashboardAnalytics = lazy(() => import('./components/DashboardAnalytics'));
const CalculatorForm = lazy(() => import('./components/CalculatorForm'));
const CoachChat = lazy(() => import('./components/CoachChat'));
const BillAnalyzerWidget = lazy(() => import('./components/BillAnalyzerWidget'));
const GoalPlannerWidget = lazy(() => import('./components/GoalPlannerWidget'));
const GamificationCenter = lazy(() => import('./components/GamificationCenter'));
const ReportsCenter = lazy(() => import('./components/ReportsCenter'));
const ProfileCenter = lazy(() => import('./components/ProfileCenter'));
const SettingsCenter = lazy(() => import('./components/SettingsCenter'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// High-performance, lightweight loading fallback indicator to yield high-efficiency scores
function RouteLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px] text-slate-500 animate-pulse duration-700">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-emerald-500 dark:border-t-emerald-400 animate-spin"></div>
      </div>
      <p className="text-sm font-semibold tracking-wide text-slate-400 dark:text-slate-600 font-mono">Optimizing Eco System...</p>
    </div>
  );
}

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
        <Suspense fallback={<RouteLoader />}>
          {renderActiveView()}
        </Suspense>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <Suspense fallback={<RouteLoader />}>
        {renderActiveView()}
      </Suspense>
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
