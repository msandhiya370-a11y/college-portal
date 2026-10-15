import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  Plus, 
  Trash2, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  BookOpen,
  School,
  Layers
} from 'lucide-react';
import { TimetableSlot } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface TimetableSectionProps {
  schedule: TimetableSlot[];
  onRefresh: () => void;
}

export const TimetableSection: React.FC<TimetableSectionProps> = ({ schedule, onRefresh }) => {
  const { role } = useAuth();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  
  // Default to today if mon-sat, else monday
  const currentDayName = 'Monday'; // Today
  const [selectedDay, setSelectedDay] = useState<string>(currentDayName);
  const [viewMode, setViewMode] = useState<'daily' | 'matrix'>('daily');
  const [showAddModal, setShowAddModal] = useState(false);

  // New slot form state
  const [newDay, setNewDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [newPeriod, setNewPeriod] = useState(1);
  const [newTime, setNewTime] = useState('09:00 - 09:50 AM');
  const [newCode, setNewCode] = useState('IT3501');
  const [newName, setNewName] = useState('Database Management Systems');
  const [newFaculty, setNewFaculty] = useState('Dr. S. Meenakshi');
  const [newRoom, setNewRoom] = useState('LH-302');
  const [newIsLab, setNewIsLab] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daySlots = schedule.filter(s => s.day === selectedDay).sort((a, b) => a.period - b.period);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.addTimetableSlot({
        day: newDay,
        period: Number(newPeriod),
        time: newTime,
        subjectCode: newCode,
        subjectName: newName,
        faculty: newFaculty,
        room: newRoom,
        isLab: newIsLab
      });
      setShowAddModal(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to add timetable slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (confirm('Delete this timetable period?')) {
      try {
        await api.deleteTimetableSlot(id);
        onRefresh();
      } catch (err: any) {
        alert(err.message || 'Failed to delete slot');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-7 h-7 text-blue-600" />
            Class Timetable &amp; Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department of Information Technology • B.Tech III Year / Sem V • Section A
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'daily' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day Timeline
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'matrix' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full Week Matrix
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Print Timetable"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {role === 'admin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Period</span>
            </button>
          )}
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {days.map(day => {
          const isToday = day === currentDayName;
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <span>{day}</span>
              {isToday && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                }`}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* View Mode: Daily Timeline */}
      {viewMode === 'daily' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>{selectedDay}&apos;s Schedule</span>
                {selectedDay === currentDayName && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Current Day
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                {daySlots.length} periods scheduled • Regular classes start at 09:00 AM
              </p>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Venue: LH-302 / Dept Labs
            </div>
          </div>

          <div className="space-y-3">
            {daySlots.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No classes scheduled for {selectedDay}.
              </div>
            ) : (
              daySlots.map((slot, index) => {
                const isCurrent = selectedDay === currentDayName && index === 2; // highlight 3rd period for demo

                return (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Period Badge */}
                      <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 font-mono ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                          : slot.isLab
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-900 text-white'
                      }`}>
                        <span className="text-[10px] uppercase font-bold opacity-80">Period</span>
                        <span className="text-base font-extrabold leading-none">{slot.period}</span>
                      </div>

                      {/* Subject and Faculty */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            {slot.subjectName}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-200/80 text-slate-700">
                            {slot.subjectCode}
                          </span>
                          {slot.isLab && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-700">
                              Practical Laboratory
                            </span>
                          )}
                          {isCurrent && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider animate-pulse">
                              Happening Now
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                          <span>Faculty: <strong className="text-slate-800">{slot.faculty}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            {slot.room}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono font-bold text-xs shadow-2xs">
                        {slot.time}
                      </span>

                      {role === 'admin' && (
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Period"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* View Mode: Full Week Matrix */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-x-auto p-4 sm:p-6">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                <th className="py-3 px-3">Day</th>
                <th className="py-3 px-3">P1 (09:00)</th>
                <th className="py-3 px-3">P2 (09:50)</th>
                <th className="py-3 px-3">P3 (10:55)</th>
                <th className="py-3 px-3">P4 (11:45)</th>
                <th className="py-3 px-3">P5 (01:30)</th>
                <th className="py-3 px-3">P6 (03:15)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {days.map(day => {
                const daySlotsList = schedule.filter(s => s.day === day);
                const isToday = day === currentDayName;

                return (
                  <tr key={day} className={`hover:bg-slate-50/70 transition-colors ${isToday ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-4 px-3 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {day}
                        {isToday && (
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        )}
                      </div>
                    </td>
                    {[1, 2, 3, 4, 5, 6].map(pNum => {
                      const slot = daySlotsList.find(s => s.period === pNum);
                      if (!slot) {
                        return (
                          <td key={pNum} className="py-4 px-3 text-slate-300 font-mono text-[11px]">
                            -
                          </td>
                        );
                      }

                      return (
                        <td key={pNum} className="py-4 px-3">
                          <div className={`p-2 rounded-xl border text-[11px] ${
                            slot.isLab 
                              ? 'bg-purple-50 border-purple-200 text-purple-900' 
                              : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}>
                            <div className="font-bold truncate">{slot.subjectCode}</div>
                            <div className="text-[10px] text-slate-500 truncate">{slot.room}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Period Modal (Admin) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Add New Timetable Slot
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Create a period schedule for B.Tech IT Semester V
            </p>

            <form onSubmit={handleAddSlot} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Day of Week:</label>
                  <select
                    value={newDay}
                    onChange={(e: any) => setNewDay(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Period Number:</label>
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>Period {n}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Class Timing:</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 09:00 - 09:50 AM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Subject Code:</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. IT3501"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Classroom / Hall:</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="e.g. LH-302"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Subject Title:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Database Management Systems"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Faculty Name:</label>
                <input
                  type="text"
                  value={newFaculty}
                  onChange={(e) => setNewFaculty(e.target.value)}
                  placeholder="e.g. Dr. S. Meenakshi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLab"
                  checked={newIsLab}
                  onChange={(e) => setNewIsLab(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="isLab" className="text-xs font-medium text-slate-700">
                  This is a 2-hour Practical Laboratory session
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                >
                  {isSubmitting ? 'Adding...' : 'Create Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
