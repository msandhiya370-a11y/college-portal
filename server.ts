import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------- IN-MEMORY COLLEGE DATABASE -----------------
let users = [
  {
    id: 'std-1',
    name: 'Arun Kumar',
    email: 'arun.it@college.edu',
    password: 'password123',
    role: 'student',
    registerNumber: '21IT045',
    department: 'Information Technology',
    year: 'III Year',
    semester: 5,
    section: 'A',
    cgpa: 8.74,
    phone: '+91 98765 43210',
    dob: '2004-06-14',
    address: 'Room 302, Cauvery Men\'s Hostel, College Campus',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces'
  },
  {
    id: 'std-2',
    name: 'Priya Sharma',
    email: 'priya.it@college.edu',
    password: 'password123',
    role: 'student',
    registerNumber: '21IT078',
    department: 'Information Technology',
    year: 'III Year',
    semester: 5,
    section: 'A',
    cgpa: 9.15,
    phone: '+91 98765 12345',
    dob: '2004-03-22',
    address: 'Block B, Sarojini Ladies Hostel, Campus',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces'
  },
  {
    id: 'adm-1',
    name: 'Dr. K. Ramanathan',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
    department: 'Department of Information Technology',
    designation: 'Head of Department & Chief Academic Officer',
    phone: '+91 94432 10987',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces'
  }
];

let attendance = [
  { id: 'att-1', code: 'IT3501', name: 'Database Management Systems', faculty: 'Dr. S. Meenakshi', attended: 36, total: 42, percentage: 85.7, credits: 3 },
  { id: 'att-2', code: 'IT3502', name: 'Computer Networks', faculty: 'Prof. R. Anand', attended: 37, total: 40, percentage: 92.5, credits: 4 },
  { id: 'att-3', code: 'IT3503', name: 'Operating Systems', faculty: 'Dr. M. Karthik', attended: 32, total: 45, percentage: 71.1, credits: 3 }, // low attendance warning
  { id: 'att-4', code: 'IT3504', name: 'Design & Analysis of Algorithms', faculty: 'Prof. V. Divya', attended: 35, total: 42, percentage: 83.3, credits: 4 },
  { id: 'att-5', code: 'IT3505', name: 'Web Technology & Cloud', faculty: 'Er. P. Vignesh', attended: 38, total: 40, percentage: 95.0, credits: 3 },
  { id: 'att-6', code: 'IT3511', name: 'DBMS & Web Applications Lab', faculty: 'Dr. S. Meenakshi & Er. P. Vignesh', attended: 22, total: 24, percentage: 91.6, credits: 2 }
];

