// ─── Core domain types for MES-DataCourse ───

export type Language = 'en' | 'de' | 'bhs';

export type PhaseId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Phase {
  id: PhaseId;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  lessons: Lesson[];
  color: string;
}

export interface Lesson {
  id: string;            // e.g. "1.3" = Phase 1, Lesson 3
  phaseId: PhaseId;
  titleKey: string;
  estimatedMinutes: number;
  objectives: string[];  // i18n keys
  sections: LessonSection[];
  deliverable?: string;  // i18n key
}

export type LessonSectionType =
  | 'theory'
  | 'exercise'
  | 'solution'
  | 'reflection'
  | 'checklist'
  | 'info'
  | 'code'
  | 'table'
  | 'expectedOutput'
  | 'hints';

export interface LessonSection {
  type: LessonSectionType;
  titleKey: string;
  contentKey: string;    // i18n key for the section body (markdown)
  language?: 'python' | 'sql' | 'json' | 'bash' | 'dax' | 'excel';
  hints?: string[];      // i18n keys
  checklistItems?: string[]; // i18n keys
}

// ─── Progress ───

export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonProgress {
  lessonId: string;
  status: TaskStatus;
  completedAt?: number;  // unix ms
  selfAssessment?: 1 | 2 | 3 | 4 | 5;
  timeSpentMinutes: number;
}

export interface PhaseProgress {
  phaseId: PhaseId;
  lessonsCompleted: number;
  lessonsTotal: number;
}

// ─── Notes ───

export interface Note {
  id: string;
  lessonId?: string;
  phaseId?: PhaseId;
  title: string;
  content: string;       // markdown
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

// ─── Spaced Repetition ───

export type RecallRating = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewCard {
  id: string;
  questionKey: string;   // i18n key
  answerKey: string;      // i18n key
  phaseId: PhaseId;
  topic: string;
  difficulty: 1 | 2 | 3;
}

export interface ReviewSchedule {
  cardId: string;
  nextReview: number;    // unix ms
  interval: number;      // days
  easeFactor: number;    // SM-2
  repetitions: number;
  lastRating?: RecallRating;
}

// ─── Mini Challenges ───

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface MiniChallenge {
  id: string;
  titleKey: string;
  descriptionKey: string;
  phaseId: PhaseId;
  difficulty: ChallengeDifficulty;
  tool: 'python' | 'sql' | 'excel' | 'powerbi' | 'general';
  expectedOutputKey: string;
  hintsKeys: string[];
  solutionKey: string;
}

// ─── Pomodoro ───

export type PomodoroState = 'idle' | 'focus' | 'short_break' | 'long_break';

export interface PomodoroConfig {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
}

export interface PomodoroSession {
  startedAt: number;
  endedAt?: number;
  type: 'focus' | 'short_break' | 'long_break';
  lessonId?: string;
  completed: boolean;
}

// ─── Learning Stats ───

export interface DailyActivity {
  date: string;          // YYYY-MM-DD
  minutesStudied: number;
  lessonsCompleted: number;
  challengesCompleted: number;
  reviewsCompleted: number;
  pomodoroSessions: number;
}
