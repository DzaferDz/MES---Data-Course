import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LessonProgress, TaskStatus, DailyActivity } from '@/types';

interface ProgressState {
  lessons: Record<string, LessonProgress>;
  challengesCompleted: string[];
  dailyActivity: Record<string, DailyActivity>;

  setLessonStatus: (lessonId: string, status: TaskStatus) => void;
  updateLessonTime: (lessonId: string, minutes: number) => void;
  toggleChallenge: (challengeId: string) => void;
  logActivity: (type: 'lesson' | 'challenge' | 'review' | 'pomodoro', minutes?: number) => void;
  getPhaseProgress: (phaseId: number, totalLessons: number) => { completed: number; total: number; percent: number };
  getOverallProgress: (totalLessons: number) => number;
  getTodayActivity: () => DailyActivity;
  getStreak: () => number;
  resetAll: () => void;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => boolean;
}

const todayKey = () => new Date().toISOString().slice(0, 10);

const emptyDay = (date: string): DailyActivity => ({
  date,
  minutesStudied: 0,
  lessonsCompleted: 0,
  challengesCompleted: 0,
  reviewsCompleted: 0,
  pomodoroSessions: 0,
});

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessons: {},
      challengesCompleted: [],
      dailyActivity: {},

      setLessonStatus: (lessonId, status) => {
        set((s) => {
          const existing = s.lessons[lessonId] || { lessonId, status: 'not_started', timeSpentMinutes: 0 };
          const updated = {
            ...existing,
            status,
            ...(status === 'completed' ? { completedAt: Date.now() } : {}),
          };
          return { lessons: { ...s.lessons, [lessonId]: updated } };
        });
        if (status === 'completed') get().logActivity('lesson');
      },

      updateLessonTime: (lessonId, minutes) => {
        set((s) => {
          const existing = s.lessons[lessonId] || { lessonId, status: 'in_progress', timeSpentMinutes: 0 };
          return {
            lessons: {
              ...s.lessons,
              [lessonId]: { ...existing, timeSpentMinutes: existing.timeSpentMinutes + minutes },
            },
          };
        });
      },

      toggleChallenge: (challengeId) => {
        set((s) => {
          const exists = s.challengesCompleted.includes(challengeId);
          if (exists) {
            return { challengesCompleted: s.challengesCompleted.filter((id) => id !== challengeId) };
          }
          return { challengesCompleted: [...s.challengesCompleted, challengeId] };
        });
        get().logActivity('challenge');
      },

      logActivity: (type, minutes = 0) => {
        set((s) => {
          const key = todayKey();
          const day = s.dailyActivity[key] || emptyDay(key);
          const updated = { ...day };
          if (type === 'lesson') updated.lessonsCompleted += 1;
          if (type === 'challenge') updated.challengesCompleted += 1;
          if (type === 'review') updated.reviewsCompleted += 1;
          if (type === 'pomodoro') updated.pomodoroSessions += 1;
          updated.minutesStudied += minutes;
          return { dailyActivity: { ...s.dailyActivity, [key]: updated } };
        });
      },

      getPhaseProgress: (phaseId, totalLessons) => {
        const lessons = get().lessons;
        const completed = Object.values(lessons).filter(
          (l) => l.lessonId.startsWith(`${phaseId}.`) && l.status === 'completed'
        ).length;
        return {
          completed,
          total: totalLessons,
          percent: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
        };
      },

      getOverallProgress: (totalLessons) => {
        const completed = Object.values(get().lessons).filter((l) => l.status === 'completed').length;
        return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
      },

      getTodayActivity: () => {
        const key = todayKey();
        return get().dailyActivity[key] || emptyDay(key);
      },

      getStreak: () => {
        const activity = get().dailyActivity;
        let streak = 0;
        const d = new Date();
        while (true) {
          const key = d.toISOString().slice(0, 10);
          const day = activity[key];
          if (day && (day.minutesStudied > 0 || day.lessonsCompleted > 0 || day.challengesCompleted > 0)) {
            streak++;
            d.setDate(d.getDate() - 1);
          } else if (streak === 0) {
            d.setDate(d.getDate() - 1);
            const prevKey = d.toISOString().slice(0, 10);
            if (activity[prevKey] && (activity[prevKey].minutesStudied > 0 || activity[prevKey].lessonsCompleted > 0)) {
              streak++;
              d.setDate(d.getDate() - 1);
            } else break;
          } else break;
        }
        return streak;
      },

      resetAll: () => set({ lessons: {}, challengesCompleted: [], dailyActivity: {} }),

      exportBackup: () => {
        return JSON.stringify(get(), null, 2);
      },

      importBackup: (jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed && typeof parsed === 'object') {
            set({
              lessons: parsed.lessons || {},
              challengesCompleted: parsed.challengesCompleted || [],
              dailyActivity: parsed.dailyActivity || {},
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    { name: 'mes_progress' }
  )
);
