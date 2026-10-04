-- ====================================================================
-- CPR MEDICAL ACADEMY – ONLINE EXAMINATION PORTAL
-- PostgreSQL & Supabase Database Migration & Row Level Security (RLS)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Batches Table
CREATE TABLE IF NOT EXISTS public.batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_name TEXT NOT NULL UNIQUE,
    course TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Profiles Table (Extends Supabase auth.users or standalone)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- linked to auth.users if Supabase Auth is enabled
    full_name TEXT NOT NULL,
    student_id TEXT UNIQUE NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
    batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
    batch_name TEXT,
    profile_picture_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Exams Table
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    description TEXT,
    batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
    total_questions INTEGER NOT NULL DEFAULT 40,
    duration_minutes INTEGER NOT NULL DEFAULT 40,
    total_marks NUMERIC(6,2) NOT NULL DEFAULT 40.00,
    negative_marking NUMERIC(4,2) NOT NULL DEFAULT 0.50,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_date DATE NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'live', 'completed')),
    result_visibility BOOLEAN NOT NULL DEFAULT true,
    leaderboard_visibility BOOLEAN NOT NULL DEFAULT true,
    answer_review BOOLEAN NOT NULL DEFAULT true,
    question_randomization BOOLEAN NOT NULL DEFAULT false,
    option_randomization BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    marks NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    negative_marks NUMERIC(4,2) NOT NULL DEFAULT 0.50,
    explanation TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_exam_question_number UNIQUE (exam_id, question_number)
);

-- 6. Exam Settings Table
CREATE TABLE IF NOT EXISTS public.exam_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID UNIQUE REFERENCES public.exams(id) ON DELETE CASCADE,
    allow_tab_switch BOOLEAN NOT NULL DEFAULT false,
    max_tab_switches INTEGER NOT NULL DEFAULT 3,
    auto_submit_on_expiry BOOLEAN NOT NULL DEFAULT true,
    show_timer_warning_minutes INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Exam Access Table (Batch to Exam assignment)
CREATE TABLE IF NOT EXISTS public.exam_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_exam_batch_access UNIQUE (exam_id, batch_id)
);

-- 8. Exam Attempts Table
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expected_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'auto_submitted')),
    tab_switch_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_student_exam_attempt UNIQUE (student_id, exam_id)
);

-- 9. Student Answers Table
CREATE TABLE IF NOT EXISTS public.student_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option CHAR(1) CHECK (selected_option IN ('A', 'B', 'C', 'D')),
    is_marked_for_review BOOLEAN NOT NULL DEFAULT false,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_attempt_question_answer UNIQUE (attempt_id, question_id)
);

-- 10. Results Table
-- Calculation Formula:
-- প্রাপ্ত ফলাফল = সঠিক MCQ − (ভুল MCQ সংখ্যা × 0.5)
-- Final Score = Correct MCQ - (Wrong MCQ * 0.5)
CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID UNIQUE NOT NULL REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    total_questions INTEGER NOT NULL,
    correct_count INTEGER NOT NULL DEFAULT 0,
    wrong_count INTEGER NOT NULL DEFAULT 0,
    unanswered_count INTEGER NOT NULL DEFAULT 0,
    final_score NUMERIC(6,2) NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    time_taken_seconds INTEGER NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    tab_switch_count INTEGER NOT NULL DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Leaderboard Materialized / Dynamic View
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    r.id AS result_id,
    r.exam_id,
    e.title AS exam_title,
    p.full_name AS student_name,
    p.student_id AS student_student_id,
    b.batch_name,
    r.correct_count,
    r.wrong_count,
    r.unanswered_count,
    r.final_score,
    r.percentage,
    r.time_taken_seconds,
    r.submitted_at,
    DENSE_RANK() OVER (
        PARTITION BY r.exam_id 
        ORDER BY r.final_score DESC, r.time_taken_seconds ASC, r.submitted_at ASC
    ) AS rank
FROM public.results r
JOIN public.profiles p ON r.student_id = p.id
JOIN public.exams e ON r.exam_id = e.id
LEFT JOIN public.batches b ON p.batch_id = b.id
WHERE e.leaderboard_visibility = true;

-- Indexes for optimal lookup and query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON public.profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_exams_status ON public.exams(status);
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON public.questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_student_exam ON public.exam_attempts(student_id, exam_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_attempt ON public.student_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_results_exam_score ON public.results(exam_id, final_score DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profile read" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- Exams Policies
CREATE POLICY "Anyone can view published exams" ON public.exams
    FOR SELECT USING (status = 'published' OR status = 'live' OR public.is_admin());

CREATE POLICY "Only admins can modify exams" ON public.exams
    FOR ALL USING (public.is_admin());

-- Questions Policies (CRITICAL: students only see questions, but NOT correct answers before submit)
CREATE POLICY "Students can view questions for allowed exams" ON public.questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.exams 
            WHERE exams.id = questions.exam_id 
            AND (exams.status IN ('published', 'live') OR public.is_admin())
        )
    );

CREATE POLICY "Only admins can insert or update questions" ON public.questions
    FOR ALL USING (public.is_admin());

-- Exam Attempts Policies
CREATE POLICY "Students can read and insert their own attempts" ON public.exam_attempts
    FOR ALL USING (
        student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) 
        OR public.is_admin()
    );

-- Student Answers Policies
CREATE POLICY "Students can save their own answers" ON public.student_answers
    FOR ALL USING (
        attempt_id IN (
            SELECT id FROM public.exam_attempts 
            WHERE student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        ) OR public.is_admin()
    );

-- Results Policies
CREATE POLICY "Students can see their own results or public leaderboard" ON public.results
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.exams WHERE exams.id = results.exam_id AND exams.leaderboard_visibility = true)
        OR public.is_admin()
    );