let weeklySchedule = [
  // Monday
  { id: 'tt-1', day: 'Monday', period: 1, time: '09:00 - 09:50 AM', subjectCode: 'IT3501', subjectName: 'Database Management Systems', faculty: 'Dr. S. Meenakshi', room: 'LH-302' },
  { id: 'tt-2', day: 'Monday', period: 2, time: '09:50 - 10:40 AM', subjectCode: 'IT3502', subjectName: 'Computer Networks', faculty: 'Prof. R. Anand', room: 'LH-302' },
  { id: 'tt-3', day: 'Monday', period: 3, time: '10:55 - 11:45 AM', subjectCode: 'IT3503', subjectName: 'Operating Systems', faculty: 'Dr. M. Karthik', room: 'LH-302' },
  { id: 'tt-4', day: 'Monday', period: 4, time: '11:45 - 12:35 PM', subjectCode: 'IT3504', subjectName: 'Design & Analysis of Algorithms', faculty: 'Prof. V. Divya', room: 'LH-302' },
  { id: 'tt-5', day: 'Monday', period: 5, time: '01:30 - 03:10 PM', subjectCode: 'IT3511', subjectName: 'DBMS & Web Dev Lab', faculty: 'Dr. S. Meenakshi', room: 'IT Lab-3', isLab: true },
  { id: 'tt-6', day: 'Monday', period: 6, time: '03:15 - 04:05 PM', subjectCode: 'LIB', subjectName: 'Library & Online Research Hour', faculty: 'Mr. Joseph Library Head', room: 'Central Library' },
  // Tuesday
  { id: 'tt-7', day: 'Tuesday', period: 1, time: '09:00 - 09:50 AM', subjectCode: 'IT3504', subjectName: 'Design & Analysis of Algorithms', faculty: 'Prof. V. Divya', room: 'LH-302' },
  { id: 'tt-8', day: 'Tuesday', period: 2, time: '09:50 - 10:40 AM', subjectCode: 'IT3505', subjectName: 'Web Technology & Cloud', faculty: 'Er. P. Vignesh', room: 'LH-302' },
  { id: 'tt-9', day: 'Tuesday', period: 3, time: '10:55 - 11:45 AM', subjectCode: 'IT3501', subjectName: 'Database Management Systems', faculty: 'Dr. S. Meenakshi', room: 'LH-302' },
  { id: 'tt-10', day: 'Tuesday', period: 4, time: '11:45 - 12:35 PM', subjectCode: 'IT3502', subjectName: 'Computer Networks', faculty: 'Prof. R. Anand', room: 'LH-302' },
  { id: 'tt-11', day: 'Tuesday', period: 5, time: '01:30 - 02:20 PM', subjectCode: 'IT3503', subjectName: 'Operating Systems', faculty: 'Dr. M. Karthik', room: 'LH-302' },
  { id: 'tt-12', day: 'Tuesday', period: 6, time: '02:20 - 03:10 PM', subjectCode: 'IT3590', subjectName: 'Technical Seminar & Aptitude', faculty: 'Prof. V. Divya', room: 'Seminar Hall-1' },
  // Wednesday
  { id: 'tt-13', day: 'Wednesday', period: 1, time: '09:00 - 09:50 AM', subjectCode: 'IT3502', subjectName: 'Computer Networks', faculty: 'Prof. R. Anand', room: 'LH-302' },
  { id: 'tt-14', day: 'Wednesday', period: 2, time: '09:50 - 10:40 AM', subjectCode: 'IT3503', subjectName: 'Operating Systems', faculty: 'Dr. M. Karthik', room: 'LH-302' },
  { id: 'tt-15', day: 'Wednesday', period: 3, time: '10:55 - 11:45 AM', subjectCode: 'IT3505', subjectName: 'Web Technology & Cloud', faculty: 'Er. P. Vignesh', room: 'LH-302' },
  { id: 'tt-16', day: 'Wednesday', period: 4, time: '11:45 - 12:35 PM', subjectCode: 'IT3501', subjectName: 'Database Management Systems', faculty: 'Dr. S. Meenakshi', room: 'LH-302' },
  { id: 'tt-17', day: 'Wednesday', period: 5, time: '01:30 - 03:10 PM', subjectCode: 'IT3512', subjectName: 'Networks & OS Kernel Lab', faculty: 'Prof. R. Anand', room: 'Networks Lab', isLab: true },
  { id: 'tt-18', day: 'Wednesday', period: 6, time: '03:15 - 04:05 PM', subjectCode: 'MENT', subjectName: 'Faculty Mentorship & Review', faculty: 'Dr. S. Meenakshi', room: 'Cabin 14' },
  // Thursday
  { id: 'tt-19', day: 'Thursday', period: 1, time: '09:00 - 09:50 AM', subjectCode: 'IT3505', subjectName: 'Web Technology & Cloud', faculty: 'Er. P. Vignesh', room: 'LH-302' },
  { id: 'tt-20', day: 'Thursday', period: 2, time: '09:50 - 10:40 AM', subjectCode: 'IT3504', subjectName: 'Design & Analysis of Algorithms', faculty: 'Prof. V. Divya', room: 'LH-302' },
  { id: 'tt-21', day: 'Thursday', period: 3, time: '10:55 - 11:45 AM', subjectCode: 'IT3502', subjectName: 'Computer Networks', faculty: 'Prof. R. Anand', room: 'LH-302' },
  { id: 'tt-22', day: 'Thursday', period: 4, time: '11:45 - 12:35 PM', subjectCode: 'IT3503', subjectName: 'Operating Systems', faculty: 'Dr. M. Karthik', room: 'LH-302' },
  { id: 'tt-23', day: 'Thursday', period: 5, time: '01:30 - 02:20 PM', subjectCode: 'IT3501', subjectName: 'Database Management Systems', faculty: 'Dr. S. Meenakshi', room: 'LH-302' },
  { id: 'tt-24', day: 'Thursday', period: 6, time: '02:20 - 03:10 PM', subjectCode: 'SPRT', subjectName: 'Sports & Wellness Hour', faculty: 'Physical Director', room: 'Sports Complex' },
  // Friday
  { id: 'tt-25', day: 'Friday', period: 1, time: '09:00 - 09:50 AM', subjectCode: 'IT3503', subjectName: 'Operating Systems', faculty: 'Dr. M. Karthik', room: 'LH-302' },
  { id: 'tt-26', day: 'Friday', period: 2, time: '09:50 - 10:40 AM', subjectCode: 'IT3501', subjectName: 'Database Management Systems', faculty: 'Dr. S. Meenakshi', room: 'LH-302' },
  { id: 'tt-27', day: 'Friday', period: 3, time: '10:55 - 11:45 AM', subjectCode: 'IT3504', subjectName: 'Design & Analysis of Algorithms', faculty: 'Prof. V. Divya', room: 'LH-302' },
  { id: 'tt-28', day: 'Friday', period: 4, time: '11:45 - 12:35 PM', subjectCode: 'IT3505', subjectName: 'Web Technology & Cloud', faculty: 'Er. P. Vignesh', room: 'LH-302' },
  { id: 'tt-29', day: 'Friday', period: 5, time: '01:30 - 03:10 PM', subjectCode: 'PROJ', subjectName: 'Phase-1 Mini Project Lab', faculty: 'Dr. K. Ramanathan (HOD)', room: 'Project Incubation Lab', isLab: true },
  { id: 'tt-30', day: 'Friday', period: 6, time: '03:15 - 04:05 PM', subjectCode: 'CLUB', subjectName: 'Coding Club & Hackathon Practice', faculty: 'Er. P. Vignesh', room: 'IT Lab-1' },
  // Saturday
  { id: 'tt-31', day: 'Saturday', period: 1, time: '09:00 - 10:00 AM', subjectCode: 'PLACE', subjectName: 'Campus Placement Training: Quantitative & Coding', faculty: 'Corporate Trainer Mr. Rajesh', room: 'Auditorium' },
  { id: 'tt-32', day: 'Saturday', period: 2, time: '10:15 - 11:15 AM', subjectCode: 'AICTE', subjectName: 'Industry Guest Lecture / Tech Webinar', faculty: 'Visiting Experts', room: 'Audio-Visual Hall' },
  { id: 'tt-33', day: 'Saturday', period: 3, time: '11:30 - 12:45 PM', subjectCode: 'CODE', subjectName: 'Competitive Programming Challenge', faculty: 'Dept Coding Committee', room: 'IT Lab-2' }
];

