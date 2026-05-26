'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  BookOpen, 
  Wrench, 
  FolderHeart, 
  Settings,
  Sparkles,
  Plus
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'My Groups', icon: Users, path: '/groups' },
    { name: 'Assignments', icon: BookOpen, path: '/assignments', badge: 10 },
    { name: 'AI Teacher\'s Toolkit', icon: Wrench, path: '/toolkit' },
    { name: 'My Library', icon: FolderHeart, path: '/library' },
  ];

  const mobileMenuItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Assignments', icon: BookOpen, path: '/assignments' },
    { name: 'Library', icon: FolderHeart, path: '/library' },
    { name: 'AI Toolkit', icon: Wrench, path: '/toolkit' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-[#E5E9F0] bg-white flex flex-col h-screen sticky top-0 shrink-0">
        {/* Brand logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-[#FF5E36] to-[#FFA07A] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#FF5E36]/20">
            <span className="font-bold text-xl tracking-tight">V</span>
          </div>
          <span className="font-bold text-xl text-[#1E293B] tracking-tight">
            Veda<span className="text-[#FF5E36]">AI</span>
          </span>
        </div>

        {/* Create Assignment Button with Sparkle action */}
        <div className="px-4 mb-6">
          <Link href="/create" className="w-full py-3 px-4 bg-gradient-to-r from-[#1E293B] to-[#334155] hover:from-[#FF5E36] hover:to-[#FFA07A] text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-300 group active:scale-[0.98]">
            <Sparkles className="w-4 h-4 text-[#FFD700] group-hover:animate-bounce" />
            <span className="text-sm">Create Assignment</span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            // Check if active or if it's default home
            const isActive = pathname === item.path || (item.path === '/assignments' && pathname.startsWith('/paper'));
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#F1F5F9] text-[#1E293B] font-semibold'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'text-[#FF5E36]' : 'text-[#94A3B8] group-hover:text-[#64748B]'
                  }`} />
                  <span className="text-sm">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#FF5E36] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings & Profile Widget */}
        <div className="p-4 border-t border-[#E5E9F0] space-y-4 bg-gradient-to-b from-white to-[#F8FAFC]">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B] ${
              pathname === '/settings' ? 'bg-[#F1F5F9] text-[#1E293B] font-semibold' : ''
            }`}
          >
            <Settings className="w-5 h-5 text-[#94A3B8]" />
            <span className="text-sm font-medium">Settings</span>
          </Link>

          {/* Institution / School Profile Widget */}
          <div className="flex items-center gap-3 p-3 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-100 flex items-center justify-center border border-amber-200 shadow-sm shrink-0">
              {/* Cute school mascot representation */}
              <span className="text-lg">🦁</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#1E293B] truncate leading-tight">
                Delhi Public School
              </h4>
              <p className="text-[10px] font-medium text-[#64748B] truncate">
                Bokaro Steel City
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Action Button (FAB) */}
      <Link 
        href="/create" 
        className="md:hidden fixed bottom-20 right-5 z-40 bg-white hover:bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-[#E2E8F0] text-[#FF5E36] active:scale-95 transition-all duration-200"
        title="Create Assignment"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </Link>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#111827] border-t border-slate-800 flex items-center justify-around px-2 z-40">
        {mobileMenuItems.map((item) => {
          const isActive = pathname === item.path || (item.path === '/assignments' && pathname.startsWith('/paper')) || (item.path === '/' && pathname === '/assignments');
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center w-20 h-full transition-all duration-200 ${
                isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200 font-semibold'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-0.5 ${
                isActive ? 'text-white' : 'text-slate-400'
              }`} />
              <span className="text-[9px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
