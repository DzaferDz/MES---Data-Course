import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PomodoroConfig, PomodoroState, PomodoroSession } from '@/types';

interface PomodoroStore {
  config: PomodoroConfig;
  state: PomodoroState;
  timeRemaining: number;
  sessionCount: number;
  currentLessonId: string | null;
  sessions: PomodoroSession[];
  isVisible: boolean;
  isRunning: boolean;

  setConfig: (config: Partial<PomodoroConfig>) => void;
  start: (lessonId?: string) => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => boolean;
  toggleVisibility: () => void;
  getTodayStats: () => { sessions: number; focusMinutes: number };
}

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      config: {
        focusMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        sessionsBeforeLongBreak: 4,
      },
      state: 'idle',
      isRunning: false,
      timeRemaining: 25 * 60,
      sessionCount: 0,
      currentLessonId: null,
      sessions: [],
      isVisible: true,

      setConfig: (partial) => {
        set((s) => {
          const config = { ...s.config, ...partial };
          const timeRemaining = s.state === 'idle' ? config.focusMinutes * 60 : s.timeRemaining;
          return { config, timeRemaining };
        });
      },

      start: (lessonId) => {
        const s = get();
        if (s.state === 'idle') {
          set({
            state: 'focus',
            isRunning: true,
            timeRemaining: s.config.focusMinutes * 60,
            currentLessonId: lessonId || null,
          });
        } else {
          set({ isRunning: true });
        }
      },

      pause: () => set({ isRunning: false }),

      reset: () => {
        const s = get();
        set({
          state: 'idle',
          isRunning: false,
          timeRemaining: s.config.focusMinutes * 60,
          sessionCount: 0,
        });
      },

      skip: () => {
        const s = get();
        if (s.state === 'focus') {
          const nextCount = s.sessionCount + 1;
          const isLong = nextCount % s.config.sessionsBeforeLongBreak === 0;
          set({
            state: isLong ? 'long_break' : 'short_break',
            isRunning: true,
            timeRemaining: isLong ? s.config.longBreakMinutes * 60 : s.config.shortBreakMinutes * 60,
            sessionCount: nextCount,
          });
        } else {
          set({
            state: 'focus',
            isRunning: true,
            timeRemaining: s.config.focusMinutes * 60,
          });
        }
      },

      tick: () => {
        const s = get();
        if (!s.isRunning || s.state === 'idle') return false;

        const next = s.timeRemaining - 1;
        if (next <= 0) {
          if (s.state === 'focus') {
            const session: PomodoroSession = {
              startedAt: Date.now() - s.config.focusMinutes * 60 * 1000,
              endedAt: Date.now(),
              type: 'focus',
              lessonId: s.currentLessonId || undefined,
              completed: true,
            };
            const nextCount = s.sessionCount + 1;
            const isLong = nextCount % s.config.sessionsBeforeLongBreak === 0;
            set({
              state: isLong ? 'long_break' : 'short_break',
              isRunning: false,
              timeRemaining: isLong ? s.config.longBreakMinutes * 60 : s.config.shortBreakMinutes * 60,
              sessionCount: nextCount,
              sessions: [...s.sessions, session],
            });
          } else {
            set({
              state: 'focus',
              isRunning: false,
              timeRemaining: s.config.focusMinutes * 60,
            });
          }
          return true;
        }

        set({ timeRemaining: next });
        return false;
      },

      toggleVisibility: () => set((s) => ({ isVisible: !s.isVisible })),

      getTodayStats: () => {
        const today = new Date().toISOString().slice(0, 10);
        const todaySessions = get().sessions.filter(
          (s) =>
            s.type === 'focus' &&
            s.completed &&
            s.endedAt &&
            new Date(s.endedAt).toISOString().slice(0, 10) === today
        );
        return {
          sessions: todaySessions.length,
          focusMinutes: todaySessions.length * get().config.focusMinutes,
        };
      },
    }),
    {
      name: 'mes_pomodoro',
      partialize: (s) => ({
        config: s.config,
        sessions: s.sessions,
        sessionCount: s.sessionCount,
        isVisible: s.isVisible,
      }),
    }
  )
);
