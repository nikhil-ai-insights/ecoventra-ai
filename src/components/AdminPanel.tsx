/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useApp } from './AppContext';
import { Shield, Sparkles, User, Users, Globe, Award, Trash2, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function AdminPanel() {
  const { leaderboard } = useApp();
  const [platformUsers, setPlatformUsers] = useState([
    { id: "u_1", displayName: "homeworkout169@gmail.com", email: "homeworkout169@gmail.com", role: "admin", status: "active", reduction: "410 kg", joined: "2026-06-05" },
    { id: "u_2", displayName: "Sarah Jenkins", email: "sarah.j@techstars.io", role: "user", status: "active", reduction: "220 kg", joined: "2026-06-08" },
    { id: "u_3", displayName: "Liam Chen", email: "l.chen@ecoventra.io", role: "user", status: "active", reduction: "540 kg", joined: "2026-06-01" },
    { id: "u_4", displayName: "Sophia Rodriguez", email: "s.rodriguez@apple.com", role: "user", status: "active", reduction: "180 kg", joined: "2026-06-09" }
  ]);

  const toggleUserStatus = (id: string) => {
    setPlatformUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  const promoteUserRole = (id: string) => {
    setPlatformUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, role: u.role === 'admin' ? 'user' : 'admin' };
      }
      return u;
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-2xl text-rose-500">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">System Admin Panel</h1>
          <p className="text-sm text-slate-450 dark:text-slate-400">Review overall workspace registrations, calculate cumulative offset yields, and govern user permissions.</p>
        </div>
      </div>

      {/* Grid statistics highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Workspace Users</span>
            <span className="text-2xl font-display font-black text-rose-500 mt-1 block">
              {platformUsers.length} Nodes
            </span>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Platform Reductions</span>
            <span className="text-2xl font-display font-black text-emerald-555 mt-1 block">
              1,350 kgCO2
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Globe className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Average Carbon Score</span>
            <span className="text-2xl font-display font-black text-cyan-505 mt-1 block">
              78.4 / 100
            </span>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl">
            <Award className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Main govern list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-md">
        <h3 className="text-base font-display font-black tracking-tight">User Registrations Governer</h3>

        <div className="overflow-x-auto w-full pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono">
                <th className="py-3 px-3">Unique User / Mailbox</th>
                <th className="py-3 px-3">Access Tier</th>
                <th className="py-3 px-3">Lifecycle State</th>
                <th className="py-3 px-3">Offsets Yield</th>
                <th className="py-3 px-3">Registered On</th>
                <th className="py-3 px-3 text-right">Governing Actions</th>
              </tr>
            </thead>
            <tbody>
              {platformUsers.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 dark:border-slate-850">
                  <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white font-mono">{item.email}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${item.role === 'admin' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-450'}`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${item.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/15 text-rose-400'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-500">{item.reduction}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">{item.joined}</td>
                  <td className="py-3.5 px-3 text-right space-x-2">
                    <button
                      onClick={() => promoteUserRole(item.id)}
                      className="text-[10px] font-bold hover:text-emerald-555 text-slate-400 border border-slate-150 dark:border-slate-800 px-2 py-1 rounded-lg hover:border-emerald-500/30 transition-all font-mono"
                      id={`btn_promote_user_${item.id}`}
                    >
                      Toggle Role
                    </button>
                    <button
                      onClick={() => toggleUserStatus(item.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all font-mono ${
                        item.status === 'active' 
                          ? 'border-rose-500/15 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-955/30' 
                          : 'border-emerald-500/15 text-emerald-550 hover:bg-emerald-50/10'
                      }`}
                      id={`btn_suspend_user_${item.id}`}
                    >
                      {item.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
