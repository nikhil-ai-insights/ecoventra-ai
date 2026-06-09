/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { 
  User, Award, Flame, Zap, Shield, Trash2, Calendar, 
  Settings, CheckCircle2, Leaf, Clock, HeartHandshake 
} from 'lucide-react';

export default function ProfileCenter() {
  const { user, calculations, updateProfile, removeCalculation } = useApp();
  const [newName, setNewName] = useState(user?.displayName || "climate_pioneer");
  const [isEditing, setIsEditing] = useState(false);

  const handleNameChange = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(newName);
    setIsEditing(false);
  };

  const levelProgress = user ? ((user.ecoPoints % 1000) / 1000) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Upper banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-205/50 dark:border-slate-800/80 shadow-md flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 p-1 flex items-center justify-center text-white text-3xl font-display font-extrabold shadow-lg shadow-emerald-500/10 uppercase">
            {user?.displayName?.slice(0, 2) || "CP"}
          </div>

          <div className="space-y-1.5">
            {isEditing ? (
              <form onSubmit={handleNameChange} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-semibold"
                  required
                />
                <button type="submit" className="px-3.5 py-1.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold shadow hover:bg-emerald-450">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="text-slate-400 text-xs">Cancel</button>
              </form>
            ) : (
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl font-display font-black capitalize">{user?.displayName}</h1>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-mono text-emerald-500 hover:text-emerald-400"
                  id="btn_edit_profile_name"
                >
                  Edit Name
                </button>
              </div>
            )}
            <p className="text-xs text-slate-400 font-mono">ID: {user?.email} • role: {user?.role}</p>
          </div>
        </div>

        {/* Level details */}
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">LEVEL {user?.level}</span>
            <span className="text-emerald-500 uppercase">{user?.ecoPoints} PTS</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: History Audits */}
        <div className="lg:col-span-2 space-y-5">
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400">Carbon Computation History Map</h3>

          {calculations.length === 0 ? (
            <div className="p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl text-center text-slate-450">
              <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold">No carbon computations listed</p>
              <p className="text-xs text-slate-400 mt-1">Submit foot prints to track compliance over time.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {calculations.map((calc) => (
                <div 
                  key={calc.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                      <p className="text-xs font-bold text-slate-900 dark:text-white font-mono">Measured: {new Date(calc.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {Object.entries(calc.categoryBreakdown).map(([cat, val]) => (
                        <span key={cat} className="text-[10px] font-mono uppercase bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-2 py-0.5 rounded text-slate-450">
                          {cat} {val} kg
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Impact display */}
                  <div className="flex items-center space-x-4 shrink-0 w-full sm:w-auto justify-between border-t border-slate-50 dark:border-slate-850 pt-3 sm:pt-0 sm:border-t-0">
                    <div className="text-left sm:text-right font-mono">
                      <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Score Rating</p>
                      <p className="text-sm font-bold text-emerald-500">{calc.carbonScore}/100</p>
                    </div>

                    <div className="text-left sm:text-right font-mono border-l sm:border-l-0 pl-4 sm:pl-0">
                      <p className="text-[10px] text-slate-405 uppercase font-mono tracking-wider">Cumulative</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{calc.totalEmissions} kg</p>
                    </div>

                    <button
                      onClick={() => removeCalculation(calc.id)}
                      className="p-2 rounded-xl border border-transparent hover:border-rose-100 font-semibold hover:bg-rose-550/10 text-rose-500 cursor-pointer"
                      title="Clear Metric Entry"
                      id={`btn_clear_calc_${calc.id}`}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Badges earned */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-205/50 dark:border-slate-800/80 shadow-md space-y-4">
            <h3 className="text-base font-display font-medium">Unlocked Climate achievements</h3>
            
            <div className="grid grid-cols-1 gap-3 pt-1">
              {user?.badges.map((badge, i) => (
                <div key={i} className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-505/5 flex items-center space-x-3 text-xs text-slate-705 dark:text-slate-300">
                  <Award className="h-5 w-5 text-emerald-555 shrink-0" />
                  <div>
                    <p className="font-extrabold capitalize">{badge}</p>
                    <p className="opacity-80 text-[10px] text-slate-400">Awarded for active Ecoventra carbon score compliances</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
