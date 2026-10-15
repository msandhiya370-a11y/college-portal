import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  CalendarCheck, 
  Clock, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Bell, 
  UserCheck, 
  ShieldCheck,
  X,
  Sparkles,
  School,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingAssignmentsCount?: number;
  overallAttendance?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  pendingAssignmentsCount = 2,
  overallAttendance = 85.8
}) => {
  const { role, user, switchDemoUser } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Student Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'ai-assistant',
      label: 'AI Academic Assistant',
      icon: Bot,
      highlight: true,
      badge: 'Gemini 3.8',
      badgeColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
    },
    {
      id: 'attendance',
      label: 'Attendance Tracker',
      icon: CalendarCheck,
      badge: `${overallAttendance}%`,
      badgeColor: overallAttendance >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800',
    },
    {
      id: 'timetable',
      label: 'Weekly Timetable',
      icon: Clock,
      badge: 'Today',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'assignments',
      label: 'Assignments & Labs',
      icon: BookOpen,
      badge: pendingAssignmentsCount > 0 ? `${pendingAssignmentsCount} Due` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'materials',
      label: 'Study Notes & Materials',
      icon: FileText,
      badge: 'PDF / PPT',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'results',
      label: 'Exams & Results',
      icon: GraduationCap,
      badge: `CGPA ${user?.cgpa || 8.74}`,
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'announcements',
      label: 'College Circulars',
      icon: Bell,
      badge: 'Notices',
      badgeColor: 'bg-cyan-100 text-cyan-800',
    },
    {
      id: 'profile',
      label: 'Student Profile',
      icon: UserCheck,
      badge: null,
    },
  ];

  if (role === 'admin') {
    navItems.push({
      id: 'admin',
      label: 'Admin Control Center',
      icon: ShieldCheck,
      highlight: true,
      badge: 'Staff HOD',
      badgeColor: 'bg-indigo-600 text-white',
    });
  }

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 text-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-10 flex flex-col justify-between ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
                AP
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">Apex Institute</h3>
                <p className="text-[10px] text-slate-400 font-medium">B.Tech IT Academic Portal</p>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User mini badge */}
          <div className="p-3 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
            <img 
              src={user?.avatarUrl} 
              alt={user?.name}
              className="w-10 h-10 rounded-lg object-cover ring-2 ring-blue-500/30"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user?.name}</div>
              <div className="text-[11px] text-cyan-400 font-mono font-medium">
                {role === 'admin' ? 'Staff Administrator' : `${user?.registerNumber} • Sem ${user?.semester || 5}`}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{user?.department}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-2 space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom card & quick toggle */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-900/90">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-950/80 to-slate-800/80 border border-blue-900/40 text-xs">
            <div className="flex items-center justify-between text-slate-300 text-[11px] mb-1">
              <span>Attendance Status:</span>
              <span className={`font-bold ${overallAttendance >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>
                {overallAttendance >= 75 ? 'ELIGIBLE' : 'CONDONATION'}
              </span>
            </div>
            <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${overallAttendance >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(overallAttendance, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> Min. 75% required for Anna Univ Exams
            </p>
          </div>

          {/* Quick Demo Switcher */}
          <button
            onClick={() => switchDemoUser(role === 'student' ? 'admin' : 'student')}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <School className="w-3.5 h-3.5" />
            Switch to {role === 'student' ? 'Admin Portal' : 'Student Portal'}
          </button>
        </div>
      </aside>
    </>
  );
};
