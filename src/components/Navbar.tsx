import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bell, 
  Bot, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  Menu,
  School,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Announcement } from '../types';

interface NavbarProps {
  onOpenAi: () => void;
  onOpenMobileMenu: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  announcements?: Announcement[];
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAi, 
  onOpenMobileMenu, 
  activeTab, 
  setActiveTab,
  announcements = [] 
}) => {
  const { user, role, logout, switchDemoUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pinnedOrRecentAnnouncements = announcements.slice(0, 3);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top institution bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AFFILIATED TO ANNA UNIVERSITY • APPROVED BY AICTE • NAAC &apos;A+&apos; GRADE</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <span>Academic Year: <strong>2026-27 (Odd Sem)</strong></span>
          <span className="text-slate-600">|</span>
          <span>Exam Cell Portal: <strong>ACTIVE</strong></span>
          <span className="text-slate-600">|</span>
          <button 
            onClick={() => switchDemoUser(role === 'student' ? 'admin' : 'student')}
            className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="Click to instantly toggle student and admin views for demonstration"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Switch to {role === 'student' ? 'Admin View' : 'Student View'}
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-cyan-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    APEX<span className="text-cyan-400 font-light">CAMPUS</span>
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-blue-500/10 text-cyan-400 border border-blue-500/30">
                    Student Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  AI-Powered Academic &amp; Career Assistant
                </p>
              </div>
            </div>
          </div>

          {/* Center / Action Shortcuts */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAi}
              className="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden xs:inline">Ask</span> ApexEdu AI
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-white/20 rounded text-cyan-200">
                Gemini
              </span>
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative cursor-pointer"
                title="College Announcements"
                aria-label="View announcements"
              >
                <Bell className="w-5 h-5" />
                {announcements.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-900"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-sm">Notice Board Circulars</span>
                    </div>
                    <span className="text-[11px] bg-blue-600/40 text-blue-200 px-2 py-0.5 rounded-full font-medium">
                      {announcements.length} New
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {pinnedOrRecentAnnouncements.map((ann) => (
                      <div 
                        key={ann.id}
                        onClick={() => {
                          setActiveTab('announcements');
                          setShowNotifications(false);
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span className="font-bold text-blue-600 uppercase tracking-wider">{ann.category}</span>
                          <span>{ann.date}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{ann.title}</h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setActiveTab('announcements');
                        setShowNotifications(false);
                      }}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
                    >
                      View All College Notices &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors text-left cursor-pointer"
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-500/40"
                />
                <div className="hidden md:block leading-tight">
                  <div className="text-xs font-semibold text-white flex items-center gap-1">
                    {user?.name}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {role === 'admin' ? 'Faculty Admin' : user?.registerNumber || 'Student'}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-4 bg-gradient-to-br from-slate-900 to-blue-950 text-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.avatarUrl}
                        alt={user?.name}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-cyan-400/50"
                      />
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold truncate text-white">{user?.name}</h4>
                        <p className="text-xs text-cyan-300 font-mono truncate">
                          {role === 'admin' ? 'Admin Office' : user?.registerNumber}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.department}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-blue-600" />
                      View Academic Profile
                    </button>

                    {role === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-indigo-700 hover:bg-indigo-50 font-medium transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        Admin Management Console
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100"></div>

                    {/* Switch role quick button */}
                    <button
                      onClick={() => {
                        switchDemoUser(role === 'student' ? 'admin' : 'student');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-blue-700 hover:bg-blue-50 font-medium transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <School className="w-4 h-4 text-blue-600" />
                        Switch to {role === 'student' ? 'Admin' : 'Student'}
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                        DEMO
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Logout from Portal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
