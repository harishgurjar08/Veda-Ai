'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '../../../components/Sidebar';
import { Header } from '../../../components/Header';
import { useJobSocket } from '../../../hooks/useJobSocket';
import { 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';

const STAGES = [
  { text: "Analyzing your requirements...", min: 0 },
  { text: "Crafting question structure...", min: 20 },
  { text: "Generating questions with AI...", min: 45 },
  { text: "Organizing sections & difficulty...", min: 75 },
  { text: "Finalizing your question paper...", min: 90 }
];

export default function GeneratingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { stage, percentage, status, error } = useJobSocket({ assignmentId: id });

  useEffect(() => {
    if (status === 'completed') {
      const timer = setTimeout(() => {
        router.push(`/paper/${id}`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, id, router]);

  const handleRetry = () => {
    // Reset page by calling backend regenerate endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${apiUrl}/api/assignments/${id}/regenerate`, { method: 'POST' })
      .then(() => window.location.reload())
      .catch(err => console.error('Failed to trigger regeneration:', err));
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-[#1E293B]">
      {/* Reusable Sidebar Component */}
      <Sidebar />

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header title="Generating Assessment" />

        <div className="flex-1 p-6 max-w-xl w-full mx-auto flex flex-col items-center justify-center min-h-[80vh] space-y-8">
          
          {error ? (
            /* --- FAILURE STATE --- */
            <div className="bg-white rounded-3xl border border-red-200 shadow-xl p-8 w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-red-500 mx-auto shadow-sm">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-[#1E293B] tracking-tight">Generation Failed</h3>
                <p className="text-xs font-semibold text-[#64748B] leading-relaxed">
                  We encountered an error while communicating with the AI service. Don't worry, your requirements are saved!
                </p>
                <div className="p-3 bg-red-50/50 rounded-xl text-[10px] font-bold text-red-600 border border-red-100 max-h-24 overflow-y-auto mt-2">
                  {error}
                </div>
              </div>
              <button
                onClick={handleRetry}
                className="px-6 py-3.5 bg-gradient-to-r from-[#FF5E36] to-[#FFA07A] hover:opacity-95 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF5E36]/15 hover:shadow-[#FF5E36]/25 transition-all duration-200 active:scale-95 text-xs mx-auto"
              >
                <RefreshCw className="w-4 h-4 animate-spin-reverse" />
                Retry AI Generation
              </button>
            </div>
          ) : (
            /* --- GENERATING / PROCESSING STATE --- */
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-8 w-full space-y-8">
              
              <div className="text-center space-y-2">
                <div className="inline-flex p-2 bg-[#FFECEB] text-[#FF5E36] rounded-xl font-bold text-[10px] items-center gap-1.5 animate-pulse uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI ASSISTED CREATOR
                </div>
                <h3 className="text-xl font-extrabold text-[#1E293B] tracking-tight">
                  {status === 'completed' ? 'Generation Complete!' : 'Creating Assessment...'}
                </h3>
                <p className="text-xs font-semibold text-[#64748B]">
                  Sit tight! Our AI is drafting your exam questions.
                </p>
              </div>

              {/* Central Glowing Circle Progress animation */}
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                
                {/* Glowing Background Glows */}
                <div className="absolute inset-0 bg-[#FF5E36]/5 rounded-full scale-110 blur-xl animate-pulse" />
                
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#F1F5F9"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="url(#progress-gradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - percentage / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF5E36" />
                      <stop offset="100%" stopColor="#FFA07A" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Percentage readout in center */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
                    {percentage}%
                  </span>
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    {status === 'completed' ? 'Done' : 'Progress'}
                  </span>
                </div>
              </div>

              {/* Active Stage Banner */}
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#FF5E36] shrink-0 shadow-sm">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Current Stage</p>
                  <p className="text-xs font-extrabold text-[#1E293B] truncate">{stage}</p>
                </div>
              </div>

              {/* Stage Checklist */}
              <div className="space-y-3 pt-4 border-t border-[#F1F5F9]">
                {STAGES.map((s, idx) => {
                  const isDone = percentage > s.min;
                  const isCurrent = percentage >= s.min && (idx === STAGES.length - 1 || percentage < STAGES[idx + 1].min);
                  
                  return (
                    <div 
                      key={s.text} 
                      className={`flex items-center justify-between py-1 transition-all duration-200 ${
                        isDone ? 'opacity-100' : isCurrent ? 'opacity-100 font-extrabold text-[#FF5E36]' : 'opacity-40'
                      }`}
                    >
                      <span className="text-xs font-semibold">{s.text}</span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-3.5 h-3.5 border-2 border-[#FF5E36]/30 border-t-[#FF5E36] rounded-full animate-spin shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-[#CBD5E1] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
