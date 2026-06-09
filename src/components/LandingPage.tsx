/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Leaf, Award, Shield, Sparkles, Zap, Flame, Globe, ChevronRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onTryDemo: () => void;
}

export default function LandingPage({ onLoginClick, onTryDemo }: LandingPageProps) {
  
  const features = [
    {
      title: "AI carbon tracker",
      desc: "Instantly calculate footprints across Commutes, aviation, nutrition, fashion and retail segments.",
      icon: LaserCompassIcon
    },
    {
      title: "Vision Bill Analyzer",
      desc: "Drag utility bills and invoices. Gemini extracts quantities, costs, and carbon weights automatically.",
      icon: ShieldIcon
    },
    {
      title: "Adaptive AI coaching",
      desc: "Consult our expert Gemini Coach anytime for direct habit corrections and customized roadmap micro-tasks.",
      icon: SparkIcon
    },
    {
      title: "Gamified reward arena",
      desc: "Participate in active weekly challenges, collect EcoPoints, unlock achievements, and gain ranks on global leaderboards.",
      icon: BadgeIcon
    }
  ];

  const stats = [
    { value: "48,000+", label: "Climate Pioneers" },
    { value: "3.2M kg", label: "CO2 Emissions Reduced" },
    { value: "140,000+", label: "Verified Offset Trees equivalent" },
    { value: "94.2%", label: "Planetary habit conversion score" }
  ];

  const faqs = [
    { q: "How is my carbon score computed?", a: "We utilize greenhouse gas protocol methodologies, allocating specific Scope 1-3 multipliers to transport distance, electricity outputs, nutrition values, and fast fashion purchases." },
    { q: "What does the AI Coaching specialize in?", a: "Our AI is backed by Gemini, trained on expert sustainability directives. It reviews your history to compile micro-adjustments specific to your real metrics." },
    { q: "How do I claim EcoPoints or badges?", a: "Simply calculate your footprint, upload utility bills, or tick completed steps under goals. Achievements instantly unlock points and custom badge cabinet credits!" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-24 py-8 px-4 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12 md:py-20 relative overflow-hidden" id="hero_section">
        
        {/* Abstract futuristic background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 backdrop-blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 px-4.5 py-1.5 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-450 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 fill-current animate-pulse text-emerald-500" />
            <span>AI climate-tech is here</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight leading-tight">
            Know Your Impact. <br />
            <span className="text-gradient">Shape the Future.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ecoventra uses advanced AI models to help individuals, pioneers, and investors understand, track, reduce, and offset their carbon footprint through gamification and intelligence audits.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={onLoginClick}
            className="px-8 py-3.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/10 transform hover:-translate-y-0.5 transition-all"
            id="hero_get_started"
          >
            Get Started Free
          </button>
          
          <button
            onClick={onTryDemo}
            className="px-8 py-3.5 bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900 hover:bg-slate-100 text-slate-800 dark:text-white rounded-2xl font-bold text-sm shadow-sm transition-all"
            id="hero_try_demo"
          >
            Try Demo Account
          </button>
        </div>

        {/* Floating statistics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/50 dark:bg-slate-900/40 backdrop-blur border border-slate-200/50 dark:border-slate-800/80 rounded-3xl mt-12 max-w-5xl mx-auto shadow-md">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-400">{stat.value}</div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Showcase Grid Section */}
      <section className="space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">The Ecosystem Platform</h2>
          <p className="text-xs sm:text-sm text-slate-500">Every tech optimization block built into Ecoventra to enforce real carbon-reductions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i}
                className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 shadow-md flex items-start space-x-5 hover:border-emerald-500/20 transition-all group"
              >
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:bg-gradient-to-tr group-hover:from-emerald-500 group-hover:to-cyan-400 group-hover:text-white transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-base md:text-lg select-none capitalize">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive testimonials or facts block */}
      <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-850 dark:from-slate-900 dark:to-slate-950 border border-slate-700/10 relative overflow-hidden text-center text-white space-y-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <Globe className="h-10 w-10 text-emerald-400 mx-auto fill-current animate-pulse" />
          <h3 className="text-2xl font-display font-black">"Track Today. Transform Tomorrow."</h3>
          <p className="text-xs md:text-sm text-slate-350 italic leading-relaxed">
            "Before launching Ecoventra, optimizing electricity bills felt incomprehensible. The auto AI bill OCR extraction parses consumption stats and delivers realistic milestones. Our team carbon score rose to 84/100 within simple audit quarters."
          </p>
          <div className="pt-2">
            <span className="text-xs font-mono font-bold text-emerald-400">— Techstars Hackathon Review, 2026</span>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="space-y-12 max-w-3xl mx-auto">
        <h3 className="text-2xl font-display font-black text-center tracking-tight">Ecosystem FAQs</h3>
        
        <div className="space-y-4.5">
          {faqs.map((faq, index) => (
            <div key={index} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{faq.q}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800/40 mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/85 pt-8 pb-4 text-center text-xs text-slate-400 font-mono space-y-3">
        <div className="flex justify-center space-x-2.5 items-center">
          <Leaf className="h-4.5 w-4.5 text-emerald-500 fill-current" />
          <span className="font-sans font-extrabold tracking-tight text-slate-800 dark:text-white">Ecoventra SaaS</span>
        </div>
        <p className="text-[10px]">&copy; 2026 Ecoventra SaaS. Built safely utilizing Gemini server-side models.</p>
      </footer>

    </div>
  );
}

// Minimalist local icons for showcase
function LaserCompassIcon(props: any) {
  return <Leaf {...props} />;
}
function ShieldIcon(props: any) {
  return <Shield {...props} />;
}
function SparkIcon(props: any) {
  return <Sparkles {...props} />;
}
function BadgeIcon(props: any) {
  return <Award {...props} />;
}
