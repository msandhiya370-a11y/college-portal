# ApexEdu AI: College Student Assistant Portal
**Academic Project for B.Tech Information Technology (Semester V / Final Year)**

---

## 📌 Project Overview
The **AI-Powered College Student Assistant Portal** is an enterprise-grade academic management system designed to streamline daily collegiate activities for students and faculty administrators. It brings together automated attendance tracking, interactive weekly timetables, digital coursework submission, examination grade cards, official college circulars, and a dedicated **Gemini 3.8 Flash AI Academic Tutor** for real-time concept clarification and code debugging.

---

## 🚀 Key Modules & Capabilities

### 1. Authentication & Role-Based Access Control (RBAC)
- **Student Login:** Authentication via Register Number (e.g., `21IT045`) or College Email with validation.
- **Admin Login:** Dedicated faculty administrative role (e.g., `admin@college.edu`).
- **Student Registration:** Complete enrollment form capturing Full Name, Register Number, Department, Year, Semester, Email, and Password.
- **Forgot Password Flow:** Self-service password recovery with register number verification.
- **Instant Demo Switcher:** One-click credentials for academic project evaluation and viva demonstration.

### 2. Personalized Student Dashboard
- Real-time academic metrics: Overall Attendance percentage, CGPA / SGPA, Pending Coursework count, and Next Assessment countdown.
- Daily lecture timeline highlighting the current class period, faculty member, and classroom venue (e.g., `LH-302`).
- University compliance alert banner for subjects falling below the mandatory **75% attendance threshold**.

### 3. ApexEdu AI Academic Tutor (Powered by Gemini 3.8 Flash)
- **Concept Breakdown:** Explains complex computing topics (e.g., Pointers, Deadlocks, B-Trees, Normalization) in plain English.
- **Code Debugging:** Assists with C, C++, Java, Python, and SQL queries with syntax highlighting and copy-to-clipboard.
- **Study Timetable Planner:** Generates customized 5-day or 7-day revision schedules for internal assessments.
- **Viva Questions & Bank:** Provides 2-mark definitions and 16-mark essay answers.
- **Export Revision Notes:** Download study session transcripts as markdown notes.

### 4. Attendance Management & Predictive Calculator
- Subject-wise attended vs conducted lecture tallies with visual progress indicators.
- **Predictive "What-If" Calculator:**
  - Computes how many upcoming lectures a student can safely miss while remaining $\ge 75\%$.
  - Computes how many consecutive lectures a student must attend to cross the $75\%$ or $80\%$ threshold.
- Faculty admin controls for updating attendance records.

### 5. Timetable Management
- Monday to Saturday period matrix (Periods 1 to 6 with timings from 09:00 AM to 04:05 PM).
- Practical laboratory 2-hour blocks highlighted.
- Admin period scheduler (Add / Delete slots).
- Print-friendly timetable export layout.

### 6. Coursework & Study Materials Repository
- Filter coursework by status: *Pending*, *Submitted*, or *Evaluated*.
- File upload simulator for submitting assignment ZIP/PDF files with student notes.
- Study materials organized by subject unit with syllabus highlights and download simulation.

### 7. Examinations & Official Grade Sheet
- Internal Assessment (IA-1, IA-2) and Semester Practical examination schedules with hall details.
- University Provisional Grade Sheet with SGPA, CGPA, Credits, Internal Marks (/50), External Marks (/50), and Letter Grades (O, A+, A, B+, B, RA).
- Printable university marksheet layout.

### 8. Official College Circulars
- Categorized notice board: *Academic*, *Placements*, *Exams*, *Events*, *Holidays*.
- Search bar, pinned circulars, and downloadable attachments.

---

## 🛠️ Technical Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React Icons.
- **Backend Server:** Node.js, Express.js with JSON REST endpoints (`/api/*`).
- **AI Engine:** Google Gemini 3.8 Flash via `@google/genai` TypeScript SDK (server-side proxy).
- **Tooling:** Vite, TSX, ESBuild.

---

## 🎓 Sample Credentials for Viva Demonstration

| Role | Username / Identifier | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Student** | `21IT045` or `arun.it@college.edu` | `password123` | Dashboard, AI Chat, Attendance, Submissions, Results |
| **Faculty Admin** | `admin@college.edu` | `admin123` | Directory, Marks Entry, Attendance Update, Notice Publishing |