let assignments = [
  {
    id: 'asg-1',
    title: 'SQL Normalization Case Study (3NF to BCNF)',
    subjectCode: 'IT3501',
    subjectName: 'Database Management Systems',
    description: 'Design an unnormalized hospital management database and execute step-by-step lossless decomposition up to Boyce-Codd Normal Form with functional dependency diagrams.',
    dueDate: '2026-10-22',
    totalMarks: 20,
    status: 'pending'
  },
  {
    id: 'asg-2',
    title: 'Socket Programming: Multi-client Chat Server in C/Java',
    subjectCode: 'IT3502',
    subjectName: 'Computer Networks',
    description: 'Implement a concurrent TCP server utilizing multithreading or fork() to broadcast messages between multiple connected terminal clients with error handling.',
    dueDate: '2026-10-25',
    totalMarks: 25,
    status: 'submitted',
    submittedDate: '2026-10-14',
    submissionNote: 'Implemented using POSIX threads in C. Included Makefile and README with screenshots of 3 client terminals chatting simultaneously.',
    submittedFile: 'socket_chat_server_arun_21IT045.zip'
  },
  {
    id: 'asg-3',
    title: 'CPU Scheduling Algorithms Simulation',
    subjectCode: 'IT3503',
    subjectName: 'Operating Systems',
    description: 'Write a program in Python or C to calculate Average Turnaround Time and Waiting Time for FCFS, SJF (Preemptive & Non-Preemptive), and Round Robin with Gantt chart visualization.',
    dueDate: '2026-10-28',
    totalMarks: 20,
    status: 'pending'
  },
  {
    id: 'asg-4',
    title: 'Dynamic Programming vs Greedy: Fractional & 0/1 Knapsack',
    subjectCode: 'IT3504',
    subjectName: 'Design & Analysis of Algorithms',
    description: 'Provide asymptotic time complexity proof, step-by-step matrix table, and source code comparing Greedy fractional knapsack and 0/1 Dynamic Programming.',
    dueDate: '2026-10-10',
    totalMarks: 20,
    status: 'graded',
    submittedDate: '2026-10-09',
    submissionNote: 'Complete algorithm analysis with tabular execution and graph plots.',
    marksObtained: 19,
    grade: 'O',
    feedback: 'Excellent breakdown of space-time tradeoffs and clean code formatting.'
  }
];

let studyMaterials = [
  {
    id: 'mat-1',
    title: 'Unit 1: Relational Model, Constraints & SQL Queries',
    subjectCode: 'IT3501',
    subjectName: 'Database Management Systems',
    unit: 'Unit I & II',
    uploadedBy: 'Dr. S. Meenakshi',
    uploadDate: '2026-09-15',
    fileType: 'pdf',
    fileSize: '4.2 MB',
    downloadUrl: '#',
    description: 'Comprehensive notes covering ER diagrams, Relational Algebra operators, SQL DDL/DML, Nested Queries, and Triggers.',
    keyTopics: ['Entity Relationship Model', 'Relational Algebra (Projection, Selection, Joins)', 'SQL Joins & Group By', 'Integrity Constraints']
  },
  {
    id: 'mat-2',
    title: 'Unit 3: Transport Layer Protocols (TCP vs UDP, Flow & Congestion Control)',
    subjectCode: 'IT3502',
    subjectName: 'Computer Networks',
    unit: 'Unit III',
    uploadedBy: 'Prof. R. Anand',
    uploadDate: '2026-09-22',
    fileType: 'pdf',
    fileSize: '6.8 MB',
    downloadUrl: '#',
    description: 'Detailed TCP 3-way handshake diagrams, sliding window protocol mathematics, TCP Reno congestion avoidance algorithms, and UDP packet headers.',
    keyTopics: ['TCP 3-Way Handshake', 'Sliding Window (Go-Back-N, Selective Repeat)', 'TCP Congestion Window', 'Port Numbers & Sockets']
  },
  {
    id: 'mat-3',
    title: 'Unit 2: Process Synchronization, Semaphores & Deadlock Avoidance',
    subjectCode: 'IT3503',
    subjectName: 'Operating Systems',
    unit: 'Unit II',
    uploadedBy: 'Dr. M. Karthik',
    uploadDate: '2026-10-01',
    fileType: 'pdf',
    fileSize: '5.1 MB',
    downloadUrl: '#',
    description: 'Critical section problem solutions (Peterson\'s Algorithm), Counting vs Binary Semaphores, Dining Philosophers problem, and Banker\'s Algorithm safety check examples.',
    keyTopics: ['Race Conditions', 'Peterson Solution', 'Banker\'s Algorithm', 'Deadlock Detection & Recovery']
  },
  {
    id: 'mat-4',
    title: 'Unit 4: Dynamic Programming & Graph Algorithms Cheat Sheet',
    subjectCode: 'IT3504',
    subjectName: 'Design & Analysis of Algorithms',
    unit: 'Unit IV',
    uploadedBy: 'Prof. V. Divya',
    uploadDate: '2026-10-05',
    fileType: 'doc',
    fileSize: '3.5 MB',
    downloadUrl: '#',
    description: 'Bellman-Ford, Floyd-Warshall, Dijkstra shortest path algorithms, Longest Common Subsequence (LCS), and Matrix Chain Multiplication formulas.',
    keyTopics: ['Dijkstra vs Bellman-Ford', 'Floyd-Warshall all pairs', 'LCS Recurrence', 'Matrix Chain Multiplication']
  },
  {
    id: 'mat-5',
    title: 'Full Stack Web Architecture & REST API Guide',
    subjectCode: 'IT3505',
    subjectName: 'Web Technology & Cloud',
    unit: 'Unit III & IV',
    uploadedBy: 'Er. P. Vignesh',
    uploadDate: '2026-10-08',
    fileType: 'ppt',
    fileSize: '8.4 MB',
    downloadUrl: '#',
    description: 'Modern frontend with React & Vite, Express.js backend routing, JWT authentication, and cloud deployment on containerized services.',
    keyTopics: ['React Virtual DOM & Hooks', 'RESTful API Design', 'JWT Authentication', 'Docker & Cloud Hosting']
  }
];

