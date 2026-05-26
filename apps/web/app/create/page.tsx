'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { useAssignmentStore, QuestionTypeRow } from '../../store/useAssignmentStore';
import { 
  Upload, 
  Calendar, 
  Plus, 
  Minus, 
  Trash2, 
  Mic, 
  Sparkles,
  ArrowRight,
  BookOpen,
  Info,
  X,
  FileText
} from 'lucide-react';

const QUESTION_TYPES = [
  { value: 'mcq', label: 'Multiple Choice Questions' },
  { value: 'short', label: 'Short Questions' },
  { value: 'diagram', label: 'Diagram/Graph-Based Questions' },
  { value: 'numerical', label: 'Numerical Problems' },
  { value: 'truefalse', label: 'True / False Questions' },
  { value: 'fillinblanks', label: 'Fill in the Blanks' }
];

const GRADES = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
  'Class 5th', 'Class 8th', 'Class 10th', 'Class 12th',
  'Undergraduate', 'Postgraduate'
];

export default function CreateAssignmentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    subject,
    grade,
    topic,
    dueDate,
    questionRows,
    difficultyDistribution,
    additionalInstructions,
    uploadedFile,
    errors,
    isGenerating,
    setField,
    addQuestionRow,
    removeQuestionRow,
    updateQuestionRow,
    submit
  } = useAssignmentStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setField('uploadedFile', e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setField('uploadedFile', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setField('uploadedFile', e.dataTransfer.files[0]);
    }
  };

  const handleDifficultyChange = (type: 'easy' | 'medium' | 'hard', val: number) => {
    const dist = { ...difficultyDistribution };
    dist[type] = val;
    setField('difficultyDistribution', dist);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await submit();
      if (res && res.jobId) {
        router.push(`/generating/${res.assignmentId}`);
      }
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  // Compute Totals
  const totalQuestions = questionRows.reduce((acc, curr) => acc + curr.count, 0);
  const totalMarks = questionRows.reduce((acc, curr) => acc + (curr.marks * curr.count), 0);

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-[#1E293B]">
      {/* Reusable Sidebar Component */}
      <Sidebar />

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header title="Create Assignment" showBack={true} />

        <div className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-6">
          
          {/* Main Title & Description */}
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">Create Assignment</h2>
            <p className="text-xs font-semibold text-[#64748B]">Set up a new assignment for your students</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            {/* Form Card */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              
              <div className="border-b border-[#F1F5F9] pb-4">
                <h3 className="text-sm font-bold text-[#1E293B] tracking-tight">Assignment Details</h3>
                <p className="text-[11px] font-semibold text-[#94A3B8]">Basic information about your assignment</p>
              </div>

              {/* Subject, Grade, Topic Rows */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#475569]">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setField('subject', e.target.value)}
                    placeholder="e.g. Science, English, Math"
                    className={`w-full px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white border rounded-xl outline-none font-medium text-xs text-[#1E293B] transition-all duration-200 placeholder:text-[#94A3B8] ${
                      errors.subject ? 'border-red-400 focus:border-red-400 bg-red-50/20' : 'border-[#E2E8F0] focus:border-[#FF5E36]'
                    }`}
                  />
                  {errors.subject && (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      {errors.subject}
                    </span>
                  )}
                </div>

                {/* Grade / Class */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#475569]">Grade/Class</label>
                  <select
                    value={grade}
                    onChange={(e) => setField('grade', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white border rounded-xl outline-none font-bold text-xs text-[#1E293B] transition-all duration-200 ${
                      errors.grade ? 'border-red-400 focus:border-red-400 bg-red-50/20' : 'border-[#E2E8F0] focus:border-[#FF5E36]'
                    }`}
                  >
                    <option value="">Select Grade</option>
                    {GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  {errors.grade && (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      {errors.grade}
                    </span>
                  )}
                </div>

                {/* Topic / Chapter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#475569]">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setField('topic', e.target.value)}
                    placeholder="e.g. Electricity, Algebra"
                    className={`w-full px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white border rounded-xl outline-none font-medium text-xs text-[#1E293B] transition-all duration-200 placeholder:text-[#94A3B8] ${
                      errors.topic ? 'border-red-400 focus:border-red-400 bg-red-50/20' : 'border-[#E2E8F0] focus:border-[#FF5E36]'
                    }`}
                  />
                  {errors.topic && (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      {errors.topic}
                    </span>
                  )}
                </div>

              </div>

              {/* Upload reference box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#475569]">Upload Reference Material (Optional)</label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#CBD5E1] hover:border-[#FF5E36] bg-[#F8FAFC] hover:bg-[#FFF9F6] p-6 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 relative group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.png,.jpg,.jpeg"
                    className="hidden"
                  />

                  {uploadedFile ? (
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#E2E8F0] max-w-md w-full relative">
                      <FileText className="w-8 h-8 text-[#FF5E36] shrink-0" />
                      <div className="min-w-0 pr-8">
                        <p className="text-xs font-bold text-[#1E293B] truncate">{uploadedFile.name}</p>
                        <p className="text-[10px] font-semibold text-[#94A3B8]">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-[#F1F5F9] hover:bg-red-100 rounded-lg text-[#64748B] hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white group-hover:scale-105 transition-transform duration-200 border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#FF5E36] shadow-sm">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-[#1E293B] text-center">
                        Choose a file or drag & drop here
                      </p>
                      <p className="text-[10px] font-medium text-[#94A3B8] text-center">
                        PDF, PNG, JPG, JPEG (Max 5MB)
                      </p>
                      <button
                        type="button"
                        className="text-[10px] font-bold text-[#FF5E36] hover:underline pt-1"
                      >
                        Browse Files
                      </button>
                    </>
                  )}
                </div>
                <p className="text-[10px] font-medium text-[#94A3B8]">Upload images or document references of your preferred material.</p>
              </div>

              {/* Due Date Picker */}
              <div className="space-y-2 max-w-sm">
                <label className="text-xs font-bold text-[#475569]">Due Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setField('dueDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white border rounded-xl outline-none font-bold text-xs text-[#1E293B] transition-all duration-200 ${
                      errors.dueDate ? 'border-red-400 focus:border-red-400 bg-red-50/20' : 'border-[#E2E8F0] focus:border-[#FF5E36]'
                    }`}
                  />
                </div>
                {errors.dueDate && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {errors.dueDate}
                  </span>
                )}
              </div>

              {/* Dynamic Question Type rows */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-[#475569] block">Question Types</label>
                
                <div className="space-y-3">
                  {questionRows.map((row) => (
                    <div key={row.id} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
                      
                      {/* Dropdown type */}
                      <div className="flex-1 min-w-0">
                        <select
                          value={row.type}
                          onChange={(e) => updateQuestionRow(row.id, { type: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl font-bold text-xs text-[#1E293B] outline-none focus:border-[#FF5E36]"
                        >
                          {QUESTION_TYPES.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* No of Questions (+/- counter) */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-[#64748B] sm:hidden">No. of Questions:</span>
                        <div className="flex items-center bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuestionRow(row.id, { count: Math.max(1, row.count - 1) })}
                            className="p-2 hover:bg-[#F8FAFC] text-[#64748B] active:bg-[#F1F5F9] transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-extrabold text-xs text-[#1E293B] min-w-[2.5rem] text-center">
                            {row.count}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuestionRow(row.id, { count: Math.min(50, row.count + 1) })}
                            className="p-2 hover:bg-[#F8FAFC] text-[#64748B] active:bg-[#F1F5F9] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Marks (+/- counter) */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-[#64748B] sm:hidden">Marks:</span>
                        <div className="flex items-center bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuestionRow(row.id, { marks: Math.max(1, row.marks - 1) })}
                            className="p-2 hover:bg-[#F8FAFC] text-[#64748B] active:bg-[#F1F5F9] transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-extrabold text-xs text-[#1E293B] min-w-[2.5rem] text-center">
                            {row.marks}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuestionRow(row.id, { marks: Math.min(20, row.marks + 1) })}
                            className="p-2 hover:bg-[#F8FAFC] text-[#64748B] active:bg-[#F1F5F9] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Delete row trigger */}
                      <button
                        type="button"
                        onClick={() => removeQuestionRow(row.id)}
                        className="p-2 bg-white hover:bg-red-50 text-[#94A3B8] hover:text-red-500 border border-[#E2E8F0] rounded-xl transition-all duration-200 shrink-0 self-end sm:self-center"
                        title="Delete question type"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  ))}
                </div>

                {/* Add Row trigger */}
                <button
                  type="button"
                  onClick={addQuestionRow}
                  className="py-2.5 px-4 bg-white hover:bg-[#F8FAFC] text-[#1E293B] border border-[#E2E8F0] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#FF5E36] stroke-[2.5]" />
                  Add Question Type
                </button>

                {errors.questionRows && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <Info className="w-3 h-3" />
                    {errors.questionRows}
                  </span>
                )}

                {/* Total Stats boxes */}
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#64748B]">
                  <span>Total Questions: <span className="text-[#1E293B] font-extrabold text-sm">{totalQuestions}</span></span>
                  <span>Total Marks: <span className="text-[#1E293B] font-extrabold text-sm">{totalMarks}</span></span>
                </div>
              </div>

              {/* Difficulty Distribution Sliders */}
              <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#475569]">Difficulty Distribution</label>
                  <span className="text-[10px] font-extrabold text-[#FF5E36] bg-[#FFECEB] px-2 py-0.5 rounded-full">
                    Sum: {Number(difficultyDistribution.easy) + Number(difficultyDistribution.medium) + Number(difficultyDistribution.hard)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Easy */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-emerald-600">
                      <span>Easy</span>
                      <span>{difficultyDistribution.easy}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={difficultyDistribution.easy}
                      onChange={(e) => handleDifficultyChange('easy', Number(e.target.value))}
                      className="w-full accent-emerald-500 h-1 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Medium */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-amber-500">
                      <span>Medium</span>
                      <span>{difficultyDistribution.medium}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={difficultyDistribution.medium}
                      onChange={(e) => handleDifficultyChange('medium', Number(e.target.value))}
                      className="w-full accent-amber-500 h-1 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Hard */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-red-500">
                      <span>Hard</span>
                      <span>{difficultyDistribution.hard}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={difficultyDistribution.hard}
                      onChange={(e) => handleDifficultyChange('hard', Number(e.target.value))}
                      className="w-full accent-red-500 h-1 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {errors.difficultyDistribution && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <Info className="w-3 h-3" />
                    {errors.difficultyDistribution}
                  </span>
                )}
              </div>

              {/* Additional Information */}
              <div className="space-y-2 pt-4 border-t border-[#F1F5F9]">
                <label className="text-xs font-bold text-[#475569] block">Additional Information (For better output)</label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={additionalInstructions}
                    onChange={(e) => setField('additionalInstructions', e.target.value)}
                    placeholder="Eg: Generate question paper for 3 hour exam duration. Ensure real-world problem scenarios are incorporated into MCQs..."
                    className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white border border-[#E2E8F0] focus:border-[#FF5E36] rounded-2xl outline-none font-medium text-xs text-[#1E293B] transition-all duration-200 placeholder:text-[#94A3B8] resize-none pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 bottom-3.5 p-1.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#FF5E36] rounded-xl shadow-sm transition-all active:scale-95"
                    title="Voice input"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Actions Bar (matches <- Previous & Next ->) */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0] gap-4">
              <button
                type="button"
                onClick={() => router.push('/assignments')}
                className="px-6 py-3 border border-[#E2E8F0] hover:bg-white bg-[#F8FAFC] text-[#475569] hover:text-[#1E293B] font-bold rounded-2xl flex items-center gap-2 transition-all active:scale-95 text-xs select-none"
              >
                ← Previous
              </button>

              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-[#FF5E36] to-[#FFA07A] hover:opacity-95 text-white font-extrabold rounded-2xl flex items-center gap-2 shadow-lg shadow-[#FF5E36]/15 hover:shadow-[#FF5E36]/25 transition-all active:scale-95 text-xs disabled:opacity-50 disabled:cursor-not-allowed select-none"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Next →
                  </>
                )}
              </button>
            </div>

            {errors.submit && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold mt-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                {errors.submit}
              </div>
            )}
          </form>

        </div>
      </main>
    </div>
  );
}
