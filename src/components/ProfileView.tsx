import React, { useState } from 'react';
import { 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  LogOut, 
  Edit3, 
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap,
  Sparkles,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfileView: React.FC = () => {
  const { user, role, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ phone, address, avatarUrl });
      setIsEditing(false);
      setSaveSuccess('Profile information updated successfully!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-blue-600" />
            Student Academic Identity &amp; Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered records under Controller of Examinations &amp; College ERP
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-blue-600" />
            <span>Edit Permitted Info</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {saveSuccess}
        </div>
      )}

      {/* College Identity Card View */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-blue-800/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wide uppercase text-white">
                Apex Institute of Technology
              </h2>
              <p className="text-[10px] text-cyan-300 font-mono tracking-wider">
                OFFICIAL STUDENT IDENTIFICATION CARD
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-[11px] text-slate-400">
            Valid Thru: <strong>MAY 2027</strong>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group shrink-0">
            <img
              src={user?.avatarUrl}
              alt={user?.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-blue-500/40 shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase shadow">
              ACTIVE
            </div>
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {user?.name}
              </h3>
              <p className="text-xs sm:text-sm text-cyan-300 font-mono font-bold mt-0.5">
                Register Number: {user?.registerNumber || '21IT045'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-300 font-mono">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block uppercase">Department</span>
                <strong className="text-white text-xs">{user?.department || 'Information Technology'}</strong>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block uppercase">Academic Year</span>
                <strong className="text-white text-xs">{user?.year || 'III Year'} (Sem {user?.semester || 5})</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metadata Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
          Official College Records &amp; Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">College Email ID</span>
              <span className="font-bold text-slate-900">{user?.email}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <Phone className="w-4 h-4 text-emerald-600 mt-0.5" />
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Contact Mobile</span>
              <span className="font-bold text-slate-900">{user?.phone || '+91 98765 43210'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-purple-600 mt-0.5" />
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Date of Birth</span>
              <span className="font-bold text-slate-900">{user?.dob || '2004-06-14'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <Award className="w-4 h-4 text-amber-600 mt-0.5" />
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Academic Distinction</span>
              <span className="font-bold text-slate-900">CGPA: {user?.cgpa || 8.74} / 10.0</span>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Hostel / Campus Residential Address</span>
              <span className="font-bold text-slate-900">{user?.address || 'Room 302, Cauvery Men\'s Hostel, College Campus'}</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
          <span>Faculty Academic Mentor: <strong>Dr. S. Meenakshi (Assoc. Prof / IT)</strong></span>
          <span className="text-blue-700 font-mono text-[11px]">Cabin 14, IT Block</span>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Edit Permitted Information
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Update your contact phone, address, and profile photo
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Phone Number:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Address / Hostel Room:</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Profile Photo Avatar:</label>
                <div className="flex items-center gap-2 mb-2">
                  {sampleAvatars.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="avatar option"
                      onClick={() => setAvatarUrl(av)}
                      className={`w-10 h-10 rounded-xl object-cover cursor-pointer ring-2 transition-all ${
                        avatarUrl === av ? 'ring-blue-600 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Or paste custom image URL..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
