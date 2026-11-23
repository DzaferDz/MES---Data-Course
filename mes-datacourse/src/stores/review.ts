import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReviewSchedule, RecallRating } from '@/types';

interface ReviewState {
  schedules: Record<string, ReviewSchedule>;
  initCard: (cardId: string) => void;
  rateCard: (cardId: string, rating: RecallRating) => void;
  getDueCards: () => string[];
  getCardSchedule: (cardId: string) => ReviewSchedule | undefined;
  getStats: () => { total: number; mastered: number; learning: number; newCards: number };
}

function computeNext(schedule: ReviewSchedule, rating: RecallRating): ReviewSchedule {
  let { interval, easeFactor, repetitions } = schedule;

  if (rating === 'again') {
    repetitions = 0;
    interval = 0;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    if (rating === 'hard') {
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      interval = Math.max(1, Math.round(interval * 1.2));
    } else if (rating === 'good') {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 3;
      else interval = Math.round(interval * easeFactor);
    } else if (rating === 'easy') {
      easeFactor = Math.min(3.0, easeFactor + 0.15);
      if (repetitions === 0) interval = 3;
      else if (repetitions === 1) interval = 7;
      else interval = Math.round(interval * easeFactor * 1.3);
    }
    repetitions++;
  }

  // Next review in milliseconds
  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return { ...schedule, interval, easeFactor, repetitions, nextReview, lastRating: rating };
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      schedules: {},

      initCard: (cardId) => {
        if (get().schedules[cardId]) return;
        set((s) => ({
          schedules: {
            ...s.schedules,
            [cardId]: {
              cardId,
              nextReview: 0,
              interval: 0,
              easeFactor: 2.5,
              repetitions: 0,
            },
          },
        }));
      },

      rateCard: (cardId, rating) => {
        set((s) => {
          const current = s.schedules[cardId] || {
            cardId,
            nextReview: 0,
            interval: 0,
            easeFactor: 2.5,
            repetitions: 0,
          };
          return {
            schedules: { ...s.schedules, [cardId]: computeNext(current, rating) },
          };
        });
      },

      getDueCards: () => {
        const now = Date.now();
        return Object.entries(get().schedules)
          .filter(([, s]) => s.nextReview <= now)
          .sort((a, b) => a[1].nextReview - b[1].nextReview)
          .map(([id]) => id);
      },

      getCardSchedule: (cardId) => get().schedules[cardId],

      getStats: () => {
        const all = Object.values(get().schedules);
        return {
          total: all.length,
          mastered: all.filter((s) => s.interval >= 21).length,
          learning: all.filter((s) => s.repetitions > 0 && s.interval < 21).length,
          newCards: all.filter((s) => s.repetitions === 0).length,
        };
      },
    }),
    { name: 'mes_review' }
  )
);
