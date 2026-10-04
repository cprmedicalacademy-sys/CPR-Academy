export type Role = 'admin' | 'student';

export interface Profile {
  id: string;
  fullName: string;
  studentId: string;
  mobileNumber: string;
  email: string;
  role: Role;
  batchId?: string;
  batchName?: string;
  profilePicture?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Batch {
  id: string;
  batchName: string;
  course: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'archived';
  studentCount?: number;
}

export type ExamStatus = 'draft' | 'published' | 'live' | 'completed';

export interface Exam {
  id: string;
  title: string;
  subject: string;
  topic: string;
  description: string;
  batchId: string; // or 'all'
  batchName: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  negativeMarking: number; // default 0.5
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: ExamStatus;
  resultVisibility: boolean;
  leaderboardVisibility: boolean;
  answerReview: boolean;
  questionRandomization: boolean;
  optionRandomization: boolean;
  createdAt: string;
}

export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: string;
  examId: string;
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: OptionKey;
  marks: number;
  negativeMarks: number;
  explanation?: string;
  image?: string;
}

// Student version of Question that strips correctAnswer and explanation
export interface StudentQuestion {
  id: string;
  examId: string;
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  marks: number;
  negativeMarks: number;
  image?: string;
}

export type AttemptStatus = 'in_progress' | 'submitted' | 'auto_submitted';

export interface ExamAttempt {
  id: string;
  studentId: string;
  studentName: string;
  studentStudentId: string;
  examId: string;
  examTitle: string;
  startTime: string;
  expectedEndTime: string;
  status: AttemptStatus;
  tabSwitchCount: number;
  answers: Record<string, OptionKey>; // questionId -> option
  markedForReview: string[]; // list of questionIds
  submittedAt?: string;
}

export interface ExamResult {
  id: string;
  attemptId: string;
  studentId: string;
  studentName: string;
  studentStudentId: string;
  batchName: string;
  examId: string;
  examTitle: string;
  totalQuestions: number;
  totalMarks: number;
  negativeMarkRate: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  finalScore: number;
  percentage: number;
  timeTakenSeconds: number;
  startTime: string;
  submittedAt: string;
  tabSwitchCount: number;
  rank?: number;
  answersSnapshot: Record<string, OptionKey>;
}

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  studentStudentId: string;
  batchName: string;
  finalScore: number;
  percentage: number;
  timeTakenSeconds: number;
  submittedAt: string;
}

export interface AcademySettings {
  academyName: string;
  portalName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  defaultDurationMinutes: number;
  defaultNegativeMarking: number;
  leaderboardEnabled: boolean;
  resultVisibilityDefault: boolean;
}

export interface ImportedQuestionDraft {
  id: string;
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: OptionKey;
  marks: number;
  negativeMarks: number;
  explanation?: string;
  validationError?: string;
  status: 'valid' | 'has_error' | 'approved';
}
