import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  MapPin, 
  Printer, 
  ShieldCheck, 
  ChevronDown, 
  CheckCircle2, 
  TrendingUp,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { SemesterResult, ExamSchedule } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface ResultsViewProps {
  results: SemesterResult[];
  exams: ExamSchedule[];
  onRefresh: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ results, exams, onRefresh }) => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'results' | 'exams'>('results');
  const [selectedSemester, setSelectedSemester] = useState<number>(results[0]?.semester || 4);

  // Admin edit marks modal
  const [editingResult, setEditingResult] = useState<{
    semester: number;
    subjectCode: string;
    subjectName: string;
    internal: number;
    external: number;
    grade: string;
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const currentResult = results.find(r => r.semester === selectedSemester) || results[0];

  const handlePrintGradeCard = () => {
    window.print();
  };

  const handleAdminUpdateMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;
    setIsUpdating(true);
    try {
      await api.updateResult({
        semester: editingResult.semester,
        subjectCode: editingResult.subjectCode,
        internalMarks: Number(editingResult.internal),
        externalMarks: Number(editingResult.external),
        grade: editingResult.grade
      });
      setSuccessToast(`Marks updated for ${editingResult.subjectCode}`);
      setEditingResult(null);
      onRefresh();
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update result');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-blue-600" />
            Exams &amp; Academic Grade Sheet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official semester grade points, internal assessment records, and university examination timetable
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Tab Toggle */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'results' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semester Results
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'exams' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming Exams ({exams.length})
            </button>
          </div>

          {activeTab === 'results' && (
            <button
              onClick={handlePrintGradeCard}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Print Marksheet</span>
            </button>
          )}
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successToast}
        </div>
      )}

      {/* View: Semester Results */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {/* Semester Selector & CGPA Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Semester Switcher Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Select Semester
              </span>
              <div className="mt-2 space-y-1">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {results.map(r => (
                    <option key={r.semester} value={r.semester}>
                      Semester {r.semester} ({r.academicYear})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 pt-1">
                  Status:{' '}
                  <span className="text-emerald-700 font-bold uppercase">
                    {currentResult?.status || 'PROMOTED'}
                  </span>
                </div>
              </div>
            </div>

            {/* SGPA Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Semester GPA (SGPA)
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-blue-600 font-mono">
                  {currentResult?.sgpa}
                </span>
                <span className="text-xs text-slate-400">/ 10.0</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Semester Rank: 4 of 64
              </div>
            </div>

            {/* Cumulative CGPA Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cumulative CGPA
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-purple-600 font-mono">
                  {currentResult?.cgpa || user?.cgpa || 8.74}
                </span>
                <span className="text-xs text-slate-400">/ 10.0</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                ★ First Class with Distinction
              </div>
            </div>

            {/* Credits Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Credits Earned
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  {currentResult?.earnedCredits}
                </span>
                <span className="text-xs text-slate-400">/ {currentResult?.totalCredits}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                All 7 registered papers cleared (0 arrears)
              </div>
            </div>
          </div>

          {/* Official Grade Card Format */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Institution Header inside Marksheet */}
            <div className="p-6 bg-slate-900 text-white border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
                    OFFICE OF THE CONTROLLER OF EXAMINATIONS
                  </div>
                  <h2 className="text-lg font-extrabold text-white">
                    PROVISIONAL GRADE SHEET &amp; PERFORMANCE RECORD
                  </h2>
                  <div className="text-xs text-slate-300 mt-1">
                    B.Tech Information Technology • Semester {currentResult?.semester} Examinations
                  </div>
                </div>

                <div className="text-xs space-y-0.5 sm:text-right font-mono bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <div>Student: <strong className="text-white">{user?.name}</strong></div>
                  <div>Register No: <strong className="text-cyan-300">{user?.registerNumber}</strong></div>
                  <div>Batch: <strong className="text-slate-300">2023 - 2027</strong></div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Course Code</th>
                    <th className="px-6 py-3.5">Course Title</th>
                    <th className="px-4 py-3.5 text-center">Credits</th>
                    <th className="px-4 py-3.5 text-center">Internal (/50)</th>
                    <th className="px-4 py-3.5 text-center">External (/50)</th>
                    <th className="px-4 py-3.5 text-center">Total (/100)</th>
                    <th className="px-4 py-3.5 text-center">Grade</th>
                    <th className="px-4 py-3.5 text-center">Grade Point</th>
                    <th className="px-4 py-3.5 text-center">Result</th>
                    {role === 'admin' && <th className="px-4 py-3.5 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentResult?.subjects.map((sub) => (
                    <tr key={sub.code} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">{sub.code}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{sub.name}</td>
                      <td className="px-4 py-4 text-center font-mono text-slate-600">{sub.credits}</td>
                      <td className="px-4 py-4 text-center font-mono text-slate-700">{sub.internalMarks}</td>
                      <td className="px-4 py-4 text-center font-mono text-slate-700">{sub.externalMarks}</td>
                      <td className="px-4 py-4 text-center font-mono font-bold text-slate-900">{sub.totalMarks}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                          sub.grade === 'O' 
                            ? 'bg-purple-100 text-purple-800' 
                            : sub.grade === 'A+' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center font-mono font-bold text-slate-800">{sub.gradePoints}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {sub.result}
                        </span>
                      </td>
                      {role === 'admin' && (
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => setEditingResult({
                              semester: currentResult.semester,
                              subjectCode: sub.code,
                              subjectName: sub.name,
                              internal: sub.internalMarks,
                              external: sub.externalMarks,
                              grade: sub.grade
                            })}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* University Grading Scale Reference Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700">Grading System:</span>
                <span>O (91-100, 10 Pts)</span>
                <span>•</span>
                <span>A+ (81-90, 9 Pts)</span>
                <span>•</span>
                <span>A (71-80, 8 Pts)</span>
                <span>•</span>
                <span>B+ (61-70, 7 Pts)</span>
                <span>•</span>
                <span>RA (Re-Appear &lt;50)</span>
              </div>
              <div className="font-mono text-slate-400">
                Official Computer Generated Result Sheet
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View: Upcoming Examinations */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs text-blue-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Internal Assessment Test - II (Odd Semester 2026-27) Timetable. Hall tickets will be issued 3 days prior.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((ex) => (
              <div
                key={ex.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                    {ex.examType}
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">
                    {ex.subjectCode}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {ex.subjectName}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
                    <span className="flex items-center gap-1 font-semibold text-slate-900">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {ex.date}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-700">{ex.time}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center gap-1 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    Examination Venue: <strong>{ex.hall}</strong>
                  </div>
                  <div className="text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                    <strong>Syllabus Scope:</strong> {ex.syllabus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Edit Marks Modal */}
      {editingResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Update Examination Marks
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {editingResult.subjectCode}: {editingResult.subjectName}
            </p>

            <form onSubmit={handleAdminUpdateMarks} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Internal Marks (/50):</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={editingResult.internal}
                  onChange={(e) => setEditingResult({ ...editingResult, internal: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">External Marks (/50):</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={editingResult.external}
                  onChange={(e) => setEditingResult({ ...editingResult, external: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Grade:</label>
                <select
                  value={editingResult.grade}
                  onChange={(e) => setEditingResult({ ...editingResult, grade: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="O">O (Outstanding, 91-100)</option>
                  <option value="A+">A+ (Excellent, 81-90)</option>
                  <option value="A">A (Very Good, 71-80)</option>
                  <option value="B+">B+ (Good, 61-70)</option>
                  <option value="B">B (Above Average, 51-60)</option>
                  <option value="RA">RA (Re-Appear, &lt;50)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingResult(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                >
                  {isUpdating ? 'Saving...' : 'Save Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
