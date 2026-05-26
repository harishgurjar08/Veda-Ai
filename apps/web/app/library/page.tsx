'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { 
  FolderHeart, 
  Search, 
  Filter, 
  BookOpen, 
  Download, 
  Trash2, 
  Bookmark, 
  Share2, 
  Eye, 
  Star, 
  ExternalLink,
  Tag,
  Plus
} from 'lucide-react';

interface LibraryItem {
  id: string;
  title: string;
  subject: string;
  grade: string;
  questionsCount: number;
  marks: number;
  starred: boolean;
  downloads: number;
  dateCreated: string;
}

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'my-papers' | 'starred' | 'templates'>('my-papers');
  
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([
    {
      id: 'lib_1',
      title: 'Electricity & Circuits Formative Assessment',
      subject: 'Science',
      grade: 'Class 10th',
      questionsCount: 10,
      marks: 20,
      starred: true,
      downloads: 42,
      dateCreated: '24th May 2026'
    },
    {
      id: 'lib_2',
      title: 'Linear Algebra Intermediate Diagnostic Test',
      subject: 'Math',
      grade: 'Grade 9',
      questionsCount: 15,
      marks: 30,
      starred: false,
      downloads: 18,
      dateCreated: '22nd May 2026'
    },
    {
      id: 'lib_3',
      title: 'English Subjunctive Mood & Active voice Sheet',
      subject: 'English',
      grade: 'Grade 10',
      questionsCount: 8,
      marks: 16,
      starred: true,
      downloads: 54,
      dateCreated: '20th May 2026'
    },
    {
      id: 'lib_4',
      title: 'General Chemistry Periodic Classification',
      subject: 'Science',
      grade: 'Class 8th',
      questionsCount: 12,
      marks: 24,
      starred: false,
      downloads: 29,
      dateCreated: '18th May 2026'
    }
  ]);

  const toggleStar = (id: string) => {
    setLibraryItems(prev => prev.map(item => 
      item.id === id ? { ...item, starred: !item.starred } : item
    ));
  };

  const deleteItem = (id: string) => {
    setLibraryItems(prev => prev.filter(item => item.id !== id));
  };

  // Filter items based on searchTerm and active tab selection
  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'starred') return matchesSearch && item.starred;
    if (activeTab === 'templates') return matchesSearch && item.downloads > 40; // Simulated public templates
    return matchesSearch;
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-[#1E293B]">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Header title="My Assessment Library" />

        <div className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
          
          {/* Dashboard Header Title */}
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">Assessment Library</h2>
            <p className="text-xs font-semibold text-[#64748B]">Access your saved exam templates, star items, and browse public templates catalogs</p>
          </div>

          {/* Navigation Category Tabs */}
          <div className="flex border-b border-[#E2E8F0] gap-6">
            <button
              onClick={() => setActiveTab('my-papers')}
              className={`pb-3 text-xs font-bold transition-all relative ${
                activeTab === 'my-papers' 
                  ? 'text-[#FF5E36]' 
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              My Saved Papers
              {activeTab === 'my-papers' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF5E36] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('starred')}
              className={`pb-3 text-xs font-bold transition-all relative ${
                activeTab === 'starred' 
                  ? 'text-[#FF5E36]' 
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              Starred Favorites
              {activeTab === 'starred' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF5E36] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`pb-3 text-xs font-bold transition-all relative ${
                activeTab === 'templates' 
                  ? 'text-[#FF5E36]' 
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              Community Templates
              {activeTab === 'templates' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF5E36] rounded-full" />
              )}
            </button>
          </div>

          {/* Search bar controller */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search library documents by name, subject focus, or class standard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] focus:border-[#FF5E36] rounded-xl outline-none text-xs font-medium text-[#1E293B] transition-colors placeholder:text-[#94A3B8] shadow-sm"
            />
          </div>

          {/* Grid of Saved Paper Files cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 hover:shadow-md transition-all duration-300 relative flex flex-col justify-between space-y-4 group"
              >
                
                {/* Upper Details Block */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    
                    {/* Color-coded Subject badges */}
                    <div className="flex gap-2">
                      <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider border ${
                        item.subject === 'Science' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                        item.subject === 'Math' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' :
                        'bg-pink-50 border-pink-200 text-pink-600'
                      }`}>
                        {item.subject}
                      </span>
                      <span className="text-[8px] font-extrabold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full tracking-wider border border-[#E2E8F0]">
                        {item.grade}
                      </span>
                    </div>

                    {/* Star favorite trigger */}
                    <button
                      onClick={() => toggleStar(item.id)}
                      className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors text-[#94A3B8] hover:text-amber-500 shrink-0"
                    >
                      <Star className={`w-4.5 h-4.5 ${item.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-sm font-extrabold text-[#1E293B] group-hover:text-[#FF5E36] transition-colors tracking-tight line-clamp-1 leading-relaxed">
                    {item.title}
                  </h3>
                </div>

                {/* Quantitative statistics */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#F1F5F9] text-[10px] font-bold text-[#64748B]">
                  <div className="text-center border-r border-[#F1F5F9] space-y-0.5">
                    <p className="text-[#94A3B8] font-semibold text-[8px] uppercase tracking-wider">Questions</p>
                    <p className="text-[#1E293B] text-xs font-black">{item.questionsCount}</p>
                  </div>

                  <div className="text-center border-r border-[#F1F5F9] space-y-0.5">
                    <p className="text-[#94A3B8] font-semibold text-[8px] uppercase tracking-wider">Max Marks</p>
                    <p className="text-[#1E293B] text-xs font-black">{item.marks} M</p>
                  </div>

                  <div className="text-center space-y-0.5">
                    <p className="text-[#94A3B8] font-semibold text-[8px] uppercase tracking-wider">Downloads</p>
                    <p className="text-[#1E293B] text-xs font-black">{item.downloads}</p>
                  </div>
                </div>

                {/* Footer and Actions */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[9px] font-semibold text-[#94A3B8]">Created: {item.dateCreated}</span>
                  
                  <div className="flex items-center gap-2">
                    {/* Download */}
                    <button className="p-2 hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-emerald-300 text-[#64748B] hover:text-emerald-500 rounded-xl transition-all shadow-sm active:scale-95" title="Download Template">
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 hover:bg-red-50 border border-[#E2E8F0] hover:border-red-200 text-[#94A3B8] hover:text-red-500 rounded-xl transition-all shadow-sm active:scale-95"
                      title="Delete Template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full py-16 text-center space-y-3 bg-white rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center p-6">
                <FolderHeart className="w-12 h-12 text-[#94A3B8] stroke-[1.5] animate-pulse" />
                <h4 className="text-xs font-extrabold text-[#1E293B]">No Saved Items Found</h4>
                <p className="text-[10px] font-medium text-[#64748B] max-w-xs">
                  We couldn't find any papers matching your query. Add filters or search for another chapter topic!
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
