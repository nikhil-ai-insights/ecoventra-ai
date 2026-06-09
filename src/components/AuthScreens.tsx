/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Leaf, Mail, Lock, User, Github, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthScreensProps {
  onSuccess: () => void;
}

export default function AuthScreens({ onSuccess }: AuthScreensProps) {
  const { login } = useApp();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("homeworkout169@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState<'user' | 'admin'>("user");
  const [errorMess, setErrorMess] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMess("Please declare your target email address.");
      return;
    }

    login(email, role);
    onSuccess();
  };

  const signInWithGoogleDemo = () => {
    login("homeworkout169@gmail.com", "user");
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-fade-in text-slate-800 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-gradient-to-tr from-emerald-500 to-cyan-400 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-500/10">
            <Leaf className="h-6 w-6 fill-current" />
          </div>
          <h2 className="text-2xl font-display font-black tracking-tight mt-2">
            {isLoginView ? "Welcome Back to Ecoventra" : "Register Carbon Account"}
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-400">Track Today. Transform Tomorrow.</p>
        </div>

        {/* Auth selector and role switcher */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label htmlFor="authEmail" className="text-xs font-semibold text-slate-400 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-420" aria-hidden="true" />
              <input 
                id="authEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="homeworkout169@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="authPassword" className="text-xs font-semibold text-slate-400 block">Account Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-420" aria-hidden="true" />
              <input 
                id="authPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-mono"
                required
              />
            </div>
          </div>

          {/* Role selector (Admin vs User for demo testing) */}
          <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-450">Simulated Role Selection</label>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 px-1.5 rounded font-bold">Hackathon Demo Mode</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  role === 'user' 
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-450 font-bold' 
                    : 'border-slate-200 dark:border-slate-850 text-slate-400'
                }`}
              >
                Standard User
              </button>
              
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  role === 'admin' 
                    ? 'bg-rose-500/15 border-rose-500 text-rose-500 font-bold' 
                    : 'border-slate-200 dark:border-slate-855 text-slate-400'
                }`}
              >
                System Admin
              </button>
            </div>
          </div>

          {errorMess && (
            <p className="text-xs font-semibold text-rose-500">{errorMess}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-955 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all"
            id="auth_submit_login_button"
          >
            {isLoginView ? "Login to Profile" : "Create Account"}
          </button>
        </form>

        {/* Separator / Socials */}
        <div className="relative my-6 text-center">
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-100 dark:bg-slate-800" />
          <span className="relative bg-white dark:bg-slate-900 px-3.5 text-[10px] font-mono tracking-widest text-slate-400 uppercase">Alternative Login</span>
        </div>

        {/* Social logins */}
        <div className="grid grid-cols-1 gap-2.5">
          <button
            onClick={signInWithGoogleDemo}
            className="w-full py-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-white rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-850 transition-colors flex items-center justify-center space-x-2"
            id="google_signin_demo"
          >
            <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
            <span>Login with Google (Sandbox Auth)</span>
          </button>
        </div>

        {/* Toggler */}
        <div className="pt-2 text-center text-xs">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-slate-450 hover:text-emerald-500 transition-colors font-semibold"
            id="auth_toggle_button"
          >
            {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>

      </div>
    </div>
  );
}
