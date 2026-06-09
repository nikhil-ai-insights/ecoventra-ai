/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { 
  Target, Plus, Calendar, CheckSquare, Square, 
  Sparkles, Loader2, Compass, Trash2, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function GoalPlannerWidget() {
  const { goals, addGoal, updateGoalProgress, createAiGoalPlan } = useApp();
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDesc, setNewGoalDesc] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState<'transport' | 'energy' | 'food' | 'shopping' | 'general'>("general");
  const [isGenerating, setIsGenerating] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    await addGoal({
      title: newGoalTitle,
      description: newGoalDesc,
      category: newGoalCategory,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tasks: [
        { id: `custom_t_${Date.now()}_1`, text: "Perform initial carbon auditing on habits", completed: false },
        { id: `custom_t_${Date.now()}_2`, text: "Regulate weekly usage measurements", completed: false }
      ],
      isAiGenerated: false
    });

    setNewGoalTitle("");
    setNewGoalDesc("");
    setOpenModal(false);
  };

  const handleAiLaunch = async () => {
    if (!newGoalTitle.trim()) return;
    setIsGenerating(true);
    try {
      await createAiGoalPlan(newGoalCategory, newGoalTitle, newGoalDesc || `Action plan targeted to optimize carbon score for ${newGoalCategory}`);
      setNewGoalTitle("");
      setNewGoalDesc("");
      setOpenModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Target heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">AI Goal Planner</h1>
          <p className="text-sm text-slate-450 dark:text-slate-400">Establish actionable carbon metrics and let Gemini generate personalized task sheets!</p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="px-5 py-3 bg-slate-900 border border-transparent hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 rounded-xl font-bold text-sm text-white flex items-center space-x-2 shadow-lg shadow-emerald-500/10 transform active:scale-95 transition-transform"
          id="btn_open_goal_modal"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Target Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Goals index list */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-450">Active Milestones</h3>

          {goals.length === 0 ? (
            <div className="p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl text-center text-slate-450">
              <Target className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold">No active goals found</p>
              <p className="text-xs text-slate-400 mt-1">Configure your first carbon target goal to begin audits!</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {goals.map((goal) => (
                <div 
                  key={goal.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850/80 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">{goal.title}</h4>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-[10px] font-mono select-none px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold border border-slate-200/30 dark:border-slate-800/40 uppercase">
                          {goal.category}
                        </span>
                        {goal.isAiGenerated && (
                          <span className="inline-flex items-center text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/15">
                            <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                            <span>AI Plan</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-mono font-black text-emerald-500">{goal.progress}%</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${goal.progress}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Target: {new Date(goal.targetDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-slate-450">
                      {goal.tasks.filter(t => t.completed).length} of {goal.tasks.length} Done
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Step analysis details */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-display font-black text-slate-900 dark:text-white">Goal Tasks Manager</h2>
                <p className="text-xs text-slate-450 dark:text-slate-500">Tick achievements to advance progress bars (Earn loads of Level gains!)</p>
              </div>
              <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono font-bold text-xs rounded-full">
                100% = +500 PTS
              </div>
            </div>

            {goals.length === 0 ? (
              <p className="text-center py-20 text-slate-400 text-xs">Please generate an interactive objective first</p>
            ) : (
              <div className="space-y-6">
                {goals.map((g) => (
                  <div key={g.id} className="space-y-4 border-b border-slate-100 dark:border-slate-800/60 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">{g.title}</h3>
                      <span className="text-xs font-bold text-slate-400 font-mono">Progress: {g.progress}%</span>
                    </div>

                    <p className="text-xs text-slate-400 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
                      {g.description}
                    </p>

                    <div className="grid grid-cols-1 gap-3 pt-1">
                      {g.tasks.map((task) => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => updateGoalProgress(g.id, task.id, !task.completed)}
                          className={`p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                            task.completed 
                              ? 'bg-emerald-500/5 border-emerald-500/40 text-slate-400 dark:text-slate-500' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 hover:border-slate-400 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3.5">
                            {task.completed ? (
                              <CheckSquare className="h-5 w-5 text-emerald-500 shrink-0 fill-current" />
                            ) : (
                              <Square className="h-5 w-5 text-slate-350 shrink-0" />
                            )}
                            <span className={`text-xs md:text-sm ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Goal creation modal overlay */}
      {openModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setOpenModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl space-y-6">
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">Create Target Carbon Goal</h3>
                <p className="text-xs text-slate-400">Choose AI roadmap generation to generate precise sub-tasks!</p>
              </div>
              <button onClick={() => setOpenModal(false)} className="text-slate-400 hover:text-white">×</button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Goal Title</label>
                <input 
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Turn off standby devices"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Goal Description</label>
                <textarea 
                  value={newGoalDesc}
                  onChange={(e) => setNewGoalDesc(e.target.value)}
                  placeholder="Explain why this goal is important and the planetary carbon impacts"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm h-24 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Category Focus</label>
                <select 
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="general">General / Planetary Sustainability</option>
                  <option value="transport">Transportation / Commute</option>
                  <option value="energy">Household Electrical Utilities</option>
                  <option value="food">Diet / Food Carbon Weight</option>
                  <option value="shopping">Consumer Shopping Scope</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={isGenerating || !newGoalTitle.trim()}
                  onClick={handleAiLaunch}
                  className="flex-1 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-955 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin mr-1" />
                      <span>Generating AI Steps...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4.5 w-4.5" />
                      <span>Ask Gemini AI Plan</span>
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 px-5 py-3 bg-slate-950 text-white dark:bg-slate-800 dark:hover:bg-slate-755 border border-transparent rounded-xl font-bold text-xs text-center"
                >
                  Save Standard Goal
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
