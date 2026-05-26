'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { 
  Users, 
  Plus, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Search, 
  Filter, 
  Sliders, 
  ArrowUpRight, 
  Sparkles,
  Info,
  TrendingUp,
  Award
} from 'lucide-react';

interface ClassGroup {
  id: string;
  name: string;
  subject: string;
  studentsCount: number;
  averageGrade: string;
  upcomingTest: string;
  progress: number;
  color: string;
}

export default function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [groups, setGroups] = useState<ClassGroup[]>([
    {
      id: '1',
      name: 'Grade 10 - Alpha',
      subject: 'Science',
      studentsCount: 38,
      averageGrade: 'A-',
      upcomingTest: 'Electricity Assessment (30th May)',
      progress: 78,
      color: 'from-[#FF5E36] to-[#FFA07A]'
    },
    {
      id: '2',
      name: 'Class 5th - Division B',
      subject: 'Science',
      studentsCount: 29,
      averageGrade: 'B+',
      upcomingTest: 'Basic Circuit Quiz (1st June)',
      progress: 62,
      color: 'from-emerald-500 to-teal-400'
    },
    {
      id: '3',
      name: 'Grade 12 - Elite Advanced',
      subject: 'Math',
      studentsCount: 42,
      averageGrade: 'A',
      upcomingTest: 'Calculus Differentiation (15th June)',
      progress: 92,
      color: 'from-indigo-500 to-purple-400'
    },
    {
      id: '4',
      name: 'Grade 9 - Batch C',
      subject: 'English',
      studentsCount: 31,
      averageGrade: 'B-',
      upcomingTest: 'Subjunctive Mood Essay (2nd June)',
      progress: 45,
      color: 'from-pink-500 to-rose-400'
    }
  ]);

  // Form states for new group
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('Science');
  const [newStudents, setNewStudents] = useState(30);
  const [newGrade, setNewGrade] = useState('B+');

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const colors = [
      'from-blue-500 to-cyan-400',
      'from-amber-500 to-orange-400',
      'from-violet-500 to-fuchsia-400',
      'from-emerald-500 to-teal-400'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newGroup: ClassGroup = {
      id: 'group_' + Math.random().toString(36).substring(2, 9),
      name: newName,
      subject: newSubject,
      studentsCount: newStudents,
      averageGrade: newGrade,
      upcomingTest: 'No tests scheduled yet',
      progress: 0,
      color: randomColor
    };

    setGroups([newGroup, ...groups]);
    setNewName('');
    setNewStudents(30);
    setShowAddModal(false);
  };

  const filteredGroups = groups.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          g.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || g.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-[#1E293B]">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Header title="My Class Groups" />

        <div className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
          
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">Class Groups & Batches</h2>
              <p className="text-xs font-semibold text-[#64748B]">Manage your student rolls, view progression metrics, and align assessments</p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="py-2.5 px-4 bg-gradient-to-r from-[#FF5E36] to-[#FFA07A] hover:opacity-95 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF5E36]/15 hover:shadow-[#FF5E36]/25 transition-all duration-200 active:scale-95 text-xs select-none shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Add Class Group
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Stat 1 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF5E36]" />
              <div className="w-10 h-10 rounded-xl bg-[#FFECEB] text-[#FF5E36] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Total Students</p>
                <p className="text-lg font-black text-[#1E293B]">{groups.reduce((acc, curr) => acc + curr.studentsCount, 0)}</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Active Groups</p>
                <p className="text-lg font-black text-[#1E293B]">{groups.length}</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Average Progress</p>
                <p className="text-lg font-black text-[#1E293B]">
                  {Math.round(groups.reduce((acc, curr) => acc + curr.progress, 0) / groups.length)}%
                </p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Highest Grade</p>
                <p className="text-lg font-black text-[#1E293B]">A (Grade 12)</p>
              </div>
            </div>

          </div>

          {/* Filtering and Search Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search class groups by name, grade, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5E36] rounded-xl outline-none text-xs font-medium text-[#1E293B] transition-colors placeholder:text-[#94A3B8]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold text-[#64748B] whitespace-nowrap hidden sm:inline">Filter Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full sm:w-40 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5E36] rounded-xl outline-none font-bold text-xs text-[#1E293B] transition-colors cursor-pointer"
              >
                <option value="All">All Subjects</option>
                <option value="Science">Science</option>
                <option value="Math">Math</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGroups.map((group) => (
              <div 
                key={group.id} 
                className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col group"
              >
                
                {/* Header card with matching color gradient */}
                <div className={`bg-gradient-to-r ${group.color} p-5 text-white flex justify-between items-start relative`}>
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full tracking-wider backdrop-blur-sm">
                      {group.subject}
                    </span>
                    <h3 className="text-base font-extrabold tracking-tight pt-1">{group.name}</h3>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-white/80">Average Grade</span>
                    <span className="text-xl font-black bg-white/10 px-2.5 py-0.5 rounded-xl border border-white/10 backdrop-blur-sm shadow-inner">
                      {group.averageGrade}
                    </span>
                  </div>
                </div>

                {/* Card Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Student Roll and Upcoming Exams details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#64748B]">
                      <div className="flex items-center gap-2 font-semibold">
                        <Users className="w-4 h-4 text-[#94A3B8]" />
                        <span>Enrolled Students:</span>
                      </div>
                      <span className="font-extrabold text-[#1E293B]">{group.studentsCount} Students</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#64748B]">
                      <div className="flex items-center gap-2 font-semibold">
                        <Calendar className="w-4 h-4 text-[#94A3B8]" />
                        <span>Upcoming Test:</span>
                      </div>
                      <span className="font-bold text-[#FF5E36] text-[10px] bg-[#FFECEB] px-2 py-0.5 rounded-lg text-right max-w-[200px] truncate">
                        {group.upcomingTest}
                      </span>
                    </div>
                  </div>

                  {/* Progress slide meter */}
                  <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9]">
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#64748B]">
                      <span>Curriculum Progression</span>
                      <span className="font-extrabold text-[#1E293B]">{group.progress}% Complete</span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${group.color} transition-all duration-1000`} 
                        style={{ width: `${group.progress}%` }} 
                      />
                    </div>
                  </div>

                  {/* Action Triggers */}
                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-4">
                    <button className="text-[10px] font-bold text-[#64748B] hover:text-[#1E293B] flex items-center gap-1 transition-colors">
                      View Gradebook
                    </button>
                    <button className="py-1.5 px-3 border border-[#E2E8F0] hover:border-[#FF5E36] hover:bg-[#FFF9F6] text-[#FF5E36] font-bold rounded-xl text-[10px] flex items-center gap-1 transition-all duration-200">
                      Draft Assignment
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Elegant Add Group Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="border-b border-[#F1F5F9] pb-4 flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-[#1E293B] tracking-tight">Add Class Group</h3>
                <p className="text-[11px] font-semibold text-[#94A3B8]">Initialize a new student batch roster</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#94A3B8] hover:text-[#1E293B] font-extrabold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              
              {/* Group Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">Group Name / Section</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 11 - Science Batch A"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#E2E8F0] focus:border-[#FF5E36] rounded-xl outline-none font-medium text-xs text-[#1E293B] bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white transition-colors placeholder:text-[#94A3B8]"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">Subject Focus</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#E2E8F0] focus:border-[#FF5E36] rounded-xl outline-none font-bold text-xs text-[#1E293B] bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="Science">Science</option>
                  <option value="Math">Math</option>
                  <option value="English">English</option>
                </select>
              </div>

              {/* Enrolled Students slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#475569]">
                  <span>Initial Student Count</span>
                  <span className="text-[#FF5E36]">{newStudents} Students</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={newStudents}
                  onChange={(e) => setNewStudents(Number(e.target.value))}
                  className="w-full accent-[#FF5E36] h-1 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Target Grade level preview */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">Current Target Standard</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#E2E8F0] focus:border-[#FF5E36] rounded-xl outline-none font-bold text-xs text-[#1E293B] bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="A+">A+ Standard</option>
                  <option value="A">A Standard</option>
                  <option value="B+">B+ Standard</option>
                  <option value="B">B Standard</option>
                  <option value="C">C Standard</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] font-bold rounded-xl text-xs active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#FF5E36] to-[#FFA07A] text-white font-extrabold rounded-xl text-xs shadow-md shadow-[#FF5E36]/10 hover:opacity-95 active:scale-[0.98] transition-all"
                >
                  Create Group
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}
