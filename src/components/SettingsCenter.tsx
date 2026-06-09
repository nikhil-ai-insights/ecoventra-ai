/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useApp } from './AppContext';
import { useTheme } from './ThemeContext';
import { Settings, Shield, User, Bell, HelpCircle, HardDrive, Key, CheckCircle2 } from 'lucide-react';

export default function SettingsCenter() {
  const { user } = useApp();
  const { theme } = useTheme();
  const [haptic, setHaptic] = useState(true);
  const [offlineMock, setOfflineMock] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-display font-extrabold tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-450 dark:text-slate-400">Manage user accounts, sandbox parameters, accessibility presets, and telemetry variables.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-md">
        
        {/* Toggle cards */}
        <div className="space-y-6">
          
          {/* Section: Sandbox */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-450 flex items-center">
              <HardDrive className="h-4 w-4 mr-1.5 text-slate-400" />
              Developer Sandbox Parameters
            </h3>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-855 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Haptic feedback</h4>
                  <p className="text-xs text-slate-400 leading-snug mt-1">Simulate responsive tactile transitions on button clicks.</p>
                </div>
                <button
                  onClick={() => setHaptic(!haptic)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${haptic ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'}`}
                  id="toggle_haptic"
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white h-5 w-5 rounded-full transition-transform ${haptic ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-855 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">API simulation mode</h4>
                  <p className="text-xs text-slate-400 leading-snug mt-1">Force server-side bypasses if external keys timeout.</p>
                </div>
                <button
                  onClick={() => setOfflineMock(!offlineMock)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${offlineMock ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'}`}
                  id="toggle_offline_mock"
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white h-5 w-5 rounded-full transition-transform ${offlineMock ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Accounts */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-450 flex items-center">
              <User className="h-4 w-4 mr-1.5 text-slate-400" />
              Security Credential Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-850">
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">User Mailbox</span>
                <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1.5 font-mono">{user?.email}</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-850">
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Access Priority</span>
                <p className="text-xs font-semibold text-emerald-500 mt-1.5 font-mono capitalize">{user?.role} Mode</p>
              </div>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            {showSaved && (
              <div className="flex items-center space-x-1 text-emerald-500 text-xs font-bold font-mono animate-fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>Configurations persisted locally!</span>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 bg-slate-950 text-white dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-450 hover:bg-slate-850 rounded-xl font-bold text-xs"
            id="btn_save_settings"
          >
            Save parameters
          </button>
        </div>

      </div>

    </div>
  );
}