let examSchedules = [
  {
    id: 'ex-1',
    examType: 'Internal Assessment II',
    subjectCode: 'IT3501',
    subjectName: 'Database Management Systems',
    date: '2026-11-03',
    time: '10:00 AM - 11:30 AM',
    hall: 'Exam Hall C-204',
    syllabus: 'Unit III (Transactions, Concurrency Control, 2PL) & Unit IV (Indexing & B+ Trees)'
  },
  {
    id: 'ex-2',
    examType: 'Internal Assessment II',
    subjectCode: 'IT3502',
    subjectName: 'Computer Networks',
    date: '2026-11-04',
    time: '10:00 AM - 11:30 AM',
    hall: 'Exam Hall C-204',
    syllabus: 'Unit III (Transport Layer, Flow Control) & Unit IV (Network Security, Cryptography)'
  },
  {
    id: 'ex-3',
    examType: 'Internal Assessment II',
    subjectCode: 'IT3503',
    subjectName: 'Operating Systems',
    date: '2026-11-05',
    time: '10:00 AM - 11:30 AM',
    hall: 'Exam Hall C-204',
    syllabus: 'Unit III (Memory Management, Paging, Segmentation) & Unit IV (File Systems & Disk Scheduling)'
  },
  {
    id: 'ex-4',
    examType: 'Internal Assessment II',
    subjectCode: 'IT3504',
    subjectName: 'Design & Analysis of Algorithms',
    date: '2026-11-06',
    time: '10:00 AM - 11:30 AM',
    hall: 'Exam Hall C-204',
    syllabus: 'Unit IV (Dynamic Programming, Graph Algorithms) & Unit V (NP-Completeness, Backtracking)'
  },
  {
    id: 'ex-5',
    examType: 'Model Practical',
    subjectCode: 'IT3511',
    subjectName: 'DBMS & Web Applications Lab',
    date: '2026-11-12',
    time: '09:00 AM - 12:00 PM',
    hall: 'IT Department Lab 3',
    syllabus: 'Complete Lab Exercises 1 to 12 (SQL triggers, procedures, React frontend with Express backend)'
  }
];

let semesterResults = [
  {
    semester: 4,
    academicYear: '2025-2026 Even Semester',
    sgpa: 8.85,
    cgpa: 8.74,
    totalCredits: 22,
    earnedCredits: 22,
    status: 'PROMOTED',
    subjects: [
      { code: 'MA3401', name: 'Probability & Statistics', credits: 4, internalMarks: 46, externalMarks: 44, totalMarks: 90, grade: 'A+', gradePoints: 9, result: 'PASS' },
      { code: 'IT3401', name: 'Object Oriented Software Engineering', credits: 3, internalMarks: 48, externalMarks: 47, totalMarks: 95, grade: 'O', gradePoints: 10, result: 'PASS' },
      { code: 'IT3402', name: 'Data Structures & Algorithms in Java', credits: 4, internalMarks: 45, externalMarks: 43, totalMarks: 88, grade: 'A+', gradePoints: 9, result: 'PASS' },
      { code: 'IT3403', name: 'Computer Architecture & Organization', credits: 3, internalMarks: 42, externalMarks: 40, totalMarks: 82, grade: 'A', gradePoints: 8, result: 'PASS' },
      { code: 'IT3404', name: 'Environmental Science & Sustainability', credits: 3, internalMarks: 44, externalMarks: 42, totalMarks: 86, grade: 'A+', gradePoints: 9, result: 'PASS' },
      { code: 'IT3411', name: 'Data Structures Java Laboratory', credits: 2, internalMarks: 49, externalMarks: 48, totalMarks: 97, grade: 'O', gradePoints: 10, result: 'PASS' },
      { code: 'IT3412', name: 'Professional Communication Lab', credits: 2, internalMarks: 47, externalMarks: 45, totalMarks: 92, grade: 'A+', gradePoints: 9, result: 'PASS' }
    ]
  },
  {
    semester: 3,
    academicYear: '2025-2026 Odd Semester',
    sgpa: 8.63,
    cgpa: 8.68,
    totalCredits: 23,
    earnedCredits: 23,
    status: 'PROMOTED',
    subjects: [
      { code: 'MA3301', name: 'Discrete Mathematics', credits: 4, internalMarks: 42, externalMarks: 41, totalMarks: 83, grade: 'A', gradePoints: 8, result: 'PASS' },
      { code: 'IT3301', name: 'Digital Principles & Logic Design', credits: 3, internalMarks: 45, externalMarks: 44, totalMarks: 89, grade: 'A+', gradePoints: 9, result: 'PASS' },
      { code: 'IT3302', name: 'Object Oriented Programming with C++', credits: 4, internalMarks: 48, externalMarks: 46, totalMarks: 94, grade: 'O', gradePoints: 10, result: 'PASS' },
      { code: 'IT3303', name: 'Data Communication & Transmission', credits: 3, internalMarks: 40, externalMarks: 41, totalMarks: 81, grade: 'A', gradePoints: 8, result: 'PASS' },
      { code: 'IT3304', name: 'Analog & Digital Electronics', credits: 3, internalMarks: 41, externalMarks: 42, totalMarks: 83, grade: 'A', gradePoints: 8, result: 'PASS' },
      { code: 'IT3311', name: 'C++ Programming Laboratory', credits: 2, internalMarks: 49, externalMarks: 47, totalMarks: 96, grade: 'O', gradePoints: 10, result: 'PASS' },
      { code: 'IT3312', name: 'Digital Electronics Lab', credits: 2, internalMarks: 46, externalMarks: 45, totalMarks: 91, grade: 'A+', gradePoints: 9, result: 'PASS' }
    ]
  }
];

