/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { useApp } from './AppContext';
import { CoachMessage } from '../types';
import { Send, Sparkles, User, HelpCircle, Flame, Leaf, Loader2 } from 'lucide-react';

export default function CoachChat() {
  const { user, calculations } = useApp();
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: "init",
      sender: "ai",
      text: "Hello! I am your personal **Ecoventra Coach**. I understand your sustainability profile and local carbon emission history. Ask me anything about diet optimization, electric utility savings, or carbon offset plans!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts
  const suggestPrompts = [
    "I drive 15 km daily to work. How do I optimize?",
    "Show me 5 rapid actions to lower my home electricity bill",
    "How does a vegan diet affect my carbon score?",
    "Explain standard carbon offset credits or equivalents"
  ];

  // Auto Scroll to Bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: CoachMessage = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Package calculations context to make the coach contextual
      const latestCalc = calculations[0];
      const userContext = latestCalc ? {
        carbonScore: latestCalc.carbonScore,
        monthlyEmissions: latestCalc.totalEmissions,
        diet: latestCalc.inputs.dietType
      } : null;

      const response = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: CoachMessage = {
          id: `msg_ai_${Date.now()}`,
          sender: "ai",
          text: data.text || "I was unable to complete this analysis. Let us try again.",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error();
      }
    } catch (err) {
      const errorMsg: CoachMessage = {
        id: `msg_err_${Date.now()}`,
        sender: "ai",
        text: "My server is currently offline or the request expired. Make sure your `GEMINI_API_KEY` is fully declared on the Secrets side in your build panel. Contact support if problem persists!",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[610px] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between animate-fade-in">
      
      {/* Header Info */}
      <div className="p-5 border-b border-slate-150 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-emerald-500 to-cyan-400 p-2.5 rounded-2xl text-white">
            <Sparkles className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-display font-bold text-slate-900 dark:text-white">AI Sustainability Coach</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Gemini-3.5-Flash Active (Context-Aware)</p>
          </div>
        </div>
        
        {/* Quick parameters readout */}
        {calculations[0] && (
          <div className="hidden sm:flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-500">
            <Leaf className="h-3.5 w-3.5" />
            <span>Score: {calculations[0].carbonScore}/100</span>
          </div>
        )}
      </div>

      {/* Messages Scrolling Container */}
      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-3 max-w-[85%] ${!isAi ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                isAi ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-850 text-slate-500'
              }`}>
                {isAi ? <Sparkles className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
              </div>

              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                isAi 
                  ? 'bg-slate-50 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200 border border-slate-200/30 dark:border-slate-800/40' 
                  : 'bg-emerald-500 text-slate-950 font-medium'
              }`}>
                {/* Minimalist markdown support replacement helper for bold lines */}
                {msg.text.split('\n').map((line, index) => {
                  // Quick string bold converter (**text** to <strong>text</strong>)
                  const replaced = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  return (
                    <p 
                      key={index} 
                      className={index > 0 ? "mt-2" : ""}
                      dangerouslySetInnerHTML={{ __html: replaced }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Typing Loader */}
        {isTyping && (
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 animate-pulse">
              <Sparkles className="h-4.5 w-4.5 animate-spin" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200/25 dark:border-slate-800/20 px-4 py-3 rounded-2xl text-xs text-slate-450 dark:text-slate-500 font-mono flex items-center space-x-2">
              <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
              <span>Coaching algorithms running predictions on footprint factors...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompting chips */}
      {messages.length === 1 && (
        <div className="px-5 pb-2">
          <p className="text-[10px] uppercase font-mono text-slate-400 mb-2">Suggested prompts</p>
          <div className="flex flex-wrap gap-2">
            {suggestPrompts.map((p, index) => (
              <button
                key={index}
                onClick={() => handleSend(p)}
                className="text-xs bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 px-4 py-2 border border-slate-200/50 dark:border-slate-800/80 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-left transition-all max-w-full truncate"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input controls panel */}
      <div className="p-5 border-t border-slate-150 dark:border-slate-850">
        <div className="flex items-center space-x-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask anything about minimizing your footprint..."
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600"
            id="coach_input_field"
          />
          <button
            onClick={() => handleSend(input)}
            className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-955 rounded-xl font-bold transition-transform active:scale-95"
            id="coach_send_button"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
