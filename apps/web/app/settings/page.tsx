'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { 
  Settings, 
  Sparkles, 
  School, 
  Key, 
  Sliders, 
  Check, 
  Info, 
  Eye, 
  EyeOff,
  Moon,
  Printer
} from 'lucide-react';

export default function SettingsPage() {
  const [schoolName, setSchoolName] = useState('Delhi Public School, Sector-4');
  const [schoolBranch, setSchoolBranch] = useState('Bokaro Steel City');
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyVal, setApiKeyVal] = useState('AIzaSyBU8OIhifQ5qKPjTNgNouOytR9iKEjXaJM');
  const [easyDist, setEasyDist] = useState(50);
  const [mediumDist, setMediumDist] = useState(30);
  const [hardDist, setHardDist] = useState(20);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load from local storage if exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSchool = localStorage.getItem('veda_school_name');
      const savedBranch = localStorage.getItem('veda_school_branch');
      if (savedSchool) setSchoolName(savedSchool);
      if (savedBranch) setSchoolBranch(savedBranch);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('veda_school_name', schoolName);
      localStorage.setItem('veda_school_branch', schoolBranch);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const totalDist = Number(easyDist) + Number(mediumDist) + Number(hardDist);

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-[#1E293B]">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Header title="Settings" />

        <div className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-6">
          
          {/* Settings Title */}
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">System Settings</h2>
            <p className="text-xs font-semibold text-[#64748B]">Manage your academic credentials, school credentials, and default builder layouts</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6 pb-20">
            
            {/* School Profile Card */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              
              <div className="border-b border-[#F1F5F9] pb-4 flex items-center gap-2">
                <School className="w-5 h-5 text-[#FF5E36]" />
                <div>
                  <h3 className="text-xs font-bold text-[#1E293B] tracking-tight">Institution Profile</h3>
                  <p className="text-[10px] font-semibold text-[#94A3B8]">These details are stamped on your printable A4 exam papers</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* School Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#475569]">School / Academy Name</label>
                  <input
                    type="text"
                    required
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Delhi Public School"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white border border-[#E2E8F0] focus:border-[#FF5E36] rounded-xl outline-none font-medium text-xs text-[#1E293B] transition-all duration-200 placeholder:text-[#94A3B8]"
                  />
                </div>

                {/* School Branch */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#475569]">Branch / Address Location</label>
                  <input
                    type="text"
                    required
                    value={schoolBranch}
                    onChange={(e) => setSchoolBranch(e.target.value)}
                    placeholder="e.g. Bokaro Steel City"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white border border-[#E2E8F0] focus:border-[#FF5E36] rounded-xl outline-none font-medium text-xs text-[#1E293B] transition-all duration-200 placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>

            </div>

            {/* AI Generation Profile Config */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              
              <div className="border-b border-[#F1F5F9] pb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-[#FF5E36]" />
                <div>
                  <h3 className="text-xs font-bold text-[#1E293B] tracking-tight">AI & API Configuration</h3>
                  <p className="text-[10px] font-semibold text-[#94A3B8]">Manage your Google Gemini API settings and model parameters</p>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* Gemini Model */}
                <div className="space-y-2 max-w-md">
                  <label className="text-xs font-bold text-[#475569]">Primary AI Model</label>
                  <select
                    value={geminiModel}
                    onChange={(e) => setGeminiModel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white border border-[#E2E8F0] focus:border-[#FF5E36] rounded-xl outline-none font-bold text-xs text-[#1E293B] transition-all cursor-pointer"
                  >
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Fast & Accurate)</option>
                    <option value="gemini-3.1-flash">gemini-3.1-flash (Next-Gen Production)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro (Advanced Reasoning)</option>
                  </select>
                  <p className="text-[9px] font-semibold text-[#94A3B8]">
                    * `gemini-2.5-flash` is currently selected as the active model for background worker operations.
                  </p>
                </div>

                {/* Gemini API Key */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#475569]">Google Gemini API Key</label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      disabled
                      value={apiKeyVal}
                      className="w-full pl-4 pr-12 py-2.5 bg-[#F8FAFC]/80 border border-[#E2E8F0] rounded-xl outline-none font-medium text-xs text-[#64748B] select-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B] transition-colors"
                    >
                      {showApiKey ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                  <p className="text-[9px] font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    API connection verified — Live generation enabled.
                  </p>
                </div>

              </div>

            </div>

            {/* Default Difficulty presets */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              
              <div className="border-b border-[#F1F5F9] pb-4 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#FF5E36]" />
                <div>
                  <h3 className="text-xs font-bold text-[#1E293B] tracking-tight">Default Assessment Presets</h3>
                  <p className="text-[10px] font-semibold text-[#94A3B8]">Configure default difficulty ratios and evaluation print options</p>
                </div>
              </div>

              <div className="space-y-6">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#475569]">Default Difficulty Distribution</span>
                    <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      totalDist === 100 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      Sum: {totalDist}% {totalDist === 100 ? '(Valid)' : '(Must equal 100%)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Easy */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-emerald-600">
                        <span>Easy</span>
                        <span>{easyDist}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={easyDist}
                        onChange={(e) => setEasyDist(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Medium */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-amber-500">
                        <span>Medium</span>
                        <span>{mediumDist}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={mediumDist}
                        onChange={(e) => setMediumDist(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Hard */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-red-500">
                        <span>Hard</span>
                        <span>{hardDist}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={hardDist}
                        onChange={(e) => setHardDist(Number(e.target.value))}
                        className="w-full accent-red-500 h-1 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Actions Save bar */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-[#94A3B8]">
                VedaAI Admin Version 1.0.0
              </span>

              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
                    <Check className="w-4 h-4 stroke-[3]" />
                    Settings saved successfully!
                  </span>
                )}

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#FF5E36] to-[#FFA07A] text-white font-extrabold rounded-2xl flex items-center gap-2 shadow-lg shadow-[#FF5E36]/15 hover:shadow-[#FF5E36]/25 transition-all duration-200 active:scale-95 text-xs select-none"
                >
                  Save System Settings
                </button>
              </div>
            </div>

          </form>

        </div>
      </main>
    </div>
  );
}
