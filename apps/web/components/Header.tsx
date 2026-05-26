'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Bell, 
  ChevronDown, 
  Menu, 
  X,
  Home,
  Users,
  BookOpen,
  Wrench,
  FolderHeart,
  Settings,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function Header({ title, showBack = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [schoolName, setSchoolName] = useState('Delhi Public School');
  const [schoolBranch, setSchoolBranch] = useState('Bokaro Steel City');

  // Load from local storage if exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSchool = localStorage.getItem('veda_school_name');
      const savedBranch = localStorage.getItem('veda_school_branch');
      if (savedSchool) setSchoolName(savedSchool);
      if (savedBranch) setSchoolBranch(savedBranch);
    }
  }, []);

  const menuItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'My Groups', icon: Users, path: '/groups' },
    { name: 'Assignments', icon: BookOpen, path: '/assignments', badge: 10 },
    { name: 'AI Teacher\'s Toolkit', icon: Wrench, path: '/toolkit' },
    { name: 'My Library', icon: FolderHeart, path: '/library' },
  ];

  return (
    <>
      <header className="h-16 print:hidden border-b border-[#E5E9F0] bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
        
        {/* Left Side: Desktop title / Back button OR Mobile Logo */}
        <div className="flex items-center gap-4">
          {/* On Mobile: If showBack is true, display back arrow button, otherwise show Brand logo */}
          <div className="md:hidden flex items-center gap-3">
            {showBack ? (
              <button
                onClick={() => router.back()}
                className="p-1.5 hover:bg-[#F1F5F9] rounded-lg transition-colors duration-200 border border-[#E2E8F0] shadow-sm active:scale-95"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-[#475569]" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-[#FF5E36] to-[#FFA07A] rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
                  V
                </div>
                <span className="font-extrabold text-lg text-[#1E293B] tracking-tight">
                  Veda<span className="text-[#FF5E36]">AI</span>
                </span>
              </div>
            )}
            
            {showBack && (
              <h1 className="text-xs font-bold text-[#1E293B] max-w-[120px] truncate">{title}</h1>
            )}
          </div>

          {/* On Desktop: standard header structure */}
          <div className="hidden md:flex items-center gap-4">
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
        </div>

        {/* Right Side: notifications, avatar & hamburger */}
        <div className="flex items-center gap-2.5 md:gap-4">
          {/* Notifications Icon with active badge indicator */}
          <button className="p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-xl transition-all duration-200 relative border border-[#E2E8F0] md:border-[#E2E8F0]">
            <Bell className="w-4.5 h-4.5 md:w-5 md:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5E36] rounded-full border border-white animate-pulse" />
          </button>

          {/* User profile avatar (visible on both mobile and desktop) */}
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center border border-emerald-200 shadow-sm shrink-0">
            <span className="text-xs md:text-sm">🧔</span>
          </div>

          {/* Desktop User name dropdown */}
          <div className="hidden md:flex items-center gap-1.5 pl-1 cursor-pointer group select-none">
            <span className="text-sm font-bold text-[#1E293B] group-hover:text-[#FF5E36] transition-colors duration-200">
              Harish Singh
            </span>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] transition-transform duration-300 group-hover:translate-y-0.5" />
          </div>

          {/* Mobile Hamburger menu icon */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-xl transition-all border border-[#E2E8F0]"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop blur overlay */}
          <div 
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Slide-out drawer content */}
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-white shadow-2xl p-6 space-y-6 animate-in slide-in-from-left duration-250 z-50">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-tr from-[#FF5E36] to-[#FFA07A] rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
                  V
                </div>
                <span className="font-bold text-lg text-[#1E293B] tracking-tight">
                  Veda<span className="text-[#FF5E36]">AI</span>
                </span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition-colors border border-[#E2E8F0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Create Assignment Button */}
            <div>
              <Link 
                href="/create" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#1E293B] to-[#334155] hover:from-[#FF5E36] hover:to-[#FFA07A] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-300 group active:scale-[0.98] text-xs"
              >
                <Sparkles className="w-4 h-4 text-[#FFD700] group-hover:animate-bounce" />
                <span>Create Assignment</span>
              </Link>
            </div>

            {/* Nav Menu List */}
            <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.path || (item.path === '/assignments' && pathname.startsWith('/paper'));
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-[#F1F5F9] text-[#1E293B] font-extrabold'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B] font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105 ${
                        isActive ? 'text-[#FF5E36]' : 'text-[#94A3B8] group-hover:text-[#64748B]'
                      }`} />
                      <span className="text-xs">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-[#FF5E36] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Section: Settings & School Mascot widget */}
            <div className="pt-4 border-t border-[#E5E9F0] space-y-4">
              <Link
                href="/settings"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B] ${
                  pathname === '/settings' ? 'bg-[#F1F5F9] text-[#1E293B] font-bold' : 'font-semibold'
                }`}
              >
                <Settings className="w-4.5 h-4.5 text-[#94A3B8]" />
                <span className="text-xs">Settings</span>
              </Link>

              {/* Mascot / Institution widget */}
              <div className="flex items-center gap-3 p-3 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0]">
                <div className="w-8 h-8 rounded-xl overflow-hidden bg-amber-100 flex items-center justify-center border border-amber-200 shadow-sm shrink-0">
                  <span className="text-sm">🦁</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] font-bold text-[#1E293B] truncate leading-tight">
                    {schoolName}
                  </h4>
                  <p className="text-[9px] font-medium text-[#64748B] truncate">
                    {schoolBranch}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
