/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StudentDashboard } from './components/StudentDashboard';
import { AiAssistant } from './components/AiAssistant';
import { AttendanceView } from './components/AttendanceView';
import { TimetableSection } from './components/TimetableSection';
import { AssignmentsView } from './components/AssignmentsView';
import { ResultsView } from './components/ResultsView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { ProfileView } from './components/ProfileView';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { api } from './services/api';
import { AttendanceSubject, TimetableSlot, Assignment, StudyMaterial, ExamSchedule, SemesterResult, Announcement } from './types';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

function MainApp() {
  const { user, isAuthenticated, role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core College State
  const [attendanceOverall, setAttendanceOverall] = useState({
    attended: 200,
    total: 233,
    percentage: 85.8,
    status: 'SAFE'
  });
  const [attendanceSubjects, setAttendanceSubjects] = useState<AttendanceSubject[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [results, setResults] = useState<SemesterResult[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Fetch all initial data
  const loadPortalData = async () => {
    try {
      const [attData, ttData, asgData, matData, exData, resData, annData] = await Promise.allSettled([
        api.getAttendance(),
        api.getTimetable(),
        api.getAssignments(),
        api.getMaterials(),
        api.getExams(),
        api.getResults(),
        api.getAnnouncements(),
      ]);

      if (attData.status === 'fulfilled') {
        setAttendanceOverall(attData.value.overall);
        setAttendanceSubjects(attData.value.subjects);
      }
      if (ttData.status === 'fulfilled') {
        setTimetable(ttData.value.schedule);
      }
      if (asgData.status === 'fulfilled') {
        setAssignments(asgData.value.assignments);
      }
      if (matData.status === 'fulfilled') {
        setMaterials(matData.value.materials);
      }
      if (exData.status === 'fulfilled') {
        setExams(exData.value.exams);
      }
      if (resData.status === 'fulfilled') {
        setResults(resData.value.results);
      }
      if (annData.status === 'fulfilled') {
        setAnnouncements(annData.value.announcements);
      }
    } catch (err) {
      console.error('Failed to load portal data:', err);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  // Today's schedule (Monday)
  const todaySchedule = timetable
    .filter(slot => slot.day === 'Monday')
    .sort((a, b) => a.period - b.period);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top institutional navigation bar */}
      <Navbar
        onOpenAi={() => setActiveTab('ai-assistant')}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        announcements={announcements}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          pendingAssignmentsCount={assignments.filter(a => a.status === 'pending').length}
          overallAttendance={attendanceOverall.percentage}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <StudentDashboard
              onNavigate={(tab) => setActiveTab(tab)}
              attendanceOverall={attendanceOverall}
              attendanceSubjects={attendanceSubjects}
              todaySchedule={todaySchedule}
              assignments={assignments}
              exams={exams}
              announcements={announcements}
            />
          )}

          {activeTab === 'ai-assistant' && (
            <AiAssistant currentSubjectContext="B.Tech IT - Semester 5 Subjects" />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              overall={attendanceOverall}
              subjects={attendanceSubjects}
              onRefresh={loadPortalData}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableSection
              schedule={timetable}
              onRefresh={loadPortalData}
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentsView
              assignments={assignments}
              materials={materials}
              onRefresh={loadPortalData}
            />
          )}

          {activeTab === 'materials' && (
            <AssignmentsView
              assignments={assignments}
              materials={materials}
              onRefresh={loadPortalData}
            />
          )}

          {activeTab === 'results' && (
            <ResultsView
              results={results}
              exams={exams}
              onRefresh={loadPortalData}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsView
              announcements={announcements}
              onRefresh={loadPortalData}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView />
          )}

          {activeTab === 'admin' && (
            <AdminPortal
              onRefreshAll={loadPortalData}
              subjects={attendanceSubjects}
              announcements={announcements}
              assignments={assignments}
              materials={materials}
            />
          )}
        </main>
      </div>

      {/* Floating AI Academic Copilot quick button on bottom right */}
      {activeTab !== 'ai-assistant' && (
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all border border-blue-400/40 cursor-pointer group"
          title="Ask ApexEdu AI Academic Tutor"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping"></span>
          </div>
          <span className="hidden xs:inline">Ask</span> ApexEdu AI
          <span className="bg-white/20 text-cyan-200 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
            Gemini
          </span>
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
