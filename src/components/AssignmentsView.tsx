import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  FileCheck, 
  Plus, 
  ExternalLink,
  Award,
  Filter,
  Paperclip,
  Check
} from 'lucide-react';
import { Assignment, StudyMaterial } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface AssignmentsViewProps {
  assignments: Assignment[];
  materials: StudyMaterial[];
  onRefresh: () => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({ assignments, materials, onRefresh }) => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'assignments' | 'materials'>('assignments');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  // Submit Modal state
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Material Preview Modal state
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  // Admin New Assignment Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('IT3501');
  const [newSubjectName, setNewSubjectName] = useState('Database Management Systems');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-10-30');
  const [newMarks, setNewMarks] = useState(20);

  // Filtered assignments
  const filteredAssignments = assignments.filter(asg => {
    const matchesStatus = filterStatus === 'all' ? true : asg.status === filterStatus;
    const matchesSubject = selectedSubjectFilter === 'All' ? true : asg.subjectCode === selectedSubjectFilter;
    return matchesStatus && matchesSubject;
  });

  // Filtered materials
  const filteredMaterials = selectedSubjectFilter === 'All'
    ? materials
    : materials.filter(m => m.subjectCode === selectedSubjectFilter);

  // Subject codes list
  const subjectsList = Array.from(new Set([
    ...assignments.map(a => a.subjectCode),
    ...materials.map(m => m.subjectCode)
  ]));

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment) return;
    setIsSubmitting(true);
    try {
      await api.submitAssignment(
        submittingAssignment.id, 
        submissionNote, 
        uploadedFileName || 'arun_assignment_submission.pdf'
      );
      setSuccessToast(`Assignment "${submittingAssignment.title}" submitted successfully!`);
      setSubmittingAssignment(null);
      setSubmissionNote('');
      setUploadedFileName('');
      onRefresh();
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createAssignment({
        title: newTitle,
        subjectCode: newSubjectCode,
        subjectName: newSubjectName,
        description: newDescription,
        dueDate: newDueDate,
        totalMarks: Number(newMarks)
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewDescription('');
      setSuccessToast('New assignment published to student portal!');
      onRefresh();
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadSimulation = (itemTitle: string) => {
    const content = `APEX INSTITUTE OF TECHNOLOGY - ACADEMIC REPOSITORY\n\nDocument: ${itemTitle}\nDepartment: Information Technology\nAcademic Year: 2026-2027\n\nDownloaded successfully from the student assistant portal.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itemTitle.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Coursework &amp; Study Resources
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Submit coursework, track evaluation marks, and download verified university lecture notes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Tab Toggle */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'assignments' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assignments ({assignments.length})
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'materials' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Study Notes ({materials.length})
            </button>
          </div>

          {role === 'admin' && activeTab === 'assignments' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Assignment</span>
            </button>
          )}
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successToast}
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject:</span>
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Subjects</option>
            {subjectsList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {activeTab === 'assignments' && (
          <div className="flex items-center gap-1.5">
            {(['all', 'pending', 'submitted', 'graded'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterStatus === st 
                    ? 'bg-blue-600 text-white shadow-2xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content View: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs text-slate-400 text-xs">
              No assignments found matching your filter criteria.
            </div>
          ) : (
            filteredAssignments.map((asg) => {
              const isPending = asg.status === 'pending';
              const isSubmitted = asg.status === 'submitted';
              const isGraded = asg.status === 'graded';

              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {asg.subjectCode}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {asg.subjectName}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPending 
                          ? 'bg-amber-100 text-amber-800' 
                          : isSubmitted 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isPending ? 'Pending Submission' : isSubmitted ? 'Submitted (Under Review)' : 'Evaluated'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {asg.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {asg.description}
                    </p>

                    {/* Submission metadata */}
                    {isSubmitted && asg.submittedDate && (
                      <div className="text-[11px] text-blue-700 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Submitted on {asg.submittedDate} • File: <strong>{asg.submittedFile}</strong></span>
                      </div>
                    )}

                    {isGraded && (
                      <div className="text-xs bg-emerald-50/80 border border-emerald-200 text-emerald-900 p-3 rounded-2xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-emerald-600" /> Marks Obtained: {asg.marksObtained} / {asg.totalMarks}
                          </span>
                          <span className="font-mono font-extrabold text-emerald-700 px-2 py-0.5 rounded bg-emerald-100">
                            Grade: {asg.grade}
                          </span>
                        </div>
                        {asg.feedback && (
                          <p className="text-[11px] text-emerald-800 pt-1">
                            <strong>Faculty Feedback:</strong> {asg.feedback}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Actions & Due Date */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <div className="text-[11px] text-slate-400 font-medium">Due Deadline</div>
                      <div className="text-xs font-bold text-slate-900 font-mono flex items-center md:justify-end gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {asg.dueDate}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Weightage: <strong>{asg.totalMarks} Marks</strong>
                      </div>
                    </div>

                    {isPending ? (
                      <button
                        onClick={() => {
                          setSubmittingAssignment(asg);
                          setUploadedFileName(`${asg.subjectCode.toLowerCase()}_asg_${asg.id}.pdf`);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Submit Work</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDownloadSimulation(asg.title)}
                        className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Receipt / PDF</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Content View: Study Materials */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold bg-indigo-50 text-indigo-700">
                    {mat.subjectCode} • {mat.unit}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Uploaded: {mat.uploadDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-500">
                  {mat.subjectName} • Prepared by <strong>{mat.uploadedBy}</strong>
                </p>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {mat.description}
                </p>

                {/* Key topics bullets */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Syllabus Highlights:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mat.keyTopics.map((topic, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                        ✓ {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 font-semibold uppercase text-[11px]">
                  {mat.fileType} • {mat.fileSize}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMaterial(mat)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    Quick Preview
                  </button>
                  <button
                    onClick={() => handleDownloadSimulation(mat.title)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Assignment Modal */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Submit Coursework Assignment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {submittingAssignment.subjectCode}: {submittingAssignment.title}
            </p>

            <form onSubmit={handleSubmitWork} className="space-y-4">
              {/* Simulated File Upload Drag Area */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Upload Document / Source Code (.pdf, .zip, .c, .py):
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-6 text-center bg-slate-50/70 hover:bg-blue-50/20 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-800">
                    {uploadedFileName || 'Click to select assignment file'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    PDF, Word, or ZIP archive up to 25MB
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    id="fileUpload"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setUploadedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label
                    htmlFor="fileUpload"
                    className="inline-block mt-3 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-blue-600 hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    Browse Files
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Submission Notes / Code Summary (Optional):
                </label>
                <textarea
                  rows={3}
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  placeholder="e.g. Implemented question 1 to 5 with output screenshots. Code tested in GCC on Linux..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
                >
                  {isSubmitting ? 'Uploading...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Material Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-100 text-blue-800">
                  {previewMaterial.subjectCode} • {previewMaterial.unit}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {previewMaterial.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Author: {previewMaterial.uploadedBy} • Uploaded on {previewMaterial.uploadDate}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 mb-1">Unit Description &amp; Scope:</h4>
              <p>{previewMaterial.description}</p>

              <h4 className="font-bold text-slate-900 mt-3 mb-1.5">Key Core Topics:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {previewMaterial.keyTopics.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewMaterial(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadSimulation(previewMaterial.title);
                  setPreviewMaterial(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download ({previewMaterial.fileSize})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Post Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Publish New Assignment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Create an academic assignment for students
            </p>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assignment Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus & Raft Protocol Implementation"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Subject Code:</label>
                  <input
                    type="text"
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Total Marks:</label>
                  <input
                    type="number"
                    value={newMarks}
                    onChange={(e) => setNewMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Subject Name:</label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Submission Due Date:</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Task Instructions / Description:</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed guidelines, rubrics, and formatting instructions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