let announcements = [
  {
    id: 'ann-1',
    title: 'Tata Consultancy Services (TCS) Ninja & Digital Campus Recruitment Drive 2026',
    category: 'Placements',
    author: 'Training & Placement Cell',
    date: '2026-10-14',
    pinned: true,
    content: 'TCS is conducting on-campus recruitment for final year and pre-final year engineering students. Eligible branches: IT, CSE, ECE with CGPA 7.0 and above with no standing arrears. Register on the NextStep portal before October 25, 2026. Mock aptitude tests will commence this Saturday.',
    attachmentName: 'TCS_Campus_Drive_Guidelines_2026.pdf'
  },
  {
    id: 'ann-2',
    title: 'Internal Assessment Test - II Schedule & Guidelines Released',
    category: 'Exams',
    author: 'Office of the Controller of Examinations',
    date: '2026-10-12',
    pinned: true,
    content: 'Internal Assessment Test - II for all B.Tech/B.E Semester III, V, and VII will be conducted from November 3 to November 8, 2026. Hall tickets can be downloaded from the student portal starting October 30. Mobile phones and smart watches are strictly prohibited.',
    attachmentName: 'IA_II_Timetable_Nov2026.pdf'
  },
  {
    id: 'ann-3',
    title: 'Smart India Hackathon (SIH 2026) College Level Internal Hackathon',
    category: 'Events',
    author: 'Innovation & Incubation Cell (IIC)',
    date: '2026-10-10',
    pinned: false,
    content: 'All departmental teams participating in SIH 2026 internal screening are requested to submit problem statement prototypes by October 24. Mentors will conduct code reviews in the Incubation Center on Friday afternoon.',
    attachmentName: 'SIH_Problem_Statements_Summary.pdf'
  },
  {
    id: 'ann-4',
    title: 'Mandatory 75% Attendance Requirement for Semester End Examinations',
    category: 'Academic',
    author: 'Dean of Academic Affairs',
    date: '2026-10-08',
    pinned: false,
    content: 'Students are advised to review their subject-wise attendance percentages. A minimum of 75% attendance is strictly enforced for hall ticket generation. Students with medical condonation must submit authentic records before October 31.',
    attachmentName: 'Academic_Regulations_Attendance.pdf'
  },
  {
    id: 'ann-5',
    title: 'Deepavali Festival Holidays Notification',
    category: 'Holidays',
    author: 'Principal\'s Office',
    date: '2026-10-05',
    pinned: false,
    content: 'The college will remain closed for Deepavali festival celebrations from October 29 to November 1, 2026. Regular classes will resume on Monday, November 2, 2026. Hostel mess will remain operational for residential students.',
    attachmentName: 'Holiday_Circular_Oct2026.pdf'
  }
];

