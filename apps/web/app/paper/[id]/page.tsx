'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '../../../components/Sidebar';
import { Header } from '../../../components/Header';
import axios from 'axios';
import { Assignment } from '../../../types';
import { 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Printer,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function PaperViewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const isPrintMode = searchParams.get('print') === 'true';

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAnswers, setShowAnswers] = useState(true);
  
  // Editable School Name inline
  const [schoolName, setSchoolName] = useState('Delhi Public School, Sector-4, Bokaro');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/assignments/${id}`);
      setAssignment(res.data);
      if (res.data.status === 'processing') {
        // If still processing, redirect back to generating page
        router.push(`/generating/${id}`);
      }
    } catch (err) {
      console.error('Failed to fetch assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      await axios.post(`${API_URL}/api/assignments/${id}/regenerate`);
      router.push(`/generating/${id}`);
    } catch (err) {
      console.error('Failed to regenerate:', err);
      setRegenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/paper/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex bg-[#F8FAFC] min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF5E36]/30 border-t-[#FF5E36] rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#64748B]">Loading your question paper...</p>
        </div>
      </div>
    );
  }

  if (!assignment || !assignment.generatedPaper) {
    return (
      <div className="flex bg-[#F8FAFC] min-h-screen items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h3 className="text-lg font-extrabold text-[#1E293B]">Paper Not Found</h3>
          <p className="text-xs font-semibold text-[#64748B]">This paper does not exist or has not finished generating.</p>
          <button 
            onClick={() => router.push('/assignments')}
            className="px-6 py-3 bg-[#FF5E36] text-white rounded-xl font-bold text-xs"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const paper = assignment.generatedPaper;

  // Print Mode Layout
  if (isPrintMode) {
    return (
      <div className="bg-white p-12 max-w-[21cm] mx-auto min-h-screen text-[#1E293B] font-serif leading-relaxed text-xs">
        {/* Print Stylesheet Hook */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body { background: white; color: black; font-family: serif; }
            .no-print { display: none; }
            .page-break { page-break-before: always; }
          }
          input { border: none !important; background: transparent !important; }
        `}} />

        {/* Paper Header */}
        <div className="text-center space-y-2 mb-8 border-b-2 border-slate-900 pb-6">
          <h2 className="text-base font-extrabold tracking-wide uppercase text-slate-800">
            {schoolName}
          </h2>
          <h1 className="text-xl font-black tracking-widest text-slate-900 my-1">
            EXAMINATION PAPER
          </h1>
          <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-700 pt-2">
            <div>Subject: {assignment.subject}</div>
            <div>Grade: {assignment.grade}</div>
            <div>Topic: {assignment.topic}</div>
            <div>Max Marks: {paper.totalMarks}</div>
            <div>Duration: {paper.duration}</div>
            <div>Date: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}</div>
          </div>
        </div>

        {/* Student Details Fields */}
        <div className="flex justify-between items-center gap-4 text-[11px] font-bold border-b border-slate-300 pb-4 mb-6">
          <div>Name: _______________________</div>
          <div>Roll No: __________________</div>
          <div>Section: _________________</div>
        </div>

        <p className="text-[10px] italic text-slate-600 mb-6">
          * All questions are compulsory unless stated otherwise.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          {paper.sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div className="border-y border-slate-800 py-1.5 font-bold uppercase tracking-wide text-xs">
                {section.title}
              </div>
              <p className="text-[10px] italic text-slate-600 mb-4">{section.instruction}</p>

              <div className="space-y-6">
                {section.questions.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <div className="flex justify-between items-start font-bold">
                      <span className="flex-1">
                        Q{q.number}. {q.text}
                      </span>
                      <span className="pl-6 shrink-0 text-[10px] font-semibold text-slate-700">
                        [{q.difficulty.toUpperCase()}] [{q.marks} Marks]
                      </span>
                    </div>

                    {/* MCQ Options list */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pl-6 pt-1 text-[10px]">
                        {q.options.map((opt) => (
                          <div key={opt}>{opt}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Answer key on separate print page if toggled */}
        {showAnswers && (
          <div className="page-break mt-12 pt-12 border-t-2 border-dashed border-slate-400">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-center border-b border-slate-800 pb-3 mb-6">
              Teacher Answer Key / Solutions
            </h3>
            <div className="space-y-6">
              {paper.sections.map((section) => (
                <div key={`ans-${section.id}`} className="space-y-4">
                  <h4 className="font-bold text-xs uppercase text-slate-700">{section.title}</h4>
                  <div className="space-y-3">
                    {section.questions.map((q) => (
                      <div key={`ans-q-${q.id}`} className="text-[10px]">
                        <span className="font-bold">Q{q.number}.</span> {q.answer || 'No solution provided.'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop Standard View Layout
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-[#1E293B] print:bg-white print:min-h-0">
      {/* Print Stylesheet Hook */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .question-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
        }
      `}} />

      {/* Reusable Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 print:bg-white">
        <Header title="Assessment Paper" />

        {/* Action Toolbar */}
        <div className="bg-white border-b border-[#E2E8F0] p-4 flex flex-wrap gap-4 items-center justify-between sticky top-16 z-20 shadow-sm print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="px-4 py-2 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1E293B] font-bold rounded-xl flex items-center gap-1.5 transition-all text-xs select-none active:scale-[0.98]"
            >
              {showAnswers ? (
                <>
                  <EyeOff className="w-4 h-4 text-[#FF5E36]" />
                  Hide Answer Key
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-[#94A3B8]" />
                  Show Answer Key
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1E293B] font-bold rounded-xl flex items-center gap-1.5 transition-all text-xs select-none active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#94A3B8]" />
                  Copy Link
                </>
              )}
            </button>

            {/* Regenerate */}
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="px-4 py-2 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1E293B] font-bold rounded-xl flex items-center gap-1.5 transition-all text-xs disabled:opacity-50 select-none active:scale-[0.98]"
            >
              <RefreshCw className={`w-4 h-4 text-[#94A3B8] ${regenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </button>

            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-gradient-to-r from-[#FF5E36] to-[#FFA07A] hover:opacity-95 text-white font-extrabold rounded-xl flex items-center gap-1.5 shadow-md shadow-[#FF5E36]/10 transition-all text-xs select-none active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Paper Sheet Wrapper */}
        <div className="flex-1 p-8 print:p-0 max-w-4xl print:max-w-none w-full mx-auto">
          {/* Green AI confirmation banner at the top of the paper */}
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-3 print:hidden">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
            <span>
              Certainly, Teacher! Here is your customized Question Paper for your {assignment.grade} {assignment.subject} classes on the {assignment.topic} chapter.
            </span>
          </div>

          {/* Actual Sheet representation */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-12 print:p-0 print:border-none print:shadow-none text-[#1E293B] min-h-[29.7cm] print:min-h-0 flex flex-col relative overflow-hidden print:overflow-visible">
            
            {/* Margins indicator subtle outline */}
            <div className="absolute inset-4 border border-dashed border-slate-100 rounded-2xl pointer-events-none" />

            {/* Editable School Banner */}
            <div className="text-center space-y-2 mb-8 border-b-2 border-[#1E293B] pb-6 relative z-10">
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full text-center font-extrabold text-sm tracking-wide uppercase text-[#475569] hover:bg-[#F8FAFC] border-none outline-none focus:bg-white rounded-lg p-1 transition-all"
                title="Click to edit school name"
              />
              <h1 className="text-2xl font-black tracking-widest text-[#1E293B] my-2 select-none">
                EXAMINATION PAPER
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[10px] font-bold text-[#64748B] border-t border-[#F1F5F9] max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-1">
                  <span>Subject:</span> <span className="text-[#1E293B]">{assignment.subject}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span>Grade:</span> <span className="text-[#1E293B]">{assignment.grade}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span>Topic:</span> <span className="text-[#1E293B] truncate">{assignment.topic}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span>Max Marks:</span> <span className="text-[#1E293B]">{paper.totalMarks}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span>Duration:</span> <span className="text-[#1E293B]">{paper.duration}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span>Date:</span> <span className="text-[#1E293B]">{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Student Info inputs styled as underlines */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-bold border-b border-[#F1F5F9] pb-5 mb-8 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] shrink-0">Name:</span>
                <input
                  type="text"
                  placeholder="_______________________"
                  className="w-full bg-transparent border-none outline-none text-[#1E293B] font-extrabold focus:placeholder:text-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] shrink-0">Roll No:</span>
                <input
                  type="text"
                  placeholder="__________________"
                  className="w-full bg-transparent border-none outline-none text-[#1E293B] font-extrabold focus:placeholder:text-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] shrink-0">Section:</span>
                <input
                  type="text"
                  placeholder="_________________"
                  className="w-full bg-transparent border-none outline-none text-[#1E293B] font-extrabold focus:placeholder:text-transparent"
                />
              </div>
            </div>

            {/* Assessment Content sections */}
            <div className="space-y-8 flex-1 relative z-10">
              {paper.sections.map((section) => (
                <div key={section.id} className="space-y-4">
                  
                  {/* Section Divider */}
                  <div className="border-b-2 border-dashed border-[#E2E8F0] pb-2">
                    <h3 className="font-extrabold text-sm uppercase tracking-wide text-[#1E293B]">
                      {section.title}
                    </h3>
                    <p className="text-[10px] font-semibold text-[#64748B] italic pt-0.5">
                      Instruction: {section.instruction}
                    </p>
                  </div>

                  {/* Section Questions */}
                  <div className="space-y-6">
                    {section.questions.map((q) => (
                      <div key={q.id} className="space-y-2 group/q question-item">
                        <div className="flex justify-between items-start font-bold text-xs">
                          <span className="flex-1 pr-6 text-[#1E293B]">
                            Q{q.number}. {q.text}
                          </span>
                          <div className="flex items-center gap-2 shrink-0 select-none">
                            {/* Color-coded Difficulty Badges */}
                            <span className={`text-[8px] px-2 py-0.5 font-extrabold rounded-full tracking-wider border ${
                              q.difficulty === 'easy' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                              q.difficulty === 'hard' ? 'bg-red-50 border-red-200 text-red-600' :
                              'bg-amber-50 border-amber-200 text-amber-600'
                            }`}>
                              {q.difficulty.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-bold text-[#64748B]">
                              [{q.marks} Marks]
                            </span>
                          </div>
                        </div>

                        {/* MCQ options list */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pl-6 pt-1 text-xs text-[#475569] font-medium">
                            {q.options.map((opt) => (
                              <div key={opt} className="hover:text-[#FF5E36] transition-colors cursor-default">
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

            {/* Answer key footer */}
            {showAnswers && (
              <div className="mt-16 pt-8 border-t-2 border-dashed border-[#E2E8F0] relative z-10 page-break">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-center border-b border-[#1E293B] pb-3 mb-6">
                  Teacher Answer Key / Solutions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {paper.sections.map((section) => (
                    <div key={`ans-gui-${section.id}`} className="space-y-3">
                      <h4 className="font-extrabold text-xs uppercase text-[#FF5E36]">
                        {section.title}
                      </h4>
                      <div className="space-y-2.5">
                        {section.questions.map((q) => (
                          <div key={`ans-gui-q-${q.id}`} className="text-xs leading-relaxed bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                            <span className="font-extrabold text-[#1E293B]">Q{q.number}.</span>{' '}
                            <span className="font-medium text-[#475569]">{q.answer || 'No solution provided.'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
