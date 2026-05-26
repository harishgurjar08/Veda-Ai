'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { 
  Wrench, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  TrendingUp, 
  ArrowRight, 
  Check, 
  Copy,
  Info,
  Download,
  Share2
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  placeholder: string;
  actionText: string;
  sampleOutput: string;
}

export default function ToolkitPage() {
  const [activeToolId, setActiveToolId] = useState<string>('quiz');
  const [inputVal, setInputVal] = useState<string>('');
  const [outputVal, setOutputVal] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const tools: Tool[] = [
    {
      id: 'quiz',
      name: 'AI Quiz Creator',
      description: 'Generate high-quality, quick evaluation quizzes on any educational topic.',
      icon: HelpCircle,
      color: 'from-[#FF5E36] to-[#FFA07A]',
      placeholder: 'e.g., Photosynthesis class 7th, 5 questions',
      actionText: 'Draft Quiz Questions',
      sampleOutput: `📖 QUIZ: PHOTOSYNTHESIS (CLASS 7th)
Total Marks: 10 | Duration: 15 Mins

Q1. What is the primary pigment responsible for absorbing light in photosynthesis?
A. Carotene
B. Chlorophyll
C. Xanthophyll
D. Anthocyanin
👉 Correct Answer: B. Chlorophyll (absorbs blue and red light spectrums)

Q2. Which of the following is a byproduct of the light-dependent reactions of photosynthesis?
A. Carbon Dioxide
B. Glucose
C. Oxygen
D. Water
👉 Correct Answer: C. Oxygen (produced via photolysis of water molecules)

Q3. [True / False] Photosynthesis can take place efficiently under pure green light.
👉 Correct Answer: False (Chlorophyll reflects green light, making it the least efficient wavelength)`
    },
    {
      id: 'syllabus',
      name: 'Syllabus Plan Generator',
      description: 'Structure custom week-by-week curriculum plans matching target grade standards.',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-400',
      placeholder: 'e.g., Algebra Grade 9 curriculum plan for 4 weeks',
      actionText: 'Map Curriculum Schedule',
      sampleOutput: `📅 4-WEEK CURRICULUM SYLLABUS: ALGEBRA (GRADE 9)

● WEEK 1: Foundations of Algebraic Expressions
- Variables, constants, coefficients, and operations.
- Translating verbal phrases to mathematical expressions.
- Formative Assessment: Weekly quiz on basic operations.

● WEEK 2: Linear Equations & Single-Variable Inequalities
- Solving multi-step equations (addition, multiplication properties).
- Graphing inequalities on a standard number line.
- Real-world application word problems.

● WEEK 3: Introduction to Linear Functions
- Understanding slope, y-intercept, and coordinate graphing.
- Slope-intercept form (y = mx + c) vs. standard form.
- Class Activity: Mapping real-world rates of change.

● WEEK 4: Systems of Linear Equations
- Solving systems using substitution and elimination methods.
- Graphic representations of intersecting vs. parallel lines.
- Review & End-of-Unit Summative Assessment.`
    },
    {
      id: 'comments',
      name: 'Report Comment Builder',
      description: 'Create professional, academically constructive report card comments for students.',
      icon: FileText,
      color: 'from-indigo-500 to-purple-400',
      placeholder: 'e.g., Harish, Grade 10, excels in math but needs to submit homework on time',
      actionText: 'Compose Report Remarks',
      sampleOutput: `📝 STUDENT ASSESSMENT REPORT COMMENTS

Student: Harish | Subject: Mathematics
Grade/Class: Grade 10 | Period: Term 1

● Academic Performance:
"Harish has shown an exceptional understanding of mathematical theories and algebraic concepts this term. He consistently demonstrates advanced critical thinking and completes analytical assignments with great accuracy."

● Areas for Growth:
"While Harish excels in high-level problem solving, he would benefit from maintaining a more disciplined routine regarding homework submissions. Ensuring all assignments are turned in punctually will help solidify his excellent academic progression."

● Teacher's Recommendation:
"I encourage Harish to continue participating actively in advanced group sessions, as his peers benefit from his insights."`
    },
    {
      id: 'predictor',
      name: 'Grade Predictor & Tracker',
      description: 'Assess student grades based on historical scores and homework submission counts.',
      icon: TrendingUp,
      color: 'from-pink-500 to-rose-400',
      placeholder: 'e.g., Midterm: 78%, Attendance: 95%, Homework missing: 2',
      actionText: 'Predict Grade Ratios',
      sampleOutput: `📊 GRADE PROGRESSION ANALYTICS & PREDICTION

● Student Metrics Summary:
- Historical Score Average: 78.0%
- Attendance Factor: 95.0% (Excellent participation)
- Missing Homework items: 2 (Moderate impact)

● AI Grade Prediction:
Target Grade: B+ (Probability Ratio: 87.2%)

● Constructive Insights:
1. Student exhibits strong knowledge retention during assessments, but missing assignments are shaving ~4% off their total potential grade percentage.
2. Increasing attendance to 98% and submitting the missing homework before the term deadline will boost the target prediction to an A- with a 92% confidence level.`
    }
  ];

  const activeTool = tools.find(t => t.id === activeToolId) || tools[0];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setIsGenerating(true);
    setOutputVal('');

    setTimeout(() => {
      setIsGenerating(false);
      setOutputVal(activeTool.sampleOutput);
    }, 1500);
  };

  const handleCopy = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToolChange = (id: string) => {
    setActiveToolId(id);
    setInputVal('');
    setOutputVal('');
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-[#1E293B]">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Header title="AI Teacher's Toolkit" />

        <div className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
          
          {/* Page Banner Details */}
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">AI Teacher's Toolkit</h2>
            <p className="text-xs font-semibold text-[#64748B]">Boost your classroom workflow using custom interactive academic tools</p>
          </div>

          {/* Core Layout Split columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left selector menu column */}
            <div className="space-y-3 lg:col-span-1">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Available Utilities</span>
              {tools.map((t) => {
                const isActive = t.id === activeToolId;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleToolChange(t.id)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-300 ${
                      isActive 
                        ? 'bg-white border-[#FF5E36] shadow-md shadow-[#FF5E36]/5 scale-[1.02]' 
                        : 'bg-white/80 border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1] shadow-sm'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${t.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                      <t.icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-xs font-bold text-[#1E293B]">{t.name}</h4>
                      <p className="text-[10px] font-medium text-[#64748B] leading-relaxed line-clamp-2">{t.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Interactive Form & Result Screen Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Form Input Box */}
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 space-y-5">
                
                <div className="flex items-center gap-3 border-b border-[#F1F5F9] pb-4">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${activeTool.color} text-white flex items-center justify-center shrink-0`}>
                    <activeTool.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-[#1E293B]">{activeTool.name} Input</h3>
                    <p className="text-[10px] font-semibold text-[#94A3B8]">Describe what you want the AI to draft</p>
                  </div>
                </div>

                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#475569]">Prompt / Instructions</label>
                    <input
                      type="text"
                      required
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder={activeTool.placeholder}
                      className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white border border-[#E2E8F0] focus:border-[#FF5E36] rounded-xl outline-none font-medium text-xs text-[#1E293B] transition-all placeholder:text-[#94A3B8]"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-bold text-[#94A3B8] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF5E36]" />
                      Generates dynamic response instantly
                    </span>

                    <button
                      type="submit"
                      disabled={isGenerating}
                      className={`px-5 py-2.5 bg-gradient-to-r ${activeTool.color} text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-[0.98] disabled:opacity-50`}
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Drafting...
                        </>
                      ) : (
                        <>
                          {activeTool.actionText}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>

              {/* Form Output Results Screen */}
              {(outputVal || isGenerating) && (
                <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                  
                  {/* Results Header Action Panel */}
                  <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-[#FF5E36]" />
                      <span className="text-xs font-extrabold text-[#1E293B]">AI Generated Draft</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleCopy}
                        disabled={!outputVal}
                        className="p-1.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] rounded-lg transition-colors shadow-sm text-xs font-bold flex items-center gap-1"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Draft
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Output content screen */}
                  <div className="p-6">
                    {isGenerating ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div className={`w-8 h-8 border-4 border-slate-100 border-t-[#FF5E36] rounded-full animate-spin`} />
                        <p className="text-[10px] font-bold text-[#64748B] animate-pulse">Consulting AI Knowledge engines...</p>
                      </div>
                    ) : (
                      <pre className="text-xs font-semibold text-[#334155] leading-relaxed whitespace-pre-wrap font-sans bg-[#F8FAFC] p-4.5 rounded-2xl border border-[#E2E8F0]">
                        {outputVal}
                      </pre>
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
