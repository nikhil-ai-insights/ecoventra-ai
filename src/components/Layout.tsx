/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { useTheme } from './ThemeContext';
import { 
  Leaf, BarChart3, Activity, Award, FileText, Lightbulb, 
  Sparkles, LogOut, Sun, Moon, Menu, X, User, Settings, 
  ShieldAlert, Zap, Flame, Shield, Compass, Target
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({ children, currentTab, onTabChange }: LayoutProps) {
  const { user, logout } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define sidebar navigation items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'calculator', label: 'Carbon Calculator', icon: Activity },
    { id: 'coach', label: 'AI Eco Coach', icon: Sparkles },
    { id: 'bills', label: 'Bill Analyzer', icon: FileText },
    { id: 'goals', label: 'Goal Planner', icon: Target },
    { id: 'challenges', label: 'Challenges', icon: Award },
    { id: 'reports', label: 'Reports', icon: Compass },
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onTabChange('landing');
  };

  // Progress to next level
  const pointsProgress = user ? ((user.ecoPoints % 1000) / 1000) * 100 : 0;
  const pointsRemaining = user ? 1000 - (user.ecoPoints % 1000) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Skip to Content for assistive technologies */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-emerald-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-bold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
      >
        Skip to main content
      </a>
      
      {/* Top Header navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/50 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => handleTabClick('dashboard')}
            className="flex items-center space-x-2 group focus:outline-none"
            id="brand_logo_button"
          >
            <div className="bg-gradient-to-tr from-emerald-500 to-cyan-400 p-2 rounded-xl text-white shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="h-5 w-5 fill-current" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Ecoventra
            </span>
          </button>
        </div>

        {/* User stats widget in header (Stripe-like luxury details) */}
        {user && (
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full" title="Daily Streak">
              <Flame className="h-4 w-4 text-amber-500 fill-current animate-bounce" />
              <span className="font-mono font-bold text-xs text-amber-500 ml-1.5">{user.streak} Days</span>
            </div>
            <div className="flex items-center bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full" title="Total EcoPoints">
              <Zap className="h-4 w-4 text-emerald-500 fill-current" />
              <span className="font-mono font-bold text-xs text-emerald-500 ml-1.5">{user.ecoPoints} PTS</span>
            </div>
            <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-4">
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-emerald-500 capitalize shadow-inner">
                {user.displayName?.charAt(0) || "U"}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold max-w-[120px] truncate">{user.displayName}</p>
                <p className="text-[10px] text-slate-400 font-mono">LVL {user.level}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {/* Theme custom switch */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
            aria-label="Toggle Theme"
            id="theme_toggle"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User profile dropdown access (only if registered) */}
          {user && (
            <>
              {/* Admin Panel button */}
              {user.role === 'admin' && (
                <button
                  onClick={() => handleTabClick('admin')}
                  className={`hidden lg:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border ${
                    currentTab === 'admin'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                      : 'border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-500/10'
                  } transition-all`}
                  id="admin_panel_button"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin Panel</span>
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none"
                id="mobile_menu_toggle"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Core View Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop sidebar */}
        {user && currentTab !== 'landing' && (
          <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-slate-200/50 dark:border-slate-800/80 p-4 space-y-6 shrink-0 z-40">
            
            {/* Gamified circular indicator */}
            <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sustainability Level</span>
                <span className="font-mono text-xs font-extrabold text-emerald-500">LVL {user.level}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${pointsProgress}%` }}
                />
              </div>
              <p className="text-[10px] mt-2 text-slate-400 font-mono text-right">
                {pointsRemaining} EcoPoints to LEVEL {user.level + 1}
              </p>
            </div>

            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900/60'
                    }`}
                    id={`sidebar_tab_${item.id}`}
                  >
                    <Icon className={`h-4.5 w-4.5 transition-colors ${
                      isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-slate-200/50 dark:border-slate-800/80 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all"
                id="sidebar_logout_button"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>
        )}

        {/* Scrolling Inner Content Frame */}
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto relative p-4 md:p-6 lg:p-8 outline-none" role="main">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Menuoverlay */}
      {user && mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-80 max-w-[85vw] h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-6 z-50 justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-display font-extrabold text-xl tracking-tight text-emerald-500">
                  Ecoventra Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
                  id="mobile_drawer_close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Dynamic gamified badges counts in mobile */}
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-slate-400">LEVEL {user.level}</span>
                  <span className="text-emerald-500">{user.ecoPoints} PTS</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${pointsProgress}%` }} />
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                        isActive 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500' 
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                      id={`mobile_tab_${item.id}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleTabClick('admin')}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10"
                    id="mobile_tab_admin"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin Panel</span>
                  </button>
                )}
              </nav>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10"
                id="mobile_logout_button"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
