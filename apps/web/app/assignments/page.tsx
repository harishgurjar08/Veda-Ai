'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import axios from 'axios';
import { Assignment } from 'shared';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MoreVertical, 
  BookOpen, 
  Trash2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/assignments`);
      setAssignments(res.data);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      // In-memory local delete for UI speed, or optional REST call
      // In our code, we filter local state. We could also hit a DELETE endpoint,
      // but let's handle it locally in state for instantaneous feel.
      setAssignments(prev => prev.filter(item => (item.id || item._id) !== id));
      setActiveDropdown(null);
    } catch (err) {
      console.error('Failed to delete assignment:', err);
    }
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveDropdown(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Filtered list
  const filteredAssignments = assignments.filter(item => {
    const term = searchQuery.toLowerCase();
    return (
      item.subject.toLowerCase().includes(term) ||
      item.topic.toLowerCase().includes(term) ||
      item.grade.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-[#1E293B]">
      {/* Reusable Sidebar Component */}
      <Sidebar />

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header title="Assignments" />

        <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-[#FF5E36]/30 border-t-[#FF5E36] rounded-full animate-spin mb-4" />
              <p className="text-[#64748B] font-semibold text-sm">Loading assignments...</p>
            </div>
          ) : assignments.length === 0 ? (
            /* --- EMPTY STATE (Figma Screenshot 1) --- */
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-xl mx-auto space-y-6 bg-white p-12 rounded-3xl border border-[#E2E8F0] shadow-sm mt-8">
              {/* Illustration exactly replication: Document, Red Circle with 'X', Magnifying glass */}
              <div className="relative w-48 h-48 flex items-center justify-center bg-[#F8FAFC] rounded-full">
                <svg className="w-32 h-32 text-[#E2E8F0]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Document Background */}
                  <rect x="25" y="15" width="50" height="70" rx="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                  {/* Document Lines */}
                  <line x1="35" y1="28" x2="50" y2="28" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                  <line x1="35" y1="38" x2="65" y2="38" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                  <line x1="35" y1="48" x2="55" y2="48" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Red Circle with 'X' */}
                  <circle cx="50" cy="50" r="14" fill="#FFECEB" stroke="#F87171" strokeWidth="2" />
                  <line x1="45" y1="45" x2="55" y2="55" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="55" y1="45" x2="45" y2="55" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Magnifying Glass Overlay */}
                  <circle cx="65" cy="65" r="10" stroke="#475569" strokeWidth="3" fill="white" />
                  <line x1="72" y1="72" x2="82" y2="82" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
                </svg>

                {/* Decorative particles */}
                <div className="absolute top-8 left-8 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
                <div className="absolute bottom-8 right-6 w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                <div className="absolute top-1/2 right-4 w-4 h-4 bg-sky-400/20 rounded-lg transform rotate-45" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">No assignments yet</h2>
                <p className="text-sm font-medium text-[#64748B] leading-relaxed">
                  Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
                </p>
              </div>

              <Link href="/create" className="px-6 py-3.5 bg-gradient-to-r from-[#FF5E36] to-[#FFA07A] hover:opacity-95 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF5E36]/15 hover:shadow-[#FF5E36]/25 transition-all duration-200 active:scale-95 text-sm">
                <Plus className="w-5 h-5 stroke-[2.5]" />
                Create Your First Assignment
              </Link>
            </div>
          ) : (
            /* --- FILLED STATE (Figma Screenshot 2) --- */
            <div className="space-y-6">
              {/* Notice Banner */}
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm text-emerald-800">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                <div className="text-sm font-bold">
                  Assignments – <span className="font-semibold text-emerald-700">Manage and create assignments for your classes.</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
                {/* Filter Trigger */}
                <button className="w-full sm:w-auto px-4 py-2.5 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1E293B] font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm select-none active:scale-[0.98]">
                  <Filter className="w-4 h-4 text-[#94A3B8]" />
                  <span>Filter By</span>
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                </button>

                {/* Search Bar */}
                <div className="w-full sm:max-w-md relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="Search Assignment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white border border-[#E2E8F0] focus:border-[#FF5E36] rounded-xl outline-none font-medium text-sm text-[#1E293B] transition-all duration-200 placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments.map((item) => {
                  const id = item.id || item._id || '';
                  const assignedDate = item.createdAt ? format(new Date(item.createdAt), 'dd-MM-yyyy') : '20-06-2025';
                  const formattedDueDate = item.dueDate ? format(new Date(item.dueDate), 'dd-MM-yyyy') : '21-06-2025';
                  
                  return (
                    <Link
                      key={id}
                      href={`/paper/${id}`}
                      className="bg-white hover:bg-slate-50/50 border border-[#E2E8F0] hover:border-[#FF5E36]/30 rounded-2xl p-5 flex flex-col relative transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer"
                    >
                      {/* Main Info */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1 pr-6">
                          <span className="text-[10px] font-bold text-[#FF5E36] tracking-wide uppercase px-2 py-0.5 bg-[#FFECEB] rounded-full">
                            {item.grade}
                          </span>
                          <h3 className="text-base font-extrabold text-[#1E293B] group-hover:text-[#FF5E36] transition-colors duration-200 line-clamp-1 leading-snug">
                            Quiz on {item.subject}
                          </h3>
                          <p className="text-xs font-semibold text-[#64748B] line-clamp-1">
                            Topic: {item.topic}
                          </p>
                        </div>

                        {/* Three dots action dropdown menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => toggleDropdown(id, e)}
                            className="p-1.5 hover:bg-[#F1F5F9] rounded-lg transition-all duration-200 text-[#94A3B8] hover:text-[#1E293B] active:scale-95 border border-transparent hover:border-[#E2E8F0]"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Absolute Dropdown Dialog */}
                          {activeDropdown === id && (
                            <div className="absolute right-0 top-8 w-44 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                              <Link
                                href={`/paper/${id}`}
                                className="w-full px-4 py-2 hover:bg-[#F8FAFC] text-left text-xs font-bold text-[#475569] flex items-center gap-2"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                View Assignment
                              </Link>
                              <button
                                onClick={(e) => handleDelete(id, e)}
                                className="w-full px-4 py-2 hover:bg-[#FFECEB] text-left text-xs font-bold text-[#EF4444] flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-auto pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] font-bold text-[#64748B]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                          Assigned: <span className="text-[#1E293B]">{assignedDate}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          Due: <span className="text-[#1E293B]">{formattedDueDate}</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Centered bottom actions matching Figma screenshots */}
              <div className="flex justify-center pt-8">
                <Link href="/create" className="px-6 py-3 bg-[#1E293B] hover:bg-[#FF5E36] hover:scale-[1.02] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-[#1E293B]/10 transition-all duration-300 active:scale-95 text-xs">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Create Assignment
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