// ----------------- AUTH ROUTES -----------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, password, role } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Please enter your student ID / email and password.' });
  }

  const queryStr = identifier.trim().toLowerCase();
  const user = users.find(u => {
    const matchesEmail = u.email.toLowerCase() === queryStr;
    const matchesRegNo = u.registerNumber && u.registerNumber.toLowerCase() === queryStr;
    const matchesRole = role ? u.role === role : true;
    return (matchesEmail || matchesRegNo) && matchesRole;
  });

  if (!user || user.password !== password) {
    return res.status(401).json({
      error: 'Invalid login credentials. Please verify your Register Number / Email and password.'
    });
  }

  const { password: _, ...userSafe } = user;
  res.json({ user: userSafe, token: `token-${user.id}-${Date.now()}` });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, registerNumber, department, year, semester, email, password } = req.body;

  if (!name || !email || !password || !registerNumber) {
    return res.status(400).json({ error: 'Name, Register Number, Email, and Password are required.' });
  }

  const existing = users.find(u => 
    u.email.toLowerCase() === email.trim().toLowerCase() ||
    (u.registerNumber && u.registerNumber.toLowerCase() === registerNumber.trim().toLowerCase())
  );

  if (existing) {
    return res.status(409).json({ error: 'Student with this email or register number already exists.' });
  }

  const newUser = {
    id: `std-${Date.now()}`,
    name,
    email: email.trim().toLowerCase(),
    password,
    role: 'student',
    registerNumber: registerNumber.trim().toUpperCase(),
    department: department || 'Information Technology',
    year: year || 'I Year',
    semester: Number(semester) || 1,
    section: 'A',
    cgpa: 8.50,
    phone: '+91 90000 00000',
    dob: '2005-01-01',
    address: 'Campus Hostel',
    avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces`
  };

  users.push(newUser);
  const { password: _, ...userSafe } = newUser;
  res.status(201).json({ user: userSafe, token: `token-${newUser.id}-${Date.now()}` });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { identifier, newPassword } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Identifier is required.' });
  }

  const user = users.find(u => 
    u.email.toLowerCase() === identifier.trim().toLowerCase() ||
    (u.registerNumber && u.registerNumber.toLowerCase() === identifier.trim().toLowerCase())
  );

  if (!user) {
    return res.status(404).json({ error: 'No account found matching this Register Number or Email.' });
  }

  if (newPassword) {
    user.password = newPassword;
    return res.json({ message: 'Password updated successfully. You can now login with your new password.' });
  }

  res.json({
    message: `Account verified for ${user.name} (${user.role === 'admin' ? 'Faculty Admin' : user.registerNumber}). You may enter a new password.`,
    userFound: { name: user.name, role: user.role, email: user.email }
  });
});

// ----------------- PROFILE UPDATE -----------------
app.patch('/api/profile', (req: Request, res: Response) => {
  const { userId, phone, address, avatarUrl, department, year } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (department !== undefined && user.role === 'admin') user.department = department;
  if (year !== undefined) user.year = year;

  const { password: _, ...userSafe } = user;
  res.json({ user: userSafe, message: 'Profile updated successfully.' });
});

// ----------------- ATTENDANCE ROUTES -----------------
app.get('/api/attendance', (req: Request, res: Response) => {
  const totalAttended = attendance.reduce((acc, curr) => acc + curr.attended, 0);
  const totalConducted = attendance.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = totalConducted > 0 ? Number(((totalAttended / totalConducted) * 100).toFixed(1)) : 0;

  res.json({
    overall: {
      attended: totalAttended,
      total: totalConducted,
      percentage: overallPercentage,
      status: overallPercentage >= 75 ? 'SAFE' : 'ATTENTION_NEEDED'
    },
    subjects: attendance
  });
});

app.post('/api/attendance/update', (req: Request, res: Response) => {
  const { subjectId, attended, total } = req.body;
  const item = attendance.find(a => a.id === subjectId);
  if (!item) {
    return res.status(404).json({ error: 'Subject attendance record not found.' });
  }

  if (attended !== undefined) item.attended = Number(attended);
  if (total !== undefined) item.total = Number(total);
  item.percentage = Number(((item.attended / item.total) * 100).toFixed(1));

  res.json({ message: 'Attendance updated successfully.', subject: item });
});

// ----------------- TIMETABLE ROUTES -----------------
app.get('/api/timetable', (req: Request, res: Response) => {
  res.json({ schedule: weeklySchedule });
});

app.post('/api/timetable', (req: Request, res: Response) => {
  const { day, period, time, subjectCode, subjectName, faculty, room, isLab } = req.body;
  if (!day || !period || !subjectCode || !subjectName) {
    return res.status(400).json({ error: 'Missing required timetable parameters.' });
  }

  const newSlot = {
    id: `tt-${Date.now()}`,
    day,
    period: Number(period),
    time: time || '09:00 - 09:50 AM',
    subjectCode,
    subjectName,
    faculty: faculty || 'Department Faculty',
    room: room || 'LH-302',
    isLab: Boolean(isLab)
  };

  weeklySchedule.push(newSlot);
  res.status(201).json({ message: 'Timetable slot created.', slot: newSlot });
});

app.delete('/api/timetable/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  weeklySchedule = weeklySchedule.filter(s => s.id !== id);
  res.json({ message: 'Slot removed successfully.' });
});

// ----------------- ASSIGNMENTS ROUTES -----------------
app.get('/api/assignments', (req: Request, res: Response) => {
  res.json({ assignments });
});

app.post('/api/assignments', (req: Request, res: Response) => {
  const { title, subjectCode, subjectName, description, dueDate, totalMarks } = req.body;
  if (!title || !subjectCode || !dueDate) {
    return res.status(400).json({ error: 'Title, Subject, and Due Date are mandatory.' });
  }

  const newAsg = {
    id: `asg-${Date.now()}`,
    title,
    subjectCode,
    subjectName: subjectName || 'Engineering Subject',
    description: description || 'Complete the assignment instructions as per syllabus guidelines.',
    dueDate,
    totalMarks: Number(totalMarks) || 20,
    status: 'pending' as const
  };

  assignments.unshift(newAsg);
  res.status(201).json({ message: 'Assignment published successfully.', assignment: newAsg });
});

app.post('/api/assignments/:id/submit', (req: Request, res: Response) => {
  const { id } = req.params;
  const { note, fileName } = req.body;
  const asg = assignments.find(a => a.id === id);
  if (!asg) {
    return res.status(404).json({ error: 'Assignment not found.' });
  }

  asg.status = 'submitted';
  asg.submittedDate = new Date().toISOString().split('T')[0];
  asg.submissionNote = note || 'Submitted assignment via portal.';
  asg.submittedFile = fileName || 'submission_file.pdf';

  res.json({ message: 'Assignment submitted successfully!', assignment: asg });
});

app.post('/api/assignments/:id/grade', (req: Request, res: Response) => {
  const { id } = req.params;
  const { marksObtained, grade, feedback } = req.body;
  const asg = assignments.find(a => a.id === id);
  if (!asg) {
    return res.status(404).json({ error: 'Assignment not found.' });
  }

  asg.status = 'graded';
  asg.marksObtained = Number(marksObtained);
  asg.grade = grade || 'A+';
  asg.feedback = feedback || 'Evaluated and verified.';

  res.json({ message: 'Assignment graded successfully.', assignment: asg });
});

// ----------------- STUDY MATERIALS ROUTES -----------------
app.get('/api/materials', (req: Request, res: Response) => {
  res.json({ materials: studyMaterials });
});

app.post('/api/materials', (req: Request, res: Response) => {
  const { title, subjectCode, subjectName, unit, uploadedBy, fileType, fileSize, description, keyTopics } = req.body;
  if (!title || !subjectCode) {
    return res.status(400).json({ error: 'Title and Subject Code required.' });
  }

  const newMat = {
    id: `mat-${Date.now()}`,
    title,
    subjectCode,
    subjectName: subjectName || 'Information Technology',
    unit: unit || 'Unit I',
    uploadedBy: uploadedBy || 'Course Faculty',
    uploadDate: new Date().toISOString().split('T')[0],
    fileType: fileType || 'pdf',
    fileSize: fileSize || '3.5 MB',
    downloadUrl: '#',
    description: description || 'Lecture slides and problem sheet.',
    keyTopics: keyTopics || ['Core Concepts', 'Worked Examples', 'Review Questions']
  };

  studyMaterials.unshift(newMat);
  res.status(201).json({ message: 'Study material uploaded successfully.', material: newMat });
});

// ----------------- EXAMS & RESULTS ROUTES -----------------
app.get('/api/exams', (req: Request, res: Response) => {
  res.json({ exams: examSchedules });
});

app.get('/api/results', (req: Request, res: Response) => {
  res.json({ results: semesterResults });
});

app.post('/api/results/update', (req: Request, res: Response) => {
  const { semester, subjectCode, internalMarks, externalMarks, grade } = req.body;
  const sem = semesterResults.find(s => s.semester === Number(semester));
  if (!sem) {
    return res.status(404).json({ error: 'Semester record not found.' });
  }

  const sub = sem.subjects.find(s => s.code === subjectCode);
  if (!sub) {
    return res.status(404).json({ error: 'Subject code not found.' });
  }

  if (internalMarks !== undefined) sub.internalMarks = Number(internalMarks);
  if (externalMarks !== undefined) sub.externalMarks = Number(externalMarks);
  sub.totalMarks = sub.internalMarks + sub.externalMarks;
  if (grade) sub.grade = grade;

  // recalculate SGPA
  const totalEarnedPoints = sem.subjects.reduce((sum, s) => sum + (s.gradePoints * s.credits), 0);
  sem.sgpa = Number((totalEarnedPoints / sem.totalCredits).toFixed(2));

  res.json({ message: 'Result updated successfully.', subject: sub, semesterSGPA: sem.sgpa });
});

// ----------------- ANNOUNCEMENTS ROUTES -----------------
app.get('/api/announcements', (req: Request, res: Response) => {
  res.json({ announcements });
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const { title, category, author, content, pinned, attachmentName } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const newAnn = {
    id: `ann-${Date.now()}`,
    title,
    category: category || 'Academic',
    author: author || 'Department Office',
    date: new Date().toISOString().split('T')[0],
    pinned: Boolean(pinned),
    content,
    attachmentName: attachmentName || ''
  };

  announcements.unshift(newAnn);
  res.status(201).json({ message: 'Announcement broadcasted.', announcement: newAnn });
});

app.delete('/api/announcements/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  announcements = announcements.filter(a => a.id !== id);
  res.json({ message: 'Announcement deleted.' });
});

// ----------------- ADMIN STUDENT DIRECTORY ROUTES -----------------
app.get('/api/admin/students', (req: Request, res: Response) => {
  const studentList = users.filter(u => u.role === 'student').map(({ password, ...u }) => u);
  res.json({ students: studentList });
});

app.post('/api/admin/students', (req: Request, res: Response) => {
  const { name, registerNumber, department, year, semester, email, phone } = req.body;
  if (!name || !registerNumber || !email) {
    return res.status(400).json({ error: 'Name, Register Number, and Email are required.' });
  }

  const newStd = {
    id: `std-${Date.now()}`,
    name,
    email: email.trim().toLowerCase(),
    password: 'password123',
    role: 'student',
    registerNumber: registerNumber.trim().toUpperCase(),
    department: department || 'Information Technology',
    year: year || 'III Year',
    semester: Number(semester) || 5,
    section: 'A',
    cgpa: 8.0,
    phone: phone || '+91 98765 00000',
    dob: '2004-01-01',
    address: 'Campus Hostel',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'
  };

  users.push(newStd);
  const { password: _, ...safeStd } = newStd;
  res.status(201).json({ message: 'Student registered into college directory.', student: safeStd });
});

// ----------------- AI ACADEMIC ASSISTANT ROUTE (GEMINI 3.8 FLASH) -----------------
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history = [], subjectContext } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message text is required.' });
  }

  const academicSystemInstruction = `You are 'ApexEdu AI' - the official intelligent Academic Assistant for college students pursuing undergraduate engineering and technology degrees (especially B.Tech/B.E in Information Technology, Computer Science, and Engineering).

Your responsibilities:
1. Academic Concept Explanations: Explain difficult topics (Data Structures, Algorithms, OS, DBMS, Computer Networks, Discrete Math, Web Tech, AI/ML) in simple, crisp, clear English with vivid analogies.
2. Programming & Debugging: Assist with C, C++, Python, Java, SQL, and HTML/CSS/JS. Write clean, modular code with comments and explain step-by-step logic.
3. Exam & Viva Preparation: Give high-probability exam questions, 2-mark definitions, 16-mark essay structures, and viva questions.
4. Study Scheduling: Design actionable, realistic daily and weekly study plans for internal assessments and semester exams.
5. Project Ideas & Assignments: Help brainstorm practical engineering mini-project ideas with architecture outlines and technology stack suggestions.
6. College FAQs: Provide helpful guidance on general engineering college standards (attendance condonation, credits, semester grade points SGPA/CGPA, laboratory record submission rules).

Tone & Guidelines:
- Be encouraging, academic, clear, and structured.
- Use Markdown formatting: headings (###), bold text, bullet points, and code blocks with syntax tags (\`\`\`c, \`\`\`python, \`\`\`sql, etc.).
- When providing code, keep it modern, idiomatic, and directly executable.
- Highlight common student pitfalls and exam tips.`;

  // Try live Gemini API if configured
  if (geminiClient && process.env.GEMINI_API_KEY) {
    try {
      // Build conversation contents
      const conversationContents = [];
      if (history && Array.isArray(history)) {
        for (const h of history.slice(-6)) {
          conversationContents.push({
            role: h.sender === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.text }]
          });
        }
      }

      const promptWithContext = subjectContext 
        ? `[Current Subject Context: ${subjectContext}]\nStudent Question: ${message}`
        : message;

      conversationContents.push({
        role: 'user',
        parts: [{ text: promptWithContext }]
      });

      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversationContents,
        config: {
          systemInstruction: academicSystemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || 'I analyzed your academic query, but no response was generated. Please try again.';
      return res.json({
        reply: replyText,
        source: 'gemini-3.8-flash',
        isLive: true
      });
    } catch (err: any) {
      console.error('Gemini API call failed, falling back to academic tutor engine:', err?.message || err);
    }
  }

  // Academic Intelligent Fallback Engine (when API key is not yet set or during offline testing)
  const lowerQuery = message.toLowerCase();
  let fallbackReply = '';

  if (lowerQuery.includes('pointer') || lowerQuery.includes('c programming') || lowerQuery.includes('segmentation fault')) {
    fallbackReply = `### Understanding Pointers in C (Academic Guide)

A **pointer** is a variable that stores the memory address of another variable rather than storing a direct data value.

#### Core Syntax & Operators:
- \`&\` (Address-of operator): Extracts the memory location of a variable.
- \`*\` (Dereference operator): Accesses the value stored at the referenced memory address.

\`\`\`c
#include <stdio.h>

int main() {
    int marks = 95;      // Normal integer variable
    int *ptr = &marks;   // Pointer storing the address of 'marks'

    printf("Value of marks: %d\\n", marks);           // Output: 95
    printf("Address of marks: %p\\n", (void*)&marks); // e.g. 0x7ffd...
    printf("Value via pointer: %d\\n", *ptr);         // Output: 95

    // Modifying value via pointer
    *ptr = 100;
    printf("Updated marks: %d\\n", marks);            // Output: 100
    return 0;
}
\`\`\`

#### Key Viva & Exam Tips:
1. **Dangling Pointer:** A pointer pointing to a freed memory block. Always set pointers to \`NULL\` after \`free()\`.
2. **Null Pointer:** \`int *p = NULL;\` prevents accidental read/write to random memory addresses.
3. **Wild Pointer:** An uninitialized pointer that holds garbage addresses.`;
  } else if (lowerQuery.includes('dijkstra') || lowerQuery.includes('algorithm') || lowerQuery.includes('shortest path')) {
    fallbackReply = `### Dijkstra's Shortest Path Algorithm (Greedy Approach)

**Dijkstra's Algorithm** finds the shortest path from a single source vertex to all other vertices in a weighted graph with **non-negative edge weights**.

#### Step-by-Step Mechanism:
1. **Initialize:** Set distance of the source node to \`0\`, and all other nodes to \`infinity (∞)\`. Mark all nodes as unvisited.
2. **Select Minimum:** From unvisited nodes, pick the vertex \`u\` with the smallest tentative distance.
3. **Relax Edges:** For each neighbor \`v\` of \`u\`:
   - If \`dist[u] + weight(u, v) < dist[v]\`, update \`dist[v] = dist[u] + weight(u, v)\`.
4. **Mark Visited:** Mark \`u\` as visited. A visited node is never re-checked.
5. **Repeat:** Continue until all nodes are visited or minimum unvisited distance is \`∞\`.

#### Time Complexity:
- Using adjacency matrix: **O(V²)**
- Using adjacency list + Min-Heap (Priority Queue): **O((V + E) log V)**

#### Exam Warning:
> **Important:** Dijkstra fails on graphs containing **negative weight edges** or negative weight cycles. For negative weights, always use the **Bellman-Ford Algorithm**!`;
  } else if (lowerQuery.includes('normalization') || lowerQuery.includes('dbms') || lowerQuery.includes('bcnf') || lowerQuery.includes('3nf')) {
    fallbackReply = `### Database Normalization (1NF to BCNF Summary)

Normalization is the process of organizing database tables to minimize **data redundancy** and avoid update, insert, and deletion anomalies.

| Normal Form | Rule Requirement | Violation / Fix Example |
| :--- | :--- | :--- |
| **1NF** | Atomic values only (no multi-valued or composite attributes) | Separate comma-separated phone numbers into individual rows |
| **2NF** | In 1NF + **No Partial Dependency** (Every non-key attribute must fully depend on the entire primary key) | Occurs when composite keys exist; split partial dependencies into child tables |
| **3NF** | In 2NF + **No Transitive Dependency** (Non-key attribute should not depend on another non-key attribute: \`X → Y\` where \`Y\` is non-prime) | E.g., \`EmpID → DeptID\` and \`DeptID → DeptName\`. Move Dept into its own table |
| **BCNF** | In 3NF + For every functional dependency \`X → Y\`, \`X\` must be a **Super Key** | Stricter version of 3NF eliminating all candidate-key overlaps |

**Tip for Semester Exam:** Always state the 3 database anomalies (Insertion, Deletion, Update) with a short 3-row example table before defining 1NF, 2NF, and 3NF!`;
  } else if (lowerQuery.includes('study plan') || lowerQuery.includes('schedule') || lowerQuery.includes('revision') || lowerQuery.includes('exam')) {
    fallbackReply = `### 5-Day High-Yield Engineering Exam Revision Strategy

Here is an optimal study schedule structured around cognitive retention and active recall:

#### Day 1 & 2: Core Foundation & High-Weightage Units (Units 1 & 2)
- **Morning (09:00 - 12:30):** Master all fundamental definitions, architecture diagrams, and mathematical formulations.
- **Afternoon (02:00 - 05:00):** Solve 3 previous university question papers for these units.
- **Night (07:30 - 09:30):** Flashcards & formula sheet write-down (Active Recall).

#### Day 3: Analytical & Problem-Solving Units (Units 3 & 4)
- **Focus:** Numerical problems, algorithms, syntax code snippets, and trace tables.
- **Practice:** Trace algorithms on paper by hand without using an IDE.

#### Day 4: Unit 5 & Low-Hanging Topics + Viva Questions
- **Focus:** Application-level questions, emerging trends, case studies, and 2-mark definitions.
- **Evening:** Mock self-test under strict 90-minute timed conditions.

#### Day 5: Final Rapid Review & Formula Consolidation
- Re-draw all architectural diagrams from memory.
- Review error-prone edge cases.
- **Sleep 7+ hours:** Cognitive consolidation is critical for memory recall.`;
  } else {
    fallbackReply = `### Academic Guidance from ApexEdu AI

Hello! I have reviewed your academic query: **"${message}"**.

Here is a structured explanation:

1. **Fundamental Principle:**
   Engineering and computing subjects require establishing strong mental models. Break the problem into its input parameters, processing steps, and expected outputs.

2. **Practical Approach:**
   - Always draft pseudo-code or block diagrams before writing production code.
   - For database and architecture questions, identify entity boundaries and transaction properties (ACID).
   - For networking and OS questions, map the operation to the corresponding protocol layer or kernel subsystem.

3. **Recommended Next Steps:**
   - You can ask me to write working sample code in **C, C++, Java, Python, or SQL**.
   - You can paste any error message or code snippet, and I'll debug it with an explanation.
   - You can ask for a topic-by-topic summary of any syllabus unit.

*(Note: Live generative answers powered by Gemini 3.8 Flash are enabled when \`GEMINI_API_KEY\` is configured in your project settings.)*`;
  }

  res.json({
    reply: fallbackReply,
    source: 'academic-knowledge-engine',
    isLive: Boolean(geminiClient)
  });
});

// ----------------- VITE INTEGRATION / STATIC SERVING -----------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
