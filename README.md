# CPR MEDICAL ACADEMY – ONLINE EXAMINATION PORTAL

A professional, production-grade online examination platform engineered for **CPR Medical Academy**. The portal empowers administrators to create, schedule, import, and evaluate competitive medical and BCS exams, while students experience a real-time exam engine with automated negative marking, instant grading, and rank calculation.

---

## 🌟 Key Features

### 1. Real-Time Online Exam Engine
- **Accurate Countdown Timer**: Visual countdown (`TIME LEFT 39:58`) with red pulse warning under 5 minutes, auto-submitting at `00:00`.
- **40-Question Navigation Palette**: Categorized by states:
  - Current Question (Focus ring)
  - Answered (Emerald)
  - Unanswered (Slate)
  - Marked for Review (Purple/Amber)
  - Collapsible drawer on mobile devices.
- **Continuous Auto-Save**: Selected options are persisted continuously to avoid data loss on page refreshes or device interruptions.
- **Anti-Cheat Browser Monitoring**: Tracks window blurs, minimizing, and tab switches, recording the total `tabSwitchCount` for administrator inspection.
- **Double-Confirmation Modal**: Clear summary of Answered, Unanswered, and Marked for Review items prior to final submission.

### 2. Exact Negative Marking & Automatic Result Calculation
Strictly enforces the Academy's official evaluation formula:
```
প্রাপ্ত ফলাফল = সঠিক MCQ − (ভুল MCQ সংখ্যা × ০.৫)
Final Score = Correct MCQ − (Wrong MCQ × 0.5)
```
- **Unanswered Questions**: Awarded `0 mark` (no negative deduction).
- **Percentage Formula**: `(Final Score ÷ Total Marks) × 100`
- **Result Details**: Displays candidate name, ID, start time, submit time, duration taken, exact mathematical calculation, and an itemized answer review with step-by-step explanations.

### 3. Faithful Seed Data (Math 01 Question Paper)
Includes the full 40 questions from **Math 01 Question.pdf** (`SPECIAL BCS CRYSTAL BATCH`, Topic: `গাণিতিক যুক্তি / Mathematical Logic`), with:
- 40 questions faithfully transcribed with mathematical notation.
- Options A, B, C, D (K=A, L=B, M=C, N=D).
- Official Answer Sheet (1–40) integrated as the official answer key.

### 4. Admin Management Suite
- **Interactive Question Import & Dedicated PDF Review**: Upload PDF question papers, Excel, or CSV files. Review every question before publishing, edit options, correct answers, or delete items.
- **Exam Management**: Draft, schedule, publish, duplicate, or archive exams.
- **Student Roster & Verification**: Search by ID/Name/Mobile, activate/deactivate accounts, and view candidate exam history.
- **Batch Management**: Allocate students to dedicated batches (e.g. `SPECIAL BCS CRYSTAL BATCH`).
- **Data Export**: Export candidate results to CSV / Excel or print clean PDF report cards.

### 5. Institutional Typography & Bilingual Support
- **English Typography**: `font-family: "Times New Roman", Times, serif;`
- **Bangla Typography**: `font-family: "SutonnyMJ", sans-serif;` with `@font-face` configured in `/public/fonts/SutonnyMJ.ttf`.
- **Bilingual Interface**: Displays clean English and Bangla terms side-by-side (`Dashboard / ড্যাশবোর্ড`, `Available Exams / উপলব্ধ পরীক্ষা`, `Correct MCQ / সঠিক MCQ`, `Wrong MCQ / ভুল MCQ`, `Unanswered / উত্তর দেওয়া হয়নি`).

---

## 🚀 Quick Start & Installation

### Local Development
```bash
# 1. Clone the repository
git clone https://github.com/your-org/cpr-medical-academy-exam-portal.git
cd cpr-medical-academy-exam-portal

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase & PostgreSQL Setup

1. Create a new project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Copy and run the entire SQL script from `supabase/schema.sql`.
   This script creates:
   - Tables: `profiles`, `batches`, `exams`, `questions`, `exam_attempts`, `student_answers`, `results`, `exam_settings`, `exam_access`, `leaderboard`.
   - Constraints, foreign keys, and performant indexes.
   - Row Level Security (RLS) policies protecting answers before submission.
4. Copy your **Project URL** and **Anon Public Key** from `Project Settings > API`.
5. Update your `.env` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 👤 Login Credentials & Access

### Official Administrator Portal
- **Admin ID**: `cprmedicalacademy@gmail.com`
- **Password**: `cpr@2026`
- **Role**: `admin`

### Student Examination Access
- No password or complicated registration required.
- Students simply provide their:
  - **Full Name** (e.g. `Mohammad Tanvir Ahmed`)
  - **Registration No / Roll No** (e.g. `CPR-BCS-2026-01`)
- The system automatically authenticates them, preserves their progress, records their negative-marking evaluation, and presents their rank on the academy leaderboard.

---

## 🌐 Vercel Deployment

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New > Project** and import the repository.
3. Configure the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
4. Set Build Settings:
   - Framework Preset: **Vite** (or **Next.js** if deploying Next.js version)
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**. Your online examination portal is now live!
