/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useApp } from './AppContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Download, Printer, Leaf, Globe, TrendingDown, Clock, HelpCircle, Trophy } from 'lucide-react';

export default function ReportsCenter() {
  const { user, calculations, goals, challenges, bills } = useApp();

  // Pick calculation stats
  const latestCalc = calculations[0] || {
    carbonScore: 75,
    totalEmissions: 410,
    annualForecast: 4.92,
    categoryBreakdown: { transport: 150, energy: 180, food: 60, shopping: 20 }
  };

  const trendData = [...calculations].reverse().map(c => ({
    date: new Date(c.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    Emissions: c.totalEmissions,
    Score: c.carbonScore
  }));

  const chartData = trendData.length > 0 ? trendData : [
    { date: "Apr 10", Emissions: 590, Score: 52 },
    { date: "May 10", Emissions: 490, Score: 64 },
    { date: "Jun 09", Emissions: 370, Score: 78 }
  ];

  // Printable layout trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in print:p-0 print:border-none print:shadow-none">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Sustainability Audit Report</h1>
          <p className="text-sm text-slate-450 dark:text-slate-400">Export carbon analytics, compliance trends, and accomplishment portfolios.</p>
        </div>
        
        <div className="flex space-x-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 border border-slate-250 dark:border-slate-800 rounded-xl font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-650 dark:text-slate-300 flex items-center space-x-1.5 transition-all"
            id="print_report_button"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Report Document wrapper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 space-y-8 shadow-xl print:border-none print:p-0 print:shadow-none">
        
        {/* Document Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-emerald-500 fill-current" />
              <span className="font-display font-black text-2xl tracking-tight text-slate-900 dark:text-white">ECOVENTRA ANALYTICS</span>
            </div>
            <p className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold">Standard Planetary Verification Audit</p>
          </div>

          <div className="text-left md:text-right text-xs font-mono text-slate-450">
            <p><strong>REPORT ID:</strong> ECO_RE_3A0C88E</p>
            <p><strong>ISSUED AT:</strong> 2026-06-09T17:40Z</p>
            <p><strong>AUDITEE:</strong> {user?.displayName || "climate_pioneer"}</p>
          </div>
        </div>

        {/* Executive calculations overview */}
        <div className="space-y-4">
          <h2 className="text-base font-display font-black uppercase text-slate-400 font-mono tracking-wider">I. Executive Footprint Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/30 dark:border-slate-850/60 rounded-2xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Carbon Rating Code</span>
              <p className="text-2xl font-display font-black text-emerald-500 mt-1">CLASS A-CLEAN</p>
              <p className="text-[10px] text-slate-450 mt-1">Ecoventra Carbon Score: {latestCalc.carbonScore}/100</p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/30 dark:bg-slate-850/60 rounded-2xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Accumulated Emissions</span>
              <p className="text-2xl font-display font-black text-slate-850 dark:text-slate-100 mt-1 font-mono">
                {latestCalc.totalEmissions} kgCO2
              </p>
              <p className="text-[10px] text-slate-450 mt-1">Measured monthly carbon inputs</p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/30 dark:bg-slate-850/60 rounded-2xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Net Annual Offset Goal</span>
              <p className="text-2xl font-display font-black text-emerald-500 mt-1 font-mono">
                {latestCalc.annualForecast} T
              </p>
              <p className="text-[10px] text-slate-450 mt-1">Projected planetary greenhouse metrics</p>
            </div>
          </div>
        </div>

        {/* Categories Details */}
        <div className="space-y-4">
          <h2 className="text-base font-display font-black uppercase text-slate-400 font-mono tracking-wider">II. Category Audit Allocations</h2>
          
          <table className="w-full text-left text-xs text-slate-500 dark:text-slate-405 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2">Category Sector</th>
                <th className="py-2 text-right">Current Weight (kgCO2)</th>
                <th className="py-2 text-right">Status Code</th>
                <th className="py-2 text-right">Action Threshold</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Transports Commute (ICE/Metro)", val: latestCalc.categoryBreakdown.transport, status: "OPTIMUM", thresh: "< 250 kg" },
                { name: "Electric Grid Utility Utilities", val: latestCalc.categoryBreakdown.energy, status: "MONITOR", thresh: "< 200 kg" },
                { name: "Planetary Diet Nutrition Value", val: latestCalc.categoryBreakdown.food, status: "CLEAN", thresh: "< 150 kg" },
                { name: "Consumer Shipping Acquisitions", val: latestCalc.categoryBreakdown.shopping, status: "OPTIMUM", thresh: "< 100 kg" }
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800/40">
                  <td className="py-3 font-semibold text-slate-700 dark:text-slate-350">{row.name}</td>
                  <td className="py-3 text-right font-mono text-slate-900 dark:text-white font-bold">{row.val}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      row.status === 'OPTIMUM' || row.status === 'CLEAN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-slate-400">{row.thresh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts in print */}
        <div className="space-y-4 pt-4">
          <h2 className="text-base font-display font-black uppercase text-slate-400 font-mono tracking-wider">III. Historical Metric Trend</h2>
          
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Area type="monotone" dataKey="Emissions" stroke="#10B981" strokeWidth={2.5} fill="url(#colorReport)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accomplishment portfolios */}
        <div className="space-y-4 pt-4">
          <h2 className="text-base font-display font-black uppercase text-slate-400 font-mono tracking-wider">IV. Achievements & Compliances</h2>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/15 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs flex items-start space-x-3">
            <Trophy className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Planetary Achievement Target Cleared</p>
              <p className="mt-0.5 opacity-85 leading-relaxed">
                The auditee has cleared a total of {challenges.filter(c => c.completed).length} active platform ecosystem challenges, securing an overall score level of {user?.level || 1}!
              </p>
            </div>
          </div>
        </div>

        {/* Report Signoff */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-7 flex justify-between items-end">
          <div className="text-left font-mono">
            <p className="text-[10px] text-slate-400">Ecoventra Carbon Rating Authority</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 mt-1">EMERALD VALIDATED</p>
          </div>
          <div className="text-right font-mono text-[9px] text-slate-450 italic">
            Certified matching greenhouse gas protocol scopes 1, 2, 3 calculations parameters
          </div>
        </div>

      </div>

    </div>
  );
}
