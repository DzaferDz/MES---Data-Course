import type { Phase } from '@/types';
import { phase1 } from './phase1';
import { phase2 } from './phase2';
import { phase3 } from './phase3';
import { phase4 } from './phase4';
import { phase5 } from './phase5';
import { phase6 } from './phase6';
import { phase7 } from './phase7';
import { phase8 } from './phase8';

export const allPhases: Phase[] = [
  phase1,
  phase2,
  phase3,
  phase4,
  phase5,
  phase6,
  phase7,
  phase8,
];

export const getPhaseById = (id: number): Phase | undefined => {
  return allPhases.find((p) => p.id === id);
};

export const getLessonById = (lessonId: string) => {
  for (const phase of allPhases) {
    const lesson = phase.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, phase };
  }
  return undefined;
};

export const getTotalLessonCount = () => {
  return allPhases.reduce((acc, p) => acc + p.lessons.length, 0);
};

export const getNextLessonId = (currentLessonId: string): string | null => {
  const flatLessons = allPhases.flatMap((p) => p.lessons);
  const idx = flatLessons.findIndex((l) => l.id === currentLessonId);
  if (idx >= 0 && idx < flatLessons.length - 1) {
    return flatLessons[idx + 1].id;
  }
  return null;
};

export const getPreviousLessonId = (currentLessonId: string): string | null => {
  const flatLessons = allPhases.flatMap((p) => p.lessons);
  const idx = flatLessons.findIndex((l) => l.id === currentLessonId);
  if (idx > 0) {
    return flatLessons[idx - 1].id;
  }
  return null;
};
