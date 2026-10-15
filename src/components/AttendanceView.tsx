import React, { useState } from 'react';
import { 
  CalendarCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  TrendingUp, 
  Calculator, 
  ShieldAlert, 
  Clock, 
  FileCheck,
  ChevronDown
} from 'lucide-react';
import { AttendanceSubject } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface AttendanceViewProps {
  overall: { attended: number; total: number; percentage: number; status: string };
  subjects: AttendanceSubject[];
  onRefresh: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ overall, subjects, onRefresh }) => {
  const { role } = useAuth();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [targetPercentage, setTargetPercentage] = useState<number>(75);
  const [editingSubject, setEditingSubject] = useState<AttendanceSubject | null>(null);
  const [attendedInput, setAttendedInput] = useState<number>(0);
  const [totalInput, setTotalInput] = useState<number>(0);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Calculate classes required or classes that can be missed
  const calculateAttendanceGoal = (attended: number, total: number, target: number) => {
    const targetRatio = target / 100;
    const currentRatio = total > 0 ? attended / total : 0;

    if (currentRatio >= targetRatio) {
      // Can skip: (attended / (total + x)) >= targetRatio => attended >= targetRatio * total + targetRatio * x => x <= (attended - targetRatio * total) / targetRatio
      const canSkip = Math.floor((attended - targetRatio * total) / targetRatio);
      return {
        type: 'SAFE' as const,
        count: Math.max(0, canSkip),
        text: `You can safely miss the next ${canSkip} lecture(s) and still maintain ≥ ${target}% attendance.`
      };
    } else {
      // Must attend: ((attended + x) / (total + x)) >= targetRatio => attended + x >= targetRatio * total + targetRatio * x => x(1 - targetRatio) >= targetRatio * total - attended
      const needed = Math.ceil((targetRatio * total - attended) / (1 - targetRatio));
      return {
        type: 'DEFICIT' as const,
        count: Math.max(1, needed),
        text: `You must attend the next ${needed} consecutive lecture(s) without absence to reach ${target}% attendance.`
      };
    }
  };

  const simulation = selectedSubject 
    ? calculateAttendanceGoal(selectedSubject.attended, selectedSubject.total, targetPercentage)
    : null;

  const handleAdminUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    setSaveLoading(true);
    try {
      await api.updateAttendance(editingSubject.id, attendedInput, totalInput);
      setSuccessMsg(`Attendance updated for ${editingSubject.name}`);
      setEditingSubject(null);
      onRefresh();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update attendance');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-blue-600" />
            Attendance Management &amp; Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Subject-wise attendance tracking, AICTE/Anna University condonation rules, and predictive calculator
          </p>
        </div>

        {role === 'admin' && (
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            Admin Mode: You have permission to update attendance records
          </div>
        )}
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Top Cards: Overall Attendance + Regulatory Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Percentage Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Overall College Attendance</span>
            <span className={`px-2 py-0.5 rounded-full font-bold ${
              overall.percentage >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              {overall.percentage >= 75 ? 'Eligible for Exams' : 'Condonation Zone'}
            </span>
          </div>

          <div className="my-4 flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              {/* Radial circle representation */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={overall.percentage >= 75 ? 'text-blue-600' : 'text-red-500'}
                  strokeDasharray={`${overall.percentage}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {overall.percentage}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Aggregated</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div>Total Conducted: <strong className="text-slate-900 font-mono">{overall.total} hrs</strong></div>
              <div>Total Attended: <strong className="text-emerald-700 font-mono">{overall.attended} hrs</strong></div>
              <div>Total Absent: <strong className="text-red-600 font-mono">{overall.total - overall.attended} hrs</strong></div>
              <div className="pt-1 text-[11px] text-slate-400">Semester Term: Week 11 of 16</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            {overall.percentage >= 75 
              ? '✓ You meet the Anna University 75% attendance threshold for semester examinations.'
              : '⚠ Your overall percentage is below 75%. Medical certificates or HOD condonation required.'}
          </div>
        </div>

        {/* Regulatory Thresholds */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              University Attendance Norms
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">≥ 75% : Full Eligibility</div>
                  <div className="text-[11px] text-emerald-700">Eligible to sit for all theory and laboratory end-semester exams.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">65% - 74% : Medical Condonation</div>
                  <div className="text-[11px] text-amber-700">Permitted upon Dean approval with genuine medical certificate &amp; fee.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-red-50 text-red-900 border border-red-100">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">&lt; 65% : Redo / Detained</div>
                  <div className="text-[11px] text-red-700">Cannot appear for exams; must re-register the semester in next academic year.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Simulator / Goal Calculator */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg border border-blue-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                Predictive Calculator
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-mono">
                What-If Tool
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Select Subject:</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code}: {s.name} ({s.percentage}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                  <span>Target Threshold:</span>
                  <span className="font-mono font-bold text-cyan-300">{targetPercentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="65"
                    max="90"
                    step="5"
                    value={targetPercentage}
                    onChange={(e) => setTargetPercentage(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {simulation && (
                <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed border ${
                  simulation.type === 'SAFE' 
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
                    : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {simulation.type === 'SAFE' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    {simulation.type === 'SAFE' ? 'Safe Buffer Available' : 'Attendance Deficit'}
                  </div>
                  {simulation.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Detailed Table & Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Subject-Wise Breakdown</h2>
            <p className="text-xs text-slate-500 mt-0.5">Continuous assessment attendance records for B.Tech IT Semester V</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Subject &amp; Code</th>
                <th className="px-6 py-3.5">Faculty In-Charge</th>
                <th className="px-4 py-3.5 text-center">Attended</th>
                <th className="px-4 py-3.5 text-center">Conducted</th>
                <th className="px-6 py-3.5">Attendance Progress</th>
                <th className="px-4 py-3.5 text-center">Percentage</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                {role === 'admin' && <th className="px-4 py-3.5 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((s) => {
                const isSafe = s.percentage >= 75;
                const isBorderline = s.percentage >= 75 && s.percentage <= 80;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {s.code} • {s.credits} Credits
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{s.faculty}</td>
                    <td className="px-4 py-4 text-center font-mono font-bold text-emerald-700">{s.attended}</td>
                    <td className="px-4 py-4 text-center font-mono text-slate-600">{s.total}</td>
                    <td className="px-6 py-4 w-48">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            s.percentage >= 80 
                              ? 'bg-emerald-500' 
                              : s.percentage >= 75 
                                ? 'bg-amber-500' 
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(s.percentage, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-mono font-bold text-sm ${
                        s.percentage >= 80 ? 'text-emerald-700' : s.percentage >= 75 ? 'text-amber-700' : 'text-red-600'
                      }`}>
                        {s.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.percentage >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.percentage >= 75
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {s.percentage >= 80 ? 'SAFE' : s.percentage >= 75 ? 'BORDERLINE' : 'LOW (<75%)'}
                      </span>
                    </td>
                    {role === 'admin' && (
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => {
                            setEditingSubject(s);
                            setAttendedInput(s.attended);
                            setTotalInput(s.total);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Edit Modal */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Update Attendance Record
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {editingSubject.code}: {editingSubject.name}
            </p>

            <form onSubmit={handleAdminUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Classes Attended:
                </label>
                <input
                  type="number"
                  min="0"
                  value={attendedInput}
                  onChange={(e) => setAttendedInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Total Classes Conducted:
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalInput}
                  onChange={(e) => setTotalInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 text-blue-900 text-xs">
                New Calculated Percentage:{' '}
                <strong className="font-mono">
                  {totalInput > 0 ? ((attendedInput / totalInput) * 100).toFixed(1) : 0}%
                </strong>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                >
                  {saveLoading ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
