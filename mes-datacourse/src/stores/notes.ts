import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note } from '@/types';

interface NotesState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'tags' | 'lessonId' | 'phaseId'>>) => void;
  deleteNote: (id: string) => void;
  getNotesForLesson: (lessonId: string) => Note[];
  getNotesForPhase: (phaseId: number) => Note[];
  searchNotes: (query: string) => Note[];
}

const genId = () => `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [
        {
          id: 'welcome_note',
          title: 'Project Notes: German Urban Mobility Analytics',
          content: '### Welcome to your analytical notebook\n\nUse this space to document:\n- Key Python scripts for data collection\n- Tricky Pandas transformations & index pitfalls\n- SQL window function patterns (e.g. `RANK() OVER (PARTITION BY route_id ORDER BY delay_s DESC)`)\n- DAX formulas (`CALCULATE` filter context rules)\n- Model evaluation metrics: MAE, RMSE, R²\n\n*All notes persist in local storage.*',
          tags: ['cheatsheet', 'overview', 'python', 'sql'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],

      addNote: (note) => {
        const id = genId();
        const now = Date.now();
        set((s) => ({
          notes: [{ ...note, id, createdAt: now, updatedAt: now }, ...s.notes],
        }));
        return id;
      },

      updateNote: (id, updates) => {
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
          ),
        }));
      },

      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      getNotesForLesson: (lessonId) => get().notes.filter((n) => n.lessonId === lessonId),

      getNotesForPhase: (phaseId) => get().notes.filter((n) => n.phaseId === phaseId),

      searchNotes: (query) => {
        if (!query.trim()) return get().notes;
        const q = query.toLowerCase();
        return get().notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q))
        );
      },
    }),
    { name: 'mes_notes' }
  )
);
