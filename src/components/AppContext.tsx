/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, FootprintCalculation, SustainabilityGoal, Challenge, BillAnalysis, LeaderboardEntry } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  calculations: FootprintCalculation[];
  addCalculation: (calc: Omit<FootprintCalculation, 'id' | 'userId' | 'date'>) => Promise<FootprintCalculation>;
  goals: SustainabilityGoal[];
  addGoal: (goal: Omit<SustainabilityGoal, 'id' | 'userId' | 'createdAt' | 'progress'>) => Promise<SustainabilityGoal>;
  updateGoalProgress: (goalId: string, taskId: string, completed: boolean) => Promise<void>;
  createAiGoalPlan: (category: 'transport' | 'energy' | 'food' | 'shopping' | 'general', title: string, desc: string) => Promise<void>;
  challenges: Challenge[];
  completeChallenge: (challengeId: string) => Promise<void>;
  bills: BillAnalysis[];
  analyzeBill: (fileData: string, fileName: string, fileMime: string) => Promise<BillAnalysis>;
  leaderboard: LeaderboardEntry[];
  logout: () => void;
  login: (email: string, role: 'user' | 'admin') => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [calculations, setCalculations] = useState<FootprintCalculation[]>([]);
  const [goals, setGoals] = useState<SustainabilityGoal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [bills, setBills] = useState<BillAnalysis[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state with backend on mount
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/db/load');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setCalculations(data.calculations);
          setGoals(data.goals);
          setChallenges(data.challenges);
          setBills(data.bills || []);
          setLeaderboard(data.leaderboard);
        }
      } catch (err) {
        console.error("Failed to load state from database server. Using local memory fallback.", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync back to database whenever state changes
  const saveStateToDb = async (updatedData: {
    user: User | null;
    calculations: FootprintCalculation[];
    goals: SustainabilityGoal[];
    challenges: Challenge[];
    bills: BillAnalysis[];
    leaderboard: LeaderboardEntry[];
  }) => {
    try {
      await fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
    } catch (err) {
      console.error("Failed to sync database updates with server.", err);
    }
  };

  const login = (email: string, role: 'user' | 'admin') => {
    const newUser: User = {
      uid: "ecoventra_pioneer",
      email: email,
      displayName: email.split('@')[0].toUpperCase(),
      photoURL: null,
      role: role,
      ecoPoints: 3450,
      streak: 6,
      level: 3,
      badges: ["Green Beginner", "Eco Explorer", "Carbon Reducer"],
      joinedAt: new Date().toISOString(),
    };
    setUser(newUser);
    saveStateToDb({ user: newUser, calculations, goals, challenges, bills, leaderboard });
  };

  const logout = () => {
    setUser(null);
  };

  const addCalculation = async (calcInput: Omit<FootprintCalculation, 'id' | 'userId' | 'date'>) => {
    const newId = `calc_${Date.now()}`;
    const newCalc: FootprintCalculation = {
      ...calcInput,
      id: newId,
      userId: user?.uid || "anonymous",
      date: new Date().toISOString(),
    };

    // Calculate dynamic gains
    const updatedCalcs = [newCalc, ...calculations];
    
    // Increment EcoPoints on calculations
    const scoreDiff = newCalc.carbonScore; // score ranges 0-100 (higher is cleaner)
    const ptsGained = Math.round(scoreDiff * 3); // rewarded for higher score

    let updatedUser = user ? { ...user } : null;
    if (updatedUser) {
      updatedUser.ecoPoints += ptsGained;
      
      // Streak calculation
      updatedUser.streak += 1;
      
      // Level progression: 1000 pts per level
      updatedUser.level = Math.floor(updatedUser.ecoPoints / 1000) + 1;

      // Unlock badges
      const currentBadges = [...updatedUser.badges];
      if (newCalc.carbonScore >= 80 && !currentBadges.includes("Climate Champion")) {
        currentBadges.push("Climate Champion");
      }
      if (updatedUser.ecoPoints >= 5000 && !currentBadges.includes("Sustainability Hero")) {
        currentBadges.push("Sustainability Hero");
      }
      updatedUser.badges = currentBadges;
    }

    // Refresh Leaderboard
    const updatedLeaderboard = leaderboard.map(entry => {
      if (entry.isCurrentUser && updatedUser) {
        return {
          ...entry,
          ecoPoints: updatedUser.ecoPoints,
          streak: updatedUser.streak,
          badgesCount: updatedUser.badges.length
        };
      }
      return entry;
    });

    setUser(updatedUser);
    setCalculations(updatedCalcs);
    setLeaderboard(updatedLeaderboard);

    await saveStateToDb({
      user: updatedUser,
      calculations: updatedCalcs,
      goals,
      challenges,
      bills,
      leaderboard: updatedLeaderboard
    });

    return newCalc;
  };

  const addGoal = async (goalInput: Omit<SustainabilityGoal, 'id' | 'userId' | 'createdAt' | 'progress'>) => {
    const newId = `goal_${Date.now()}`;
    const newGoal: SustainabilityGoal = {
      ...goalInput,
      id: newId,
      userId: user?.uid || "anonymous",
      progress: 0,
      createdAt: new Date().toISOString()
    };

    const updatedGoals = [newGoal, ...goals];
    setGoals(updatedGoals);
    
    await saveStateToDb({
      user,
      calculations,
      goals: updatedGoals,
      challenges,
      bills,
      leaderboard
    });

    return newGoal;
  };

  const updateGoalProgress = async (goalId: string, taskId: string, completed: boolean) => {
    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        const updatedTasks = g.tasks.map(t => t.id === taskId ? { ...t, completed } : t);
        const completedCount = updatedTasks.filter(t => t.completed).length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
        
        return {
          ...g,
          tasks: updatedTasks,
          progress
        };
      }
      return g;
    });

    // Award bonus points on reaching 100% progress
    let updatedUser = user ? { ...user } : null;
    const previousGoal = goals.find(g => g.id === goalId);
    const updatedGoal = updatedGoals.find(g => g.id === goalId);

    if (updatedUser && previousGoal && updatedGoal && previousGoal.progress < 100 && updatedGoal.progress === 100) {
      updatedUser.ecoPoints += 500; // Goal bonus points
      updatedUser.level = Math.floor(updatedUser.ecoPoints / 1000) + 1;
    }

    setGoals(updatedGoals);
    setUser(updatedUser);

    await saveStateToDb({
      user: updatedUser,
      calculations,
      goals: updatedGoals,
      challenges,
      bills,
      leaderboard
    });
  };

  const createAiGoalPlan = async (category: 'transport' | 'energy' | 'food' | 'shopping' | 'general', title: string, desc: string) => {
    try {
      const res = await fetch('/api/gemini/goal-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc, category })
      });
      
      if (res.ok) {
        const data = await res.json();
        
        const tasksWithIds = data.tasks.map((task: any, index: number) => ({
          id: `ai_task_${Date.now()}_${index}`,
          text: task.text,
          completed: false
        }));

        await addGoal({
          title,
          description: data.aiRoadmap || desc,
          category,
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tasks: tasksWithIds,
          isAiGenerated: true
        });
      }
    } catch (err) {
      console.error("AI goal generation error:", err);
      // Fallback
      await addGoal({
        title,
        description: desc,
        category,
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tasks: [
          { id: `t1_${Date.now()}`, text: "Analyze related carbon impacts", completed: false },
          { id: `t2_${Date.now()}`, text: "Adjust routine usage parameters", completed: false }
        ],
        isAiGenerated: false
      });
    }
  };

  const completeChallenge = async (challengeId: string) => {
    const updatedChallenges = challenges.map(ch => ch.id === challengeId ? { ...ch, completed: true } : ch);
    const targetChallenge = challenges.find(ch => ch.id === challengeId);
    
    let updatedUser = user ? { ...user } : null;
    if (updatedUser && targetChallenge && !targetChallenge.completed) {
      updatedUser.ecoPoints += targetChallenge.points;
      updatedUser.level = Math.floor(updatedUser.ecoPoints / 1000) + 1;
    }

    setChallenges(updatedChallenges);
    setUser(updatedUser);

    await saveStateToDb({
      user: updatedUser,
      calculations,
      goals,
      challenges: updatedChallenges,
      bills,
      leaderboard
    });
  };

  const analyzeBill = async (fileData: string, fileName: string, fileMime: string) => {
    const res = await fetch('/api/gemini/analyze-bill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileData, fileName, fileMime })
    });

    if (!res.ok) {
      throw new Error("Could not parse nor compile the target bill.");
    }

    const data = await res.json();
    const newBill: BillAnalysis = {
      id: `bill_${Date.now()}`,
      userId: user?.uid || "anonymous",
      fileName,
      fileType: fileMime,
      uploadedAt: new Date().toISOString(),
      extractedData: {
        billType: data.billType || 'unknown',
        units: data.units || 0,
        cost: data.cost || 0
      },
      carbonImpact: data.carbonImpact || 0,
      suggestions: data.suggestions || []
    };

    const updatedBills = [newBill, ...bills];
    setBills(updatedBills);

    // Give points for recycling records
    let updatedUser = user ? { ...user } : null;
    if (updatedUser) {
      updatedUser.ecoPoints += 150; // points for auditing bills and analyzing footprints
      updatedUser.level = Math.floor(updatedUser.ecoPoints / 1000) + 1;
    }

    setUser(updatedUser);
    await saveStateToDb({
      user: updatedUser,
      calculations,
      goals,
      challenges,
      bills: updatedBills,
      leaderboard
    });

    return newBill;
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      calculations,
      addCalculation,
      goals,
      addGoal,
      updateGoalProgress,
      createAiGoalPlan,
      challenges,
      completeChallenge,
      bills,
      analyzeBill,
      leaderboard,
      logout,
      login,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
