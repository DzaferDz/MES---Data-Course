import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProgressStore } from '@/stores/progress';
import { usePomodoroStore } from '@/stores/pomodoro';
import { allPhases } from '@/content/phases';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { t } = useTranslation();
  const { lessons, getOverallProgress, getStreak, getPhaseProgress, challengesCompleted, dailyActivity } =
    useProgressStore();
  const { getTodayStats, sessions } = usePomodoroStore();

  const totalLessons = allPhases.reduce((acc, p) => acc + p.lessons.length, 0);
  const overallPercent = getOverallProgress(totalLessons);
  const streak = getStreak();
  const completedLessons = Object.values(lessons).filter((l) => l.status === 'completed');

  const totalFocusMinutes = sessions
    .filter((s) => s.completed && s.type === 'focus')
    .reduce((acc) => acc + 25, 0);

  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  // 9 Core Portfolio Milestones
  const milestones = [
    { title: 'Project Charter & Infranode API Inventory', phase: 1, done: lessons['1.1']?.status === 'completed' },
    { title: 'Weather & Live Transit Automated Harvester', phase: 2, done: lessons['2.3']?.status === 'completed' },
    { title: 'Deduplicated & Enriched Parquet Dataset', phase: 3, done: lessons['3.3']?.status === 'completed' },
    { title: 'Unified Master Analytics Dataset (Transit + DWD)', phase: 3, done: lessons['3.4']?.status === 'completed' },
    { title: 'Cross-City Delay Benchmarking & Statistics', phase: 4, done: lessons['4.2']?.status === 'completed' },
    { title: 'Relational Star Schema & SQLite Database', phase: 5, done: lessons['5.2']?.status === 'completed' },
    { title: 'Advanced Window Ranking & Analytical SQL Queries', phase: 5, done: lessons['5.3']?.status === 'completed' },
    { title: 'Interactive Power BI Portfolio Dashboard', phase: 7, done: lessons['7.3']?.status === 'completed' },
    { title: 'Supervised ML Delay Regressor with Chronological Split', phase: 8, done: lessons['8.3']?.status === 'completed' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-surface-200 pb-5">
        <h1 className="text-2xl font-black text-navy-950 tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-accent-600" />
          <span>{t('progress.title')}</span>
        </h1>
        <p className="text-xs text-navy-600 mt-1">
          {t('progress.subtitle')} — Real tracking of practical competencies and artifacts
        </p>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between text-2xs uppercase tracking-wider font-bold text-navy-400">
            <span>{t('progress.overview')}</span>
            <Award className="w-4 h-4 text-accent-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-navy-900">{overallPercent}%</span>
            <span className="text-2xs text-navy-500">
              ({completedLessons.length}/{totalLessons})
            </span>
          </div>
          <div className="w-full bg-surface-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-accent-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between text-2xs uppercase tracking-wider font-bold text-navy-400">
            <span>{t('progress.totalTime')}</span>
            <Clock className="w-4 h-4 text-navy-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-navy-900">{totalFocusHours}</span>
            <span className="text-2xs text-navy-500">{t('progress.hours')} focused</span>
          </div>
          <p className="text-2xs text-navy-500 mt-2">{sessions.length} Pomodoro intervals</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between text-2xs uppercase tracking-wider font-bold text-navy-400">
            <span>{t('dashboard.streak')}</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-navy-900">{streak}</span>
            <span className="text-2xs text-navy-500">{t('common.days')} continuous</span>
          </div>
          <p className="text-2xs text-navy-500 mt-2">Active recall & study discipline</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between text-2xs uppercase tracking-wider font-bold text-navy-400">
            <span>Mini Challenges</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-navy-900">{challengesCompleted.length}</span>
            <span className="text-2xs text-navy-500">solved</span>
          </div>
          <p className="text-2xs text-navy-500 mt-2">Python, SQL, Excel & Power BI</p>
        </div>
      </div>

      {/* Portfolio Milestones Matrix */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-500 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-accent-600" />
          <span>{t('progress.milestones')}</span>
        </h2>

        <div className="divide-y divide-surface-100">
          {milestones.map((m, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                {m.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-navy-300 shrink-0" />
                )}
                <div>
                  <span className={`font-semibold ${m.done ? 'text-navy-900' : 'text-navy-600'}`}>
                    {m.title}
                  </span>
                  <span className="text-2xs text-navy-400 ml-2">Phase {m.phase}</span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-2xs font-semibold ${
                  m.done ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-100 text-navy-500'
                }`}
              >
                {m.done ? 'Completed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Completion Detail Bars */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-500">
          {t('progress.phaseProgress')}
        </h2>

        <div className="space-y-4">
          {allPhases.map((phase) => {
            const { completed, total, percent } = getPhaseProgress(phase.id, phase.lessons.length);
            return (
              <div key={phase.id} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-navy-900">
                    Phase {phase.id}: {t(`phases.phase${phase.id}.shortTitle` as any)}
                  </span>
                  <span className="text-navy-600 font-mono text-2xs">
                    {completed}/{total} lessons ({percent}%)
                  </span>
                </div>
                <div className="w-full bg-surface-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-navy-900 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
