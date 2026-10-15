import { User, AttendanceSubject, TimetableSlot, Assignment, StudyMaterial, ExamSchedule, SemesterResult, Announcement } from '../types';

export const api = {
  // Auth
  async login(identifier: string, password: string, role?: 'student' | 'admin') {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(studentData: any) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async forgotPassword(identifier: string, newPassword?: string) {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Password reset failed');
    return data;
  },

  async updateProfile(profileData: any) {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data;
  },

  // Attendance
  async getAttendance(): Promise<{ overall: { attended: number; total: number; percentage: number; status: string }; subjects: AttendanceSubject[] }> {
    const res = await fetch('/api/attendance');
    if (!res.ok) throw new Error('Failed to fetch attendance');
    return res.json();
  },

  async updateAttendance(subjectId: string, attended: number, total: number) {
    const res = await fetch('/api/attendance/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectId, attended, total }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update attendance');
    return data;
  },

  // Timetable
  async getTimetable(): Promise<{ schedule: TimetableSlot[] }> {
    const res = await fetch('/api/timetable');
    if (!res.ok) throw new Error('Failed to fetch timetable');
    return res.json();
  },

  async addTimetableSlot(slot: Partial<TimetableSlot>) {
    const res = await fetch('/api/timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slot),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add timetable slot');
    return data;
  },

  async deleteTimetableSlot(id: string) {
    const res = await fetch(`/api/timetable/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete slot');
    return data;
  },

  // Assignments
  async getAssignments(): Promise<{ assignments: Assignment[] }> {
    const res = await fetch('/api/assignments');
    if (!res.ok) throw new Error('Failed to fetch assignments');
    return res.json();
  },

  async createAssignment(assignmentData: Partial<Assignment>) {
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create assignment');
    return data;
  },

  async submitAssignment(id: string, note: string, fileName?: string) {
    const res = await fetch(`/api/assignments/${id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, fileName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit assignment');
    return data;
  },

  async gradeAssignment(id: string, marksObtained: number, grade: string, feedback: string) {
    const res = await fetch(`/api/assignments/${id}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marksObtained, grade, feedback }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to grade assignment');
    return data;
  },

  // Materials
  async getMaterials(): Promise<{ materials: StudyMaterial[] }> {
    const res = await fetch('/api/materials');
    if (!res.ok) throw new Error('Failed to fetch study materials');
    return res.json();
  },

  async uploadMaterial(materialData: Partial<StudyMaterial>) {
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materialData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload material');
    return data;
  },

  // Exams & Results
  async getExams(): Promise<{ exams: ExamSchedule[] }> {
    const res = await fetch('/api/exams');
    if (!res.ok) throw new Error('Failed to fetch exams');
    return res.json();
  },

  async getResults(): Promise<{ results: SemesterResult[] }> {
    const res = await fetch('/api/results');
    if (!res.ok) throw new Error('Failed to fetch results');
    return res.json();
  },

  async updateResult(data: { semester: number; subjectCode: string; internalMarks: number; externalMarks: number; grade: string }) {
    const res = await fetch('/api/results/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to update result');
    return resData;
  },

  // Announcements
  async getAnnouncements(): Promise<{ announcements: Announcement[] }> {
    const res = await fetch('/api/announcements');
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  },

  async createAnnouncement(announcementData: Partial<Announcement>) {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcementData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to post announcement');
    return data;
  },

  async deleteAnnouncement(id: string) {
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete announcement');
    return data;
  },

  // Admin Students
  async getAdminStudents(): Promise<{ students: User[] }> {
    const res = await fetch('/api/admin/students');
    if (!res.ok) throw new Error('Failed to fetch student directory');
    return res.json();
  },

  async createAdminStudent(studentData: Partial<User>) {
    const res = await fetch('/api/admin/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register student');
    return data;
  },

  // AI Chat
  async sendAiMessage(message: string, history: any[] = [], subjectContext?: string): Promise<{ reply: string; source: string; isLive: boolean }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, subjectContext }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'AI Chat failed');
    return data;
  }
};
