import {
  Profile,
  Batch,
  Exam,
  Question,
  StudentQuestion,
  ExamAttempt,
  ExamResult,
  LeaderboardEntry,
  AcademySettings,
  OptionKey,
} from '../types';
import {
  DEMO_BATCHES,
  DEMO_EXAMS,
  DEMO_QUESTIONS,
  DEMO_PROFILES,
  DEMO_RESULTS,
  DEFAULT_SETTINGS,
} from '../data/demoExamData';

const STORAGE_KEYS = {
  PROFILES: 'cpr_exam_profiles_v4',
  BATCHES: 'cpr_exam_batches_v4',
  EXAMS: 'cpr_exam_exams_v4',
  QUESTIONS: 'cpr_exam_questions_v4',
  ATTEMPTS: 'cpr_exam_attempts_v4',
  RESULTS: 'cpr_exam_results_v4',
  SETTINGS: 'cpr_exam_settings_v4',
  CURRENT_USER: 'cpr_exam_current_user_v4',
};

// Safe localStorage helper
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// Initialize seed data if not present
export function initStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    setStored(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BATCHES)) {
    setStored(STORAGE_KEYS.BATCHES, DEMO_BATCHES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
    setStored(STORAGE_KEYS.EXAMS, DEMO_EXAMS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    setStored(STORAGE_KEYS.QUESTIONS, DEMO_QUESTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESULTS)) {
    setStored(STORAGE_KEYS.RESULTS, DEMO_RESULTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setStored(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTEMPTS)) {
    setStored(STORAGE_KEYS.ATTEMPTS, []);
  }
}

// Current User Session
export function getCurrentUser(): Profile | null {
  return getStored<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user: Profile | null): void {
  setStored(STORAGE_KEYS.CURRENT_USER, user);
}

// Authentication
export function loginStudent(fullName: string, registrationNo?: string): { success: boolean; user?: Profile; error?: string } {
  initStorage();
  const cleanName = fullName.trim();
  const rawReg = registrationNo ? registrationNo.trim().toUpperCase() : '';

  if (!cleanName) {
    return { success: false, error: 'Please enter your Name (আপনার নাম লিখুন)।' };
  }

  const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
  let student: Profile | undefined;

  if (rawReg) {
    student = profiles.find((p) => p.role === 'student' && p.studentId.toUpperCase() === rawReg);
  } else {
    // If registration no is omitted, lookup by student name
    student = profiles.find((p) => p.role === 'student' && p.fullName.toLowerCase() === cleanName.toLowerCase());
  }

  if (student) {
    // If student already exists, update name if provided
    if (cleanName && student.fullName !== cleanName) {
      student.fullName = cleanName;
      setStored(STORAGE_KEYS.PROFILES, profiles);
    }
    if (!student.isActive) {
      return { success: false, error: 'Your student account is currently deactivated. Please contact admin.' };
    }
  } else {
    // Automatically register new student with provided Name and (provided or auto-generated) Registration No
    const effectiveReg = rawReg || `CPR-${Math.floor(1000 + Math.random() * 9000)}`;
    const batches = getStored<Batch[]>(STORAGE_KEYS.BATCHES, DEMO_BATCHES);
    const defaultBatch = batches[0];
    student = {
      id: `user-student-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: cleanName,
      studentId: effectiveReg,
      mobileNumber: '',
      email: `${effectiveReg.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.cpr.edu`,
      role: 'student',
      batchId: defaultBatch?.id || 'batch-special-bcs',
      batchName: defaultBatch?.batchName || 'SPECIAL BCS CRYSTAL BATCH',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    profiles.push(student);
    setStored(STORAGE_KEYS.PROFILES, profiles);
  }

  setCurrentUser(student);
  return { success: true, user: student };
}

export function createStudent(data: {
  fullName: string;
  studentId?: string;
  mobileNumber?: string;
  email?: string;
  batchId?: string;
}): Profile {
  initStorage();
  const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
  const batches = getStored<Batch[]>(STORAGE_KEYS.BATCHES, DEMO_BATCHES);
  const batch = batches.find((b) => b.id === data.batchId) || batches[0];

  const cleanReg = data.studentId?.trim().toUpperCase() || `CPR-${Math.floor(1000 + Math.random() * 9000)}`;
  const newProfile: Profile = {
    id: `user-student-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    fullName: data.fullName.trim(),
    studentId: cleanReg,
    mobileNumber: data.mobileNumber?.trim() || '',
    email: data.email?.trim() || `${cleanReg.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.cpr.edu`,
    role: 'student',
    batchId: batch?.id,
    batchName: batch?.batchName || 'General Batch',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  profiles.push(newProfile);
  setStored(STORAGE_KEYS.PROFILES, profiles);
  return newProfile;
}

export function loginAdmin(identifier: string, password?: string): { success: boolean; user?: Profile; error?: string } {
  initStorage();
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = password?.trim();

  // Enforce ADMIN ID: cprmedicalacademy@gmail.com, Password: cpr@2026
  const isValidAdminId = cleanId === 'cprmedicalacademy@gmail.com' || cleanId === 'cpr-admin-01';
  const isValidPassword = cleanPass === 'cpr@2026';

  if (!isValidAdminId || !isValidPassword) {
    return {
      success: false,
      error: 'Invalid administrator credentials. Admin ID: cprmedicalacademy@gmail.com | Password: cpr@2026',
    };
  }

  const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
  let admin = profiles.find(
    (p) => p.role === 'admin' && (p.email.toLowerCase() === 'cprmedicalacademy@gmail.com' || p.studentId === 'CPR-ADMIN-01')
  );

  if (!admin) {
    admin = {
      id: 'user-admin',
      fullName: 'CPR Administrator',
      studentId: 'CPR-ADMIN-01',
      mobileNumber: '01700000000',
      email: 'cprmedicalacademy@gmail.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    profiles.push(admin);
    setStored(STORAGE_KEYS.PROFILES, profiles);
  }

  setCurrentUser(admin);
  return { success: true, user: admin };
}

export function registerStudent(data: {
  fullName: string;
  studentId: string;
  mobileNumber: string;
  email: string;
  batchId: string;
}): { success: boolean; user?: Profile; error?: string } {
  initStorage();
  const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
  const batches = getStored<Batch[]>(STORAGE_KEYS.BATCHES, DEMO_BATCHES);

  // Check duplicate email, mobile or student ID
  const existingEmail = profiles.find((p) => p.email.toLowerCase() === data.email.trim().toLowerCase());
  if (existingEmail) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const existingId = profiles.find((p) => p.studentId.toLowerCase() === data.studentId.trim().toLowerCase());
  if (existingId) {
    return { success: false, error: 'This Student ID is already registered.' };
  }

  const batch = batches.find((b) => b.id === data.batchId);
  const newProfile: Profile = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    fullName: data.fullName.trim(),
    studentId: data.studentId.trim().toUpperCase(),
    mobileNumber: data.mobileNumber.trim(),
    email: data.email.trim(),
    role: 'student',
    batchId: data.batchId,
    batchName: batch ? batch.batchName : 'General Batch',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  profiles.push(newProfile);
  setStored(STORAGE_KEYS.PROFILES, profiles);
  setCurrentUser(newProfile);

  return { success: true, user: newProfile };
}

export function updateProfile(updated: Partial<Profile> & { id: string }): Profile {
  const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
  const index = profiles.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...updated };
    setStored(STORAGE_KEYS.PROFILES, profiles);
    const current = getCurrentUser();
    if (current && current.id === updated.id) {
      setCurrentUser(profiles[index]);
    }
    return profiles[index];
  }
  throw new Error('Profile not found');
}

export function getProfiles(): Profile[] {
  initStorage();
  return getStored<Profile[]>(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
}

export function deleteProfile(id: string): void {
  initStorage();
  const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
  const updated = profiles.filter((p) => p.id !== id);
  setStored(STORAGE_KEYS.PROFILES, updated);
}

export function clearAllStudents(): void {
  initStorage();
  const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
  const adminsOnly = profiles.filter((p) => p.role === 'admin');
  setStored(STORAGE_KEYS.PROFILES, adminsOnly);
}

// Batches
export function getBatches(): Batch[] {
  initStorage();
  return getStored<Batch[]>(STORAGE_KEYS.BATCHES, DEMO_BATCHES);
}

export function createBatch(data: Omit<Batch, 'id'>): Batch {
  const batches = getBatches();
  const newBatch: Batch = {
    id: `batch-${Date.now()}`,
    ...data,
  };
  batches.push(newBatch);
  setStored(STORAGE_KEYS.BATCHES, batches);
  return newBatch;
}

export function updateBatch(id: string, data: Partial<Batch>): Batch {
  const batches = getBatches();
  const index = batches.findIndex((b) => b.id === id);
  if (index !== -1) {
    batches[index] = { ...batches[index], ...data };
    setStored(STORAGE_KEYS.BATCHES, batches);
    return batches[index];
  }
  throw new Error('Batch not found');
}

export function deleteBatch(id: string): void {
  const batches = getBatches().filter((b) => b.id !== id);
  setStored(STORAGE_KEYS.BATCHES, batches);
}

// Exams
export function getExams(): Exam[] {
  initStorage();
  return getStored<Exam[]>(STORAGE_KEYS.EXAMS, DEMO_EXAMS);
}

export function getExamById(id: string): Exam | undefined {
  return getExams().find((e) => e.id === id);
}

export function createExam(data: Omit<Exam, 'id' | 'createdAt'>): Exam {
  const exams = getExams();
  const newExam: Exam = {
    id: `exam-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  exams.push(newExam);
  setStored(STORAGE_KEYS.EXAMS, exams);
  return newExam;
}

export function updateExam(id: string, data: Partial<Exam>): Exam {
  const exams = getExams();
  const index = exams.findIndex((e) => e.id === id);
  if (index !== -1) {
    exams[index] = { ...exams[index], ...data };
    setStored(STORAGE_KEYS.EXAMS, exams);
    return exams[index];
  }
  throw new Error('Exam not found');
}

export function deleteExam(id: string): void {
  const exams = getExams().filter((e) => e.id !== id);
  setStored(STORAGE_KEYS.EXAMS, exams);
  // Also clean up questions
  const questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, []).filter((q) => q.examId !== id);
  setStored(STORAGE_KEYS.QUESTIONS, questions);
}

// Questions
export function getQuestions(examId: string): Question[] {
  initStorage();
  const questions = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, DEMO_QUESTIONS);
  return questions.filter((q) => q.examId === examId).sort((a, b) => a.questionNumber - b.questionNumber);
}

// Student version strips answers to prevent cheating
export function getQuestionsForStudent(examId: string): StudentQuestion[] {
  const exam = getExamById(examId);
  const questions = getQuestions(examId);

  let list = questions.map((q) => ({
    id: q.id,
    examId: q.examId,
    questionNumber: q.questionNumber,
    questionText: q.questionText,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    marks: q.marks,
    negativeMarks: q.negativeMarks,
    image: q.image,
  }));

  if (exam?.questionRandomization) {
    list = [...list].sort(() => Math.random() - 0.5);
  }

  return list;
}

export function saveQuestion(question: Question): Question {
  const all = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, DEMO_QUESTIONS);
  const index = all.findIndex((q) => q.id === question.id);
  if (index !== -1) {
    all[index] = question;
  } else {
    all.push(question);
  }
  setStored(STORAGE_KEYS.QUESTIONS, all);

  // Update total questions in exam
  const examQuestions = all.filter((q) => q.examId === question.examId);
  updateExam(question.examId, {
    totalQuestions: examQuestions.length,
    totalMarks: examQuestions.reduce((acc, q) => acc + (q.marks || 1), 0),
  });

  return question;
}

export function saveQuestionsBatch(examId: string, newQuestions: Omit<Question, 'id' | 'examId'>[]): Question[] {
  const all = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, DEMO_QUESTIONS);
  const created: Question[] = newQuestions.map((q, idx) => ({
    id: `q-${examId}-${Date.now()}-${idx}`,
    examId,
    ...q,
  }));

  const updatedAll = [...all.filter((q) => q.examId !== examId), ...created];
  setStored(STORAGE_KEYS.QUESTIONS, updatedAll);

  updateExam(examId, {
    totalQuestions: created.length,
    totalMarks: created.reduce((acc, q) => acc + (q.marks || 1), 0),
  });

  return created;
}

export function deleteQuestion(questionId: string): void {
  const all = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, DEMO_QUESTIONS);
  const target = all.find((q) => q.id === questionId);
  const filtered = all.filter((q) => q.id !== questionId);
  setStored(STORAGE_KEYS.QUESTIONS, filtered);

  if (target) {
    const examQuestions = filtered.filter((q) => q.examId === target.examId);
    updateExam(target.examId, {
      totalQuestions: examQuestions.length,
      totalMarks: examQuestions.reduce((acc, q) => acc + (q.marks || 1), 0),
    });
  }
}

// Exam Attempts & Submissions
export function getAttempts(): ExamAttempt[] {
  initStorage();
  return getStored<ExamAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
}

export function getStudentAttempt(studentId: string, examId: string): ExamAttempt | undefined {
  const attempts = getAttempts();
  return attempts.find((a) => a.studentId === studentId && a.examId === examId);
}

export function startExamAttempt(student: Profile, exam: Exam): ExamAttempt {
  const attempts = getAttempts();
  const existing = attempts.find((a) => a.studentId === student.id && a.examId === exam.id);

  if (existing) {
    if (existing.status === 'submitted' || existing.status === 'auto_submitted') {
      return existing;
    }
    return existing;
  }

  const startTime = new Date();
  const expectedEndTime = new Date(startTime.getTime() + exam.durationMinutes * 60 * 1000);

  const newAttempt: ExamAttempt = {
    id: `attempt-${student.id}-${exam.id}-${Date.now()}`,
    studentId: student.id,
    studentName: student.fullName,
    studentStudentId: student.studentId,
    examId: exam.id,
    examTitle: exam.title,
    startTime: startTime.toISOString(),
    expectedEndTime: expectedEndTime.toISOString(),
    status: 'in_progress',
    tabSwitchCount: 0,
    answers: {},
    markedForReview: [],
  };

  attempts.push(newAttempt);
  setStored(STORAGE_KEYS.ATTEMPTS, attempts);
  return newAttempt;
}

export function saveStudentAnswer(
  attemptId: string,
  questionId: string,
  option: OptionKey | null,
  markedForReview?: boolean
): ExamAttempt {
  const attempts = getAttempts();
  const index = attempts.findIndex((a) => a.id === attemptId);
  if (index === -1) throw new Error('Attempt not found');

  const attempt = attempts[index];
  if (attempt.status !== 'in_progress') {
    return attempt;
  }

  const updatedAnswers = { ...attempt.answers };
  if (option === null) {
    delete updatedAnswers[questionId];
  } else {
    updatedAnswers[questionId] = option;
  }

  let updatedMarked = [...(attempt.markedForReview || [])];
  if (typeof markedForReview === 'boolean') {
    if (markedForReview && !updatedMarked.includes(questionId)) {
      updatedMarked.push(questionId);
    } else if (!markedForReview && updatedMarked.includes(questionId)) {
      updatedMarked = updatedMarked.filter((id) => id !== questionId);
    }
  }

  attempts[index] = {
    ...attempt,
    answers: updatedAnswers,
    markedForReview: updatedMarked,
  };

  setStored(STORAGE_KEYS.ATTEMPTS, attempts);
  return attempts[index];
}

export function recordTabSwitch(attemptId: string): number {
  const attempts = getAttempts();
  const index = attempts.findIndex((a) => a.id === attemptId);
  if (index === -1) return 0;

  attempts[index].tabSwitchCount = (attempts[index].tabSwitchCount || 0) + 1;
  setStored(STORAGE_KEYS.ATTEMPTS, attempts);
  return attempts[index].tabSwitchCount;
}

// EXACT NEGATIVE MARKING EVALUATION FORMULA:
// প্রাপ্ত ফলাফল = সঠিক MCQ − (ভুল MCQ সংখ্যা × 0.5)
// Final Score = Correct MCQ − (Wrong MCQ × 0.5)
// Unanswered questions = 0 mark
export function submitExamAttempt(attemptId: string, isAuto: boolean = false): ExamResult {
  const attempts = getAttempts();
  const attemptIndex = attempts.findIndex((a) => a.id === attemptId);
  if (attemptIndex === -1) throw new Error('Attempt not found');

  const attempt = attempts[attemptIndex];
  const results = getResults();

  // If already submitted, return existing result
  const existingResult = results.find((r) => r.attemptId === attemptId);
  if (existingResult) {
    return existingResult;
  }

  const exam = getExamById(attempt.examId);
  if (!exam) throw new Error('Exam not found');

  const questions = getQuestions(attempt.examId);
  const now = new Date();
  const start = new Date(attempt.startTime);
  const timeTakenSeconds = Math.max(1, Math.round((now.getTime() - start.getTime()) / 1000));

  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  questions.forEach((q) => {
    const studentChoice = attempt.answers[q.id];
    if (!studentChoice) {
      unansweredCount++;
    } else if (studentChoice.toUpperCase() === q.correctAnswer.toUpperCase()) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const negativeRate = exam.negativeMarking ?? 0.5;
  // Strict formula required:
  // Final Score = Correct - (Wrong * negativeRate)
  const deduction = wrongCount * negativeRate;
  const rawFinalScore = correctCount - deduction;
  // Format to max 2 decimals
  const finalScore = Math.round(rawFinalScore * 100) / 100;
  const percentage = Math.round(((finalScore / (exam.totalMarks || questions.length || 1)) * 100) * 100) / 100;

  // Lock attempt
  attempts[attemptIndex] = {
    ...attempt,
    status: isAuto ? 'auto_submitted' : 'submitted',
    submittedAt: now.toISOString(),
  };
  setStored(STORAGE_KEYS.ATTEMPTS, attempts);

  const newResult: ExamResult = {
    id: `res-${attempt.id}`,
    attemptId: attempt.id,
    studentId: attempt.studentId,
    studentName: attempt.studentName,
    studentStudentId: attempt.studentStudentId,
    batchName: exam.batchName,
    examId: exam.id,
    examTitle: exam.title,
    totalQuestions: questions.length,
    totalMarks: exam.totalMarks,
    negativeMarkRate: negativeRate,
    correctCount,
    wrongCount,
    unansweredCount,
    finalScore,
    percentage,
    timeTakenSeconds,
    startTime: attempt.startTime,
    submittedAt: now.toISOString(),
    tabSwitchCount: attempt.tabSwitchCount || 0,
    answersSnapshot: { ...attempt.answers },
  };

  results.push(newResult);
  setStored(STORAGE_KEYS.RESULTS, results);

  // Recalculate ranks for this exam
  recalculateRanks(exam.id);

  return getResults().find((r) => r.id === newResult.id) || newResult;
}

function recalculateRanks(examId: string): void {
  const results = getStored<ExamResult[]>(STORAGE_KEYS.RESULTS, DEMO_RESULTS);
  const examResults = results.filter((r) => r.examId === examId);

  // Sort by highest finalScore, then lowest timeTakenSeconds
  examResults.sort((a, b) => {
    if (b.finalScore !== a.finalScore) {
      return b.finalScore - a.finalScore;
    }
    return a.timeTakenSeconds - b.timeTakenSeconds;
  });

  examResults.forEach((res, index) => {
    res.rank = index + 1;
  });

  const otherResults = results.filter((r) => r.examId !== examId);
  setStored(STORAGE_KEYS.RESULTS, [...otherResults, ...examResults]);
}

// Results & Leaderboard
export function getResults(): ExamResult[] {
  initStorage();
  return getStored<ExamResult[]>(STORAGE_KEYS.RESULTS, DEMO_RESULTS);
}

export function getResultByAttemptId(attemptId: string): ExamResult | undefined {
  return getResults().find((r) => r.attemptId === attemptId);
}

export function getResultsByStudentId(studentId: string): ExamResult[] {
  return getResults().filter((r) => r.studentId === studentId);
}

export function getLeaderboard(examId: string): LeaderboardEntry[] {
  const results = getResults()
    .filter((r) => r.examId === examId)
    .sort((a, b) => {
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      return a.timeTakenSeconds - b.timeTakenSeconds;
    });

  return results.map((r, idx) => ({
    rank: idx + 1,
    studentName: r.studentName,
    studentStudentId: r.studentStudentId,
    batchName: r.batchName,
    finalScore: r.finalScore,
    percentage: r.percentage,
    timeTakenSeconds: r.timeTakenSeconds,
    submittedAt: r.submittedAt,
  }));
}

// Settings
export function getAcademySettings(): AcademySettings {
  initStorage();
  return getStored<AcademySettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function updateAcademySettings(newSettings: Partial<AcademySettings>): AcademySettings {
  const current = getAcademySettings();
  const updated = { ...current, ...newSettings };
  setStored(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}

export function resetDemoData(): void {
  setStored(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
  setStored(STORAGE_KEYS.BATCHES, DEMO_BATCHES);
  setStored(STORAGE_KEYS.EXAMS, DEMO_EXAMS);
  setStored(STORAGE_KEYS.QUESTIONS, DEMO_QUESTIONS);
  setStored(STORAGE_KEYS.RESULTS, DEMO_RESULTS);
  setStored(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  setStored(STORAGE_KEYS.ATTEMPTS, []);
  setCurrentUser(null);
}
