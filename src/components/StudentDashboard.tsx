import React from 'react';
import { 
  Bot, 
  CalendarCheck, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Bell, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  FileText,
  Download,
  Award,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AttendanceSubject, TimetableSlot, Assignment, ExamSchedule, Announcement } from '../types';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
  attendanceOverall: { attended: number; total: number; percentage: number; status: string };
  attendanceSubjects: AttendanceSubject[];
  todaySchedule: TimetableSlot[];
  assignments: Assignment[];
  exams: ExamSchedule[];
  announcements: Announcement[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  attendanceOverall,
  attendanceSubjects,
  todaySchedule,
  assignments,
  exams,
  announcements
}) => {
  const { user } = useAuth();

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const upcomingExam = exams[0];
  const urgentAnnouncements = announcements.slice(0, 3);
  const lowAttendanceSubject = attendanceSubjects.find(s => s.percentage < 75);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-32 -mb-10 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Academic Year 2026-2027 • V Semester</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">{user?.name}</span> 👋
            </h1>
            <p className="text-sm text-slate-300 font-normal leading-relaxed">
              Here is your academic overview for today. You have <strong className="text-white">{todaySchedule.length} classes</strong> scheduled and <strong className="text-white">{pendingAssignments.length} assignments</strong> awaiting submission.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300 font-mono">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                Reg No: <strong>{user?.registerNumber}</strong>
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                Dept: <strong>{user?.department}</strong>
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                Section: <strong>{user?.section || 'A'}</strong>
              </span>
            </div>
          </div>

          {/* Quick AI Tutor prompt banner button */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Bot className="w-5 h-5 text-slate-950" />
              Ask AI Academic Doubt
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-cyan-300" />
              Check Attendance ({attendanceOverall.percentage}%)
            </button>
          </div>
        </div>
      </div>

      {/* Warning banner if any subject has low attendance */}
      {lowAttendanceSubject && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-2xl shadow-sm flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold">Attendance Alert:</span> Your attendance in{' '}
            <strong>{lowAttendanceSubject.name} ({lowAttendanceSubject.code})</strong> is{' '}
            <strong className="text-red-600 font-mono">{lowAttendanceSubject.percentage}%</strong>, which is below the mandatory university threshold of 75%. Please attend upcoming lectures to avoid exam condonation penalty.
          </div>
        </div>
      )}

      {/* Key Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Attendance</span>
            <div className={`p-2 rounded-xl ${attendanceOverall.percentage >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {attendanceOverall.percentage}%
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              attendanceOverall.percentage >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              {attendanceOverall.percentage >= 75 ? 'Eligible' : 'Warning'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {attendanceOverall.attended} of {attendanceOverall.total} lectures attended
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${attendanceOverall.percentage >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(attendanceOverall.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* CGPA / Academic Performance */}
        <div 
          onClick={() => onNavigate('results')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Cumulative CGPA</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {user?.cgpa || 8.74}
            </span>
            <span className="text-xs text-slate-400">/ 10.0</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> First Class with Distinction
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Previous Semester SGPA: <strong>8.85</strong>
          </p>
        </div>

        {/* Pending Assignments */}
        <div 
          onClick={() => onNavigate('assignments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Assignments</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {pendingAssignments.length}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Action Required
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate">
            Nearest: {pendingAssignments[0]?.subjectName || 'Database Systems'}
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            Due on {pendingAssignments[0]?.dueDate || 'Oct 22'}
          </p>
        </div>

        {/* Next Exam Card */}
        <div 
          onClick={() => onNavigate('results')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Next Assessment</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {upcomingExam ? upcomingExam.examType.replace('Internal Assessment', 'IA') : 'IA-II Exam'}
            </span>
          </div>
          <p className="text-xs text-blue-700 font-medium mt-1 truncate">
            {upcomingExam?.subjectCode} • {upcomingExam?.subjectName}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" /> Date: {upcomingExam?.date || 'Nov 03, 2026'}
          </p>
        </div>
      </div>

      {/* Main Grid: Today's Timetable + Quick Actions & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Timetable */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Today&apos;s Class Schedule (Monday)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                LH-302 Lecture Hall &amp; Laboratory Sessions
              </p>
            </div>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              Full Week &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {todaySchedule.map((slot, index) => {
              const isCurrentPeriod = index === 2; // e.g., period 3
              return (
                <div 
                  key={slot.id}
                  className={`py-3.5 px-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isCurrentPeriod ? 'bg-blue-50/70 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      isCurrentPeriod 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      P{slot.period}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{slot.subjectName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-600">
                          {slot.subjectCode}
                        </span>
                        {slot.isLab && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                            Practical Lab
                          </span>
                        )}
                        {isCurrentPeriod && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white animate-pulse">
                            Current Period
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                        <span>Faculty: <strong className="text-slate-700">{slot.faculty}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {slot.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="inline-block px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs font-semibold">
                      {slot.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Quick Features Access & Urgent Announcements */}
        <div className="space-y-6">
          {/* Quick Access Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-slate-400">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigate('ai-assistant')}
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-100 text-left transition-all hover:scale-[1.02] cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">ApexEdu AI</div>
                <div className="text-[10px] text-slate-500">Ask coding &amp; exam doubts</div>
              </button>

              <button
                onClick={() => onNavigate('assignments')}
                className="p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100 text-left transition-all hover:scale-[1.02] cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-2 shadow-xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Submit Work</div>
                <div className="text-[10px] text-slate-500">2 assignments due</div>
              </button>

              <button
                onClick={() => onNavigate('materials')}
                className="p-3 rounded-2xl bg-cyan-50/70 hover:bg-cyan-100/70 border border-cyan-100 text-left transition-all hover:scale-[1.02] cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center mb-2 shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Lecture Notes</div>
                <div className="text-[10px] text-slate-500">Download syllabus units</div>
              </button>

              <button
                onClick={() => onNavigate('results')}
                className="p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100 text-left transition-all hover:scale-[1.02] cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2 shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Grade Card</div>
                <div className="text-[10px] text-slate-500">Semester Marksheet</div>
              </button>
            </div>
          </div>

          {/* Urgent Notices */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-cyan-600" />
                Important Notices
              </h3>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                View All &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {urgentAnnouncements.map((ann) => (
                <div 
                  key={ann.id}
                  onClick={() => onNavigate('announcements')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-bold text-blue-600 uppercase tracking-wider">
                      {ann.category}
                    </span>
                    <span>{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {ann.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
