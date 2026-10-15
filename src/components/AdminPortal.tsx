import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  CalendarCheck, 
  Clock, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  Bell, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  BarChart3
} from 'lucide-react';
import { User, AttendanceSubject, TimetableSlot, Assignment, StudyMaterial, Announcement, SemesterResult } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface AdminPortalProps {
  onRefreshAll: () => void;
  subjects: AttendanceSubject[];
  announcements: Announcement[];
  assignments: Assignment[];
  materials: StudyMaterial[];
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onRefreshAll,
  subjects,
  announcements,
  assignments,
  materials
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'attendance' | 'announcements' | 'assignments' | 'analytics'>('students');

  // Students list
  const [students, setStudents] = useState<User[]>([]);
  const [searchStudent, setSearchStudent] = useState('');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // New student form
  const [newStdName, setNewStdName] = useState('');
  const [newStdRegNo, setNewStdRegNo] = useState('');
  const [newStdDept, setNewStdDept] = useState('Information Technology');
  const [newStdYear, setNewStdYear] = useState('III Year');
  const [newStdSem, setNewStdSem] = useState(5);
  const [newStdEmail, setNewStdEmail] = useState('');
  const [newStdPhone, setNewStdPhone] = useState('+91 98765 00000');
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // Load students
  const loadStudents = async () => {
    try {
      const data = await api.getAdminStudents();
      setStudents(data.students);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingStudent(true);
    try {
      await api.createAdminStudent({
        name: newStdName,
        registerNumber: newStdRegNo,
        department: newStdDept,
        year: newStdYear,
        semester: Number(newStdSem),
        email: newStdEmail,
        phone: newStdPhone
      });
      setShowAddStudentModal(false);
      setToastMessage(`Student ${newStdName} (${newStdRegNo}) enrolled successfully!`);
      setNewStdName('');
      setNewStdRegNo('');
      setNewStdEmail('');
      loadStudents();
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to create student');
    } finally {
      setIsAddingStudent(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    (s.registerNumber && s.registerNumber.toLowerCase().includes(searchStudent.toLowerCase())) ||
    s.email.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Administrative Management Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Faculty &amp; Academic Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Welcome, <strong>{user?.name}</strong> (Head of Department &amp; Chief Academic Officer)
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={() => {
              onRefreshAll();
              loadStudents();
              setToastMessage('System state refreshed from server.');
              setTimeout(() => setToastMessage(''), 2000);
            }}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors cursor-pointer"
          >
            Sync Portal Data
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {toastMessage}
        </div>
      )}

      {/* Admin KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Enrolled Students
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {students.length > 0 ? students.length + 62 : 64}
          </div>
          <p className="text-xs text-slate-500 mt-1">B.Tech IT 2023-27 Batch</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Active Courses
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono">
            {subjects.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Theory &amp; Practical Modules</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Active Assignments
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 font-mono">
            {assignments.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Published coursework</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Notice Broadcasts
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
            {announcements.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Issued circulars</p>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'students' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Academic Reports &amp; Analytics</span>
        </button>
      </div>

      {/* Tab: Student Directory */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Enrollment Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage registered student profiles and academic eligibility</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Search student or register no..."
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Register Number</th>
                  <th className="px-4 py-3">Department &amp; Year</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3 text-center">CGPA</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                      <img
                        src={std.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=faces'}
                        alt={std.name}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                      />
                      <span>{std.name}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-700">{std.registerNumber}</td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {std.department} • {std.year} (Sem {std.semester})
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">{std.email}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">{std.phone}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-emerald-700">{std.cgpa || 8.50}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Analytics & Reports */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Department Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase">Overall Attendance Rate</div>
                <div className="text-2xl font-mono font-bold text-slate-900">86.2%</div>
                <div className="text-xs text-emerald-600 font-medium">92% of students above 75% mark</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase">Assignment Submission Rate</div>
                <div className="text-2xl font-mono font-bold text-slate-900">94.8%</div>
                <div className="text-xs text-blue-600 font-medium">Average grade: A (85.4/100)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase">Campus Placement Eligibility</div>
                <div className="text-2xl font-mono font-bold text-slate-900">58 / 64</div>
                <div className="text-xs text-emerald-600 font-medium">90.6% cleared with zero standing arrears</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Enroll New Student
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Register student into College Database ERP
            </p>

            <form onSubmit={handleCreateStudent} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Student Name:</label>
                <input
                  type="text"
                  value={newStdName}
                  onChange={(e) => setNewStdName(e.target.value)}
                  placeholder="e.g. Vignesh S"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Register Number:</label>
                  <input
                    type="text"
                    value={newStdRegNo}
                    onChange={(e) => setNewStdRegNo(e.target.value)}
                    placeholder="e.g. 21IT102"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Semester:</label>
                  <select
                    value={newStdSem}
                    onChange={(e) => setNewStdSem(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Department:</label>
                  <input
                    type="text"
                    value={newStdDept}
                    onChange={(e) => setNewStdDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Year of Study:</label>
                  <input
                    type="text"
                    value={newStdYear}
                    onChange={(e) => setNewStdYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">College Email Address:</label>
                <input
                  type="email"
                  value={newStdEmail}
                  onChange={(e) => setNewStdEmail(e.target.value)}
                  placeholder="e.g. vignesh.it@college.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Phone:</label>
                <input
                  type="text"
                  value={newStdPhone}
                  onChange={(e) => setNewStdPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingStudent}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                >
                  {isAddingStudent ? 'Registering...' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
