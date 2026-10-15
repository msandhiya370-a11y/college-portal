export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registerNumber?: string;
  department?: string;
  year?: string;
  semester?: number;
  section?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  cgpa?: number;
  dob?: string;
}

export interface AttendanceSubject {
  id: string;
  code: string;
  name: string;
  faculty: string;
  attended: number;
  total: number;
  percentage: number;
  credits: number;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  time: string;
  subjectCode: string;
  subjectName: string;
  faculty: string;
  room: string;
  isLab?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  status: 'pending' | 'submitted' | 'graded';
  submittedDate?: string;
  submissionNote?: string;
  submittedFile?: string;
  grade?: string;
  marksObtained?: number;
  feedback?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  unit: string;
  uploadedBy: string;
  uploadDate: string;
  fileType: 'pdf' | 'doc' | 'ppt' | 'code';
  fileSize: string;
  downloadUrl: string;
  description: string;
  keyTopics: string[];
}

export interface ExamSchedule {
  id: string;
  examType: 'Internal Assessment I' | 'Internal Assessment II' | 'Model Practical' | 'Semester End Exam';
  subjectCode: string;
  subjectName: string;
  date: string;
  time: string;
  hall: string;
  syllabus: string;
}

export interface SubjectResult {
  code: string;
  name: string;
  credits: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'RA';
  gradePoints: number;
  result: 'PASS' | 'RA';
}

export interface SemesterResult {
  semester: number;
  academicYear: string;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  status: 'PROMOTED' | 'COMPLETED';
  subjects: SubjectResult[];
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Academic' | 'Placements' | 'Exams' | 'Events' | 'Holidays';
  author: string;
  date: string;
  pinned?: boolean;
  content: string;
  attachmentName?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}
