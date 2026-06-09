/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useApp } from './AppContext';
import { Award, Flame, Leaf, Zap, ChevronRight, CheckCircle2, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export default function GamificationCenter() {
  const { user, challenges, completeChallenge, leaderboard } = useApp();

  // Progress block
  const levelPointsProgress = user ? ((user.ecoPoints % 1000) / 1000) * 100 : 0;
  const levelNeeded = user ? 1000 - (user.ecoPoints % 1000) : 0;

  const badgesList = [
    { title: "Green Beginner", desc: "Successfully registered and saved first carbon computation", icon: Leaf, unlocked: user?.badges.includes("Green Beginner") },
    { title: "Eco Explorer", desc: "Maintained active daily habit tracking counts", icon: Sparkles, unlocked: user?.badges.includes("Eco Explorer") },
    { title: "Carbon Reducer", desc: "Minimized transport or electricity outputs by 20%", icon: Zap, unlocked: user?.badges.includes("Carbon Reducer") },
    { title: "Climate Champion", desc: "Achieved an Ecoventra Carbon Score of 80/100 or higher", icon: ShieldCheck, unlocked: user?.badges.includes("Climate Champion") },
    { title: "Sustainability Hero", desc: "Amassed absolute value of over 5000 total EcoPoints", icon: Award, unlocked: user?.badges.includes("Sustainability Hero") }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-display font-extrabold tracking-tight">Ecoventra Arena</h1>
        <p className="text-sm text-slate-450 dark:text-slate-400">Complete challenges, maintain high usage habits, and top high-score boards to collect badges!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: Level card and Badges */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Level Progress */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400">Planet Saver Rank</span>
              <span className="text-sm font-mono font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1 rounded-full">
                LEVEL {user?.level}
              </span>
            </div>

            <div className="flex items-center space-x-6 py-2">
              <div className="h-16 w-16 bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 rounded-2xl flex items-center justify-center text-white font-display font-black text-2xl shadow-lg shadow-emerald-500/10">
                {user?.level}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Active EcoPoints progress</p>
                  <p className="text-xs font-mono font-semibold text-slate-400">
                    {user?.ecoPoints} Total PTS
                  </p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all" style={{ width: `${levelPointsProgress}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {levelNeeded} additional EcoPoints to advance to Level {(user?.level || 1) + 1}!
                </p>
              </div>
            </div>
          </div>

          {/* Active Challenges */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md space-y-4">
            <h3 className="text-base font-display font-bold">Planetary Stewardship Challenges</h3>

            <div className="grid grid-cols-1 gap-3.5 pt-1">
              {challenges.map((ch) => (
                <div 
                  key={ch.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    ch.completed 
                      ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-850 text-slate-450 dark:text-slate-500' 
                      : 'bg-white dark:bg-slate-900 border-slate-220 dark:border-slate-800 hover:border-slate-450'
                  }`}
                >
                  <div className="flex items-start space-x-3.5 max-w-[70%]">
                    <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${ch.completed ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold leading-tight ${ch.completed ? 'line-through' : 'text-slate-900 dark:text-white'}`}>{ch.title}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-450 mt-1">{ch.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-[9px] font-mono select-none uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-450 dark:text-slate-400">
                          {ch.category}
                        </span>
                        <span className="text-[9px] font-mono text-slate-450">Duration: {ch.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {ch.completed ? (
                      <span className="text-xs font-bold text-emerald-550 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 rounded-full select-none">
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => completeChallenge(ch.id)}
                        className="px-4 py-2 bg-slate-950 dark:bg-emerald-500 dark:text-slate-950 hover:bg-slate-850 dark:hover:bg-emerald-400 text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95"
                        id={`btn_complete_challenge_${ch.id}`}
                      >
                        Claim +{ch.points} PTS
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Gallery */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md space-y-4">
            <h3 className="text-base font-display font-bold">Unmapped Carbon Badges</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badgesList.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-2xl border flex items-center space-x-3.5 transition-all ${
                      badge.unlocked 
                        ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-emerald-500/30' 
                        : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-850 opacity-45'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl shrink-0 ${badge.unlocked ? 'bg-gradient-to-tr from-emerald-500 to-cyan-400 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{badge.title}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug mt-1">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right column: Leaderboards */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md space-y-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-amber-500 animate-bounce" />
              <h3 className="text-base font-display font-bold">Global Seed Leaderboard</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed border-b border-slate-100 dark:border-slate-800/60 pb-3">
              Climb rankings by calculating footprints, completing goals, and hitting daily tracking streaks!
            </p>

            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div 
                  key={entry.userId}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    entry.isCurrentUser 
                      ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-emerald-500 ring-1 ring-emerald-500/15' 
                      : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/40 dark:border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <span className="font-mono font-black text-xs text-slate-400 w-5 shrink-0">
                      #{index + 1}
                    </span>
                    <div className="h-8.5 w-8.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-extrabold flex items-center justify-center uppercase shrink-0">
                      {entry.displayName.slice(0, 2)}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center">
                        {entry.displayName}
                        {entry.isCurrentUser && <span className="ml-1.5 text-[8px] bg-emerald-500 text-slate-950 font-bold px-1.5 rounded">YOU</span>}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono">Streak: {entry.streak} Days • {entry.badgesCount} Badges</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-mono text-emerald-500 shrink-0">
                    {entry.ecoPoints} PTS
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
