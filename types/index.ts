/**
 * TypeScript Type Definitions for AshPhys Platform
 */

// ============================================
// USER & AUTH TYPES
// ============================================

export type UserRole = 'student' | 'teacher' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  schoolId?: string;
  sectionId?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  id: string;
  email: string;
  role: UserRole;
  sectionId?: string;
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  sectionId?: string;
}

// ============================================
// COURSE & CHAPTER TYPES
// ============================================

export type ChapterStatus = 'draft' | 'published' | 'archived';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface Course {
  id: string;
  title: string;
  description: string;
  code: string;
  version: string;
  createdBy: string;
  status: ChapterStatus;
  createdAt: Date;
}

export interface Chapter {
  id: string;
  courseId: string;
  chapterNumber: number;
  title: string;
  description: string;
  unitIgcseCode?: string;
  unitMebCode?: string;
  learningObjectives: string[];
  weekStart?: number;
  weekEnd?: number;
  releaseDate: Date;
  status: ChapterStatus;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  chapterId: string;
  topicName: string;
  description?: string;
  order?: number;
}

export interface Lesson {
  id: string;
  topicId: string;
  lessonType: 'video' | 'article' | 'simulation' | 'interactive';
  title: string;
  contentUrl?: string;
  contentMarkdown?: string;
  durationMinutes?: number;
  order?: number;
}

// ============================================
// PROBLEM & QUIZ TYPES
// ============================================

export type AnswerType = 'multiple_choice' | 'numeric' | 'free_text' | 'graph' | 'equation';
export type QuizType = 'checkpoint' | 'comprehensive' | 'practice';

export interface Problem {
  id: string;
  chapterId: string;
  problemNumber?: number;
  questionText: string;
  questionMarkdown?: string;
  questionImageUrl?: string;
  difficultyLevel: 1 | 2 | 3;
  answerType: AnswerType;
  answerCorrect: string;
  explanation?: string;
  points: number;
  order?: number;
  options?: ProblemOption[];
}

export interface ProblemOption {
  id: string;
  problemId: string;
  optionText: string;
  optionLetter?: string;
  isCorrect: boolean;
  order?: number;
}

export interface Quiz {
  id: string;
  chapterId: string;
  title: string;
  quizType: QuizType;
  description?: string;
  passingScore: number;
  timeLimitMinutes?: number;
  problemIds?: string[];
  createdAt: Date;
}

export interface ProblemSubmission {
  id: string;
  studentId: string;
  problemId: string;
  submittedAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  attempts: number;
  timeSpentSeconds?: number;
  submittedAt: Date;
}

export interface QuizSubmission {
  id: string;
  studentId: string;
  quizId: string;
  score: number;
  passed: boolean;
  startedAt: Date;
  completedAt: Date;
  timeSpentSeconds?: number;
}

// ============================================
// SIMULATION TYPES
// ============================================

export type SimType =
  | 'graph_builder'
  | 'force_diagram'
  | 'circuit'
  | 'field_visualizer'
  | 'collision'
  | 'energy'
  | 'electric_field'
  | 'wave';

export interface Simulation {
  id: string;
  chapterId: string;
  title: string;
  description?: string;
  simType: SimType;
  urlPath: string;
  difficultyLevel: 1 | 2 | 3;
  learningObjectives?: string[];
  order?: number;
  createdAt: Date;
}

export interface SimulationInteraction {
  id: string;
  studentId: string;
  simulationId: string;
  interactionData: Record<string, any>;
  screenshotUrl?: string;
  timeSpentSeconds?: number;
  submittedAt: Date;
}

// ============================================
// PROGRESS TRACKING
// ============================================

export interface StudentProgress {
  id: string;
  studentId: string;
  chapterId: string;
  completionPercent: number;
  startedAt?: Date;
  lastAccessedAt?: Date;
  finishedAt?: Date;
  status: ProgressStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Q&A TYPES
// ============================================

export interface QAThread {
  id: string;
  chapterId?: string;
  problemId?: string;
  sectionId?: string;
  studentId: string;
  title: string;
  body: string;
  likes: number;
  resolved: boolean;
  solvedByReplyId?: string;
  createdAt: Date;
  updatedAt: Date;
  replies?: QAReply[];
  author?: User;
}

export interface QAReply {
  id: string;
  threadId: string;
  authorId: string;
  body: string;
  likes: number;
  isTeacherReply: boolean;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// SUBSCRIPTION TYPES
// ============================================

export type SubscriptionTier = 'free' | 'premium';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';

export interface Subscription {
  id: string;
  studentId: string;
  tier: SubscriptionTier;
  startDate: Date;
  endDate?: Date;
  iyzico_subscription_id?: string;
  iyzico_customer_id?: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}
