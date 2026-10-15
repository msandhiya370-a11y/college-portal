import React, { useState } from 'react';
import { 
  Bell, 
  Pin, 
  Calendar, 
  Download, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Briefcase, 
  BookOpen, 
  Sparkles,
  PartyPopper,
  FileText
} from 'lucide-react';
import { Announcement } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  onRefresh: () => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ announcements, onRefresh }) => {
  const { role } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewNotice, setPreviewNotice] = useState<Announcement | null>(null);

  // Form states for Admin publishing
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Academic' | 'Placements' | 'Exams' | 'Events' | 'Holidays'>('Academic');
  const [newAuthor, setNewAuthor] = useState('Training & Placement Cell');
  const [newContent, setNewContent] = useState('');
  const [newPinned, setNewPinned] = useState(false);
  const [newAttachment, setNewAttachment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const categories = ['All', 'Academic', 'Placements', 'Exams', 'Events', 'Holidays'];

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesCategory = selectedCategory === 'All' ? true : ann.category === selectedCategory;
    const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createAnnouncement({
        title: newTitle,
        category: newCategory,
        author: newAuthor,
        content: newContent,
        pinned: newPinned,
        attachmentName: newAttachment || 'Circular_Document.pdf'
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      setNewAttachment('');
      setSuccessToast('New college circular published successfully!');
      onRefresh();
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to post announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm('Delete this announcement?')) {
      try {
        await api.deleteAnnouncement(id);
        onRefresh();
      } catch (err: any) {
        alert(err.message || 'Failed to delete announcement');
      }
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Placements': return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'Exams': return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'Events': return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'Holidays': return <PartyPopper className="w-4 h-4 text-pink-600" />;
      default: return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-7 h-7 text-blue-600" />
            College Notice Board &amp; Circulars
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official announcements regarding exams, campus placements, symposia, holidays, and academic circulars
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Circular</span>
          </button>
        )}
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successToast}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars by keywords, companies, or subjects..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs text-slate-400 text-xs">
            No circulars found matching your query.
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            return (
              <div
                key={ann.id}
                className={`bg-white rounded-3xl border transition-all p-5 sm:p-6 space-y-3 relative ${
                  ann.pinned 
                    ? 'border-blue-300 ring-2 ring-blue-500/10 shadow-sm' 
                    : 'border-slate-200/80 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Top category & pin tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-100">
                      {getCategoryIcon(ann.category)}
                    </span>
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                      {ann.category}
                    </span>
                    {ann.pinned && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />
                        Pinned Notice
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {ann.date}
                    </span>
                    {role === 'admin' && (
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {ann.title}
                </h3>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>

                {/* Footer: Author & Attachment */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500 font-medium">
                    Issued By: <strong className="text-slate-700">{ann.author}</strong>
                  </span>

                  {ann.attachmentName && (
                    <button
                      onClick={() => {
                        const blob = new Blob([`Official Notice: ${ann.title}\n\n${ann.content}`], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = ann.attachmentName || 'Notice_Attachment.pdf';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      <span>{ann.attachmentName}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Admin Publish Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Publish New Official Circular
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Broadcast notice to all college students and departments
            </p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Title of Circular:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Infosys Campus Placement Registration 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Placements">Placements</option>
                    <option value="Exams">Exams</option>
                    <option value="Events">Events</option>
                    <option value="Holidays">Holidays</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Author / Authority:</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Training & Placement Cell"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Circular Content:</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Full circular text with dates, venue, eligibility criteria, and deadlines..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Attached PDF File Name (Optional):</label>
                <input
                  type="text"
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  placeholder="e.g. Infosys_Registration_Guidelines_2026.pdf"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinnedCheck"
                  checked={newPinned}
                  onChange={(e) => setNewPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="pinnedCheck" className="text-xs font-medium text-slate-700">
                  Pin this circular to top of Notice Board
                </label>
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
                  {isSubmitting ? 'Publishing...' : 'Publish Circular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
