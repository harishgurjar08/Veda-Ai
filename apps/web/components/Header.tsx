'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function Header({ title, showBack = false }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="h-16 border-b border-[#E5E9F0] bg-white px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-1.5 hover:bg-[#F1F5F9] rounded-lg transition-colors duration-200 border border-[#E2E8F0] shadow-sm active:scale-95"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-[#475569]" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#94A3B8] tracking-wider uppercase">Assignment</span>
          <span className="text-xs text-[#94A3B8] font-bold">/</span>
          <h1 className="text-sm font-bold text-[#1E293B] tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Icon with active badge indicator */}
        <button className="p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-xl transition-all duration-200 relative border border-[#E2E8F0]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5E36] rounded-full border border-white animate-pulse" />
        </button>

        {/* User profile dropdown for John Doe */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E5E9F0] cursor-pointer group select-none">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center border border-emerald-200 shadow-sm relative group-hover:scale-105 transition-transform duration-200">
            {/* User photo placeholder - styled beautiful avatar */}
            <span className="text-sm">🧔</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[#1E293B] group-hover:text-[#FF5E36] transition-colors duration-200">
              Harish Singh
            </span>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] transition-transform duration-300 group-hover:translate-y-0.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
