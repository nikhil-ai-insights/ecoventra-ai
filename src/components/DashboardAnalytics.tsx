/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useApp } from './AppContext';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Flame, Zap, Leaf, Award, Globe, 
  TrendingDown, TrendingUp, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface DashboardAnalyticsProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardAnalytics({ onNavigate }: DashboardAnalyticsProps) {
  const { user, calculations, goals, challenges } = useApp();

  // Pick the latest calculation as current metrics
  const latestCalc = calculations[0] || {
    carbonScore: 75,
    totalEmissions: 410,
    annualForecast: 4.92,
    categoryBreakdown: { transport: 150, energy: 180, food: 60, shopping: 20 }
  };

  const scoreColor = latestCalc.carbonScore >= 80 
    ? 'text-emerald-500' 
    : latestCalc.carbonScore >= 60 
      ? 'text-cyan-500' 
      : 'text-amber-500';

  // Compute trees equivalent: 1 mature tree absorbs ~22kg of CO2 per year, or ~1.8kg per month
  // If baseline is 1000kg/mo and current is totalEmissions, then difference / 1.8 is trees equivalent
  const baselineEmissions = 850; // kgCO2 baseline
  const savedEmissions = Math.max(0, baselineEmissions - latestCalc.totalEmissions);
  const offsetTrees = Math.round(savedEmissions / 1.8);

  // Recharts Carbon Trend Data
  const trendData = [...calculations].reverse().map(c => ({
    date: new Date(c.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    Footprint: c.totalEmissions,
    Score: c.carbonScore
  }));

  // Fallback if empty calculations
  const chartData = trendData.length > 0 ? trendData : [
    { date: "Apr 10", Footprint: 590, Score: 52 },
    { date: "May 10", Footprint: 490, Score: 64 },
    { date: "Jun 09", Footprint: 370, Score: 78 }
  ];

  // Recharts Breakdown Data
  const breakdownData = [
    { name: 'Transport', value: latestCalc.categoryBreakdown.transport, color: '#10B981' },
    { name: 'Energy', value: latestCalc.categoryBreakdown.energy, color: '#22D3EE' },
    { name: 'Food', value: latestCalc.categoryBreakdown.food, color: '#F59E0B' },
    { name: 'Shopping', value: latestCalc.categoryBreakdown.shopping, color: '#EF4444' }
  ];

  // Metrics details
  const metrics = [
    { 
      id: 'score',
      label: "Carbon Score", 
      value: `${latestCalc.carbonScore}/100`, 
      description: "Higher means cleaner", 
      trend: "+12% improving", 
      trendingUp: true,
      colorClass: scoreColor,
      details: "Top 15% in platform",
      icon: Leaf,
      bg: "from-emerald-500/10 to-teal-500/10"
    },
    { 
      id: 'emissions',
      label: "Monthly Emissions", 
      value: `${latestCalc.totalEmissions} kg`, 
      description: "Carbon dioxide output", 
      trend: "-24% below threshold", 
      trendingUp: false,
      colorClass: "text-slate-800 dark:text-white",
      details: "Global avg: 850kg/mo",
      icon: Globe,
      bg: "from-cyan-500/10 to-teal-500/10"
    },
    { 
      id: 'trees',
      label: "Trees Equivalent", 
      value: `${offsetTrees} Trees`, 
      description: "Equated carbon absorption", 
      trend: `${Math.round(savedEmissions)} kgCO2 saved`, 
      trendingUp: true,
      colorClass: "text-emerald-500",
      details: "Net environmental offset",
      icon: Leaf,
      bg: "from-emerald-500/10 to-cyan-500/10"
    },
    { 
      id: 'streak',
      label: "Daily Streak", 
      value: `${user?.streak || 0} Days`, 
      description: "Consecutive eco habits", 
      trend: "Leveling up faster", 
      trendingUp: true,
      colorClass: "text-amber-500",
      details: "Keep tracking daily!",
      icon: Flame,
      bg: "from-amber-500/10 to-orange-500/25"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:via-slate-910 dark:to-slate-950 border border-slate-200/10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Leaf className="h-64 w-64 fill-current rotate-12 text-emerald-400" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-3 w-3 animate-spin" />
            <span>AI Platform Online</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Greetings, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 capitalize">{user?.displayName || "climate pioneer"}</span>!
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Your carbon score is in prime condition. By shifting transportation models, you helped offset <span className="font-bold text-white text-gradient">{Math.round(savedEmissions)}kg of CO2</span> this calculation period.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => onNavigate('calculator')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
              id="dashboard_calc_now"
            >
              Track Footprint
            </button>
            <button 
              onClick={() => onNavigate('coach')}
              className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-100 rounded-xl font-bold text-sm border border-slate-700 hover:border-slate-600 transition-all"
              id="dashboard_chat_coach"
            >
              Consult AI Coach
            </button>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md shadow-slate-100/10 hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex flex-col justify-between`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{metric.label}</span>
                  <div className={`text-2xl md:text-3xl font-display font-extrabold tracking-tight mt-1 ${metric.colorClass}`}>
                    {metric.value}
                  </div>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${metric.bg}`}>
                  <Icon className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                </div>
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">{metric.description}</span>
                <span className={`font-semibold ${metric.trendingUp ? 'text-emerald-500' : 'text-emerald-400'}`}>
                  {metric.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytical Charts and Diagrams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart (Recharts) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md flex flex-col justify-between h-[360px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-display font-bold">Climate Output Trend</h2>
              <p className="text-xs text-slate-450 dark:text-slate-500">Historical changes in carbon emissions (kgCO2)</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/15">
              Sync Active
            </span>
          </div>

          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFootprint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderRadius: '16px', 
                    border: 'none', 
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="Footprint" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorFootprint)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Donut Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md flex flex-col justify-between h-[360px]">
          <div>
            <h2 className="text-lg font-display font-bold">Category Breakdown</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Breakdown of monthly emissions (kgCO2)</p>
          </div>

          <div className="h-40 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[10px] uppercase font-mono text-slate-450">Annual Forecast</span>
              <p className="text-lg font-display font-extrabold text-slate-800 dark:text-white">
                {latestCalc.annualForecast} T
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {breakdownData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900/40 p-2 rounded-xl">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="truncate">
                    <p className="font-semibold text-slate-600 dark:text-slate-400">{item.name}</p>
                    <p className="font-mono font-bold text-slate-850 dark:text-slate-100">{item.value} kg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gamification, Challenges, and active roadmap items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Goals Brief Tracker */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-display font-bold">Goal Targets</h3>
              <p className="text-xs text-slate-400">Carbon offset metrics and progress</p>
            </div>
            <button 
              onClick={() => onNavigate('goals')}
              className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center space-x-1"
              id="dashboard_all_goals"
            >
              <span>Manage Goals</span>
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No active goals yet. Launch a smart AI goal plan to begin!
            </div>
          ) : (
            <div className="space-y-4.5">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="p-4 bg-slate-50/75 dark:bg-slate-900/60 rounded-2xl border border-slate-200/25 dark:border-slate-800/50 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{goal.title}</h4>
                      <span className="text-[10px] font-mono uppercase bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400">
                        {goal.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-500 font-mono">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-250 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Challenges Brief List */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-display font-bold">Eco Challenges</h3>
              <p className="text-xs text-slate-400">Unlock Points and climb leaderboards</p>
            </div>
            <button 
              onClick={() => onNavigate('challenges')}
              className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center space-x-1"
              id="dashboard_all_challenges"
            >
              <span>Join Challenges</span>
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="space-y-3">
            {challenges.slice(0, 3).map((challenge) => (
              <div 
                key={challenge.id}
                className="flex items-center justify-between p-3.5 bg-slate-50/75 dark:bg-slate-900/60 rounded-2xl border border-slate-200/25 dark:border-slate-800/50"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className={`p-2 rounded-xl ${challenge.completed ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="truncate">
                    <p className={`text-sm font-semibold truncate ${challenge.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {challenge.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">{challenge.duration} • category: {challenge.category}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center text-xs font-bold font-mono text-emerald-500">
                    +{challenge.points} PTS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
