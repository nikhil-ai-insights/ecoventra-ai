/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Upload, FileText, CheckCircle2, ChevronRight, Sparkles, Loader2, DollarSign, Zap } from 'lucide-react';
import { BillAnalysis } from '../types';

export default function BillAnalyzerWidget() {
  const { bills, analyzeBill } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedBill, setSelectedBill] = useState<BillAnalysis | null>(null);

  // File Upload base64 generator
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    setErrorMessage("");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      try {
        const result = await analyzeBill(base64String, file.name, file.type || "image/png");
        setSelectedBill(result);
      } catch (err) {
        setErrorMessage("Failed to analyze bill. Make sure your GEMINI_API_KEY is defined in settings.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Could not read uploaded system file template.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Preset quick demonstration utility
  const runDemoBill = async () => {
    setIsUploading(true);
    setErrorMessage("");
    try {
      // Simulate base64 for dummy demo bill
      const dummyBase64 = "UklGRiQAAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMwAgSSNtuyIDgU8P4HGAETgNMA";
      const result = await analyzeBill(dummyBase64, "electric_bill_june.png", "image/png");
      setSelectedBill(result);
    } catch (err) {
      setErrorMessage("Demo calculation timeout. Configure API secrets on settings.");
    } finally {
      setIsUploading(false);
    }
  };

  const activeBillDisplay = selectedBill || bills[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl font-display font-extrabold tracking-tight">AI Utility Bill Parser</h1>
        <p className="text-sm text-slate-450 dark:text-slate-400">
          Upload electricity bills or fuel receipts. Gemini Vision automatically extracts units, costs, and carbon outputs to deliver optimization roadmaps!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Upload Frame (Left col) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* File input drag and drop target container */}
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 hover:border-emerald-500/80 transition-all text-center flex flex-col items-center justify-center space-y-4"
          >
            <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Drag & drop bill here</p>
              <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, or PDF files</p>
            </div>
            
            <label className="cursor-pointer bg-slate-950 text-white dark:bg-emerald-500 dark:text-slate-950 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
              <span>Select File</span>
              <input 
                type="file" 
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="hidden" 
              />
            </label>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/85 w-full flex items-center justify-center">
              <button 
                onClick={runDemoBill}
                className="text-xs font-semibold text-emerald-500 hover:text-emerald-400"
                id="demo_bill_analyzer"
              >
                Or Try Demo Bill
              </button>
            </div>
          </div>

          {/* Loader status */}
          {isUploading && (
            <div className="p-5 bg-slate-900 border border-slate-700/20 text-white rounded-3xl flex flex-col items-center space-y-3 shadow-md">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
              <p className="text-xs font-semibold">Gemini parsing active...</p>
              <span className="text-[10px] text-slate-400 text-center">Reading meters and running carbon forecasting computations</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-500">
              {errorMessage}
            </div>
          )}

          {/* History tracker list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 space-y-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-display font-bold">Analysis History</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-450 dark:text-slate-400">
                {bills.length} bills
              </span>
            </div>

            {bills.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No bills analysed yet.</p>
            ) : (
              <div className="space-y-2">
                {bills.map((bill) => (
                  <button
                    key={bill.id}
                    onClick={() => setSelectedBill(bill)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors text-left border ${
                      activeBillDisplay?.id === bill.id 
                        ? 'border-emerald-500 ring-1 ring-emerald-500/15' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <FileText className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{bill.fileName}</p>
                        <p className="text-[9px] text-slate-400 font-mono capitalize">{bill.extractedData.billType} • {bill.extractedData.units} Units</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold font-mono text-emerald-500 shrink-0">
                      +{bill.carbonImpact} kg
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Audit Results (Right col) */}
        <div className="md:col-span-3">
          {activeBillDisplay ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in shadow-md">
              
              {/* Header metrics parsed */}
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-500/15">
                    Parsed: {activeBillDisplay.extractedData.billType}
                  </span>
                  <h2 className="text-xl font-display font-black text-slate-900 dark:text-white mt-2">
                    {activeBillDisplay.fileName}
                  </h2>
                  <p className="text-xs text-slate-450 dark:text-slate-500">Audited {new Date(activeBillDisplay.uploadedAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-2xl flex items-center space-x-1.5 text-emerald-500 text-xs font-bold font-mono animate-pulse">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Verified +150 PTS</span>
                </div>
              </div>

              {/* Data Blocks */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl">
                  <span className="text-[10px] uppercase font-mono text-slate-450 dark:text-slate-505 block">Charged cost</span>
                  <p className="text-lg md:text-xl font-display font-extrabold text-slate-900 dark:text-white mt-1 flex items-center">
                    <DollarSign className="h-4 w-4 text-slate-450 mr-0.5" />
                    {activeBillDisplay.extractedData.cost}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl">
                  <span className="text-[10px] uppercase font-mono text-slate-450 dark:text-slate-505 block">Units Consumed</span>
                  <p className="text-lg md:text-xl font-display font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                    {activeBillDisplay.extractedData.units}
                  </p>
                </div>

                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                  <span className="text-[10px] uppercase font-mono text-rose-500/70 block">Carbon Weight</span>
                  <p className="text-lg md:text-xl font-display font-extrabold text-rose-500 mt-1 font-mono">
                    {activeBillDisplay.carbonImpact} kg
                  </p>
                </div>
              </div>

              {/* AI Suggestions / Recommendations */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4.5 w-4.5 text-emerald-500 animate-spin" />
                  <h3 className="text-sm font-display font-bold">AI Recommended Actions</h3>
                </div>

                <div className="space-y-3.5 pt-1">
                  {activeBillDisplay.suggestions.map((s, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-855 flex items-start space-x-3 hover:border-emerald-500/50 transition-colors"
                    >
                      <span className="h-5.5 w-5.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-300">
                        {s}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/50 flex flex-col items-center justify-center p-8 text-center text-slate-450">
              <FileText className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-350">No Audited Bill Open</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Upload your latest utility bill to unlock automated data extractions and custom AI suggestions!
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
