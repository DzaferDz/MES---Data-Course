import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProgressStore } from '@/stores/progress';
import { useReviewStore } from '@/stores/review';
import { usePomodoroStore } from '@/stores/pomodoro';
import { allPhases } from '@/content/phases';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Repeat,
  Zap,
  BookOpen,
  TrendingUp,
  Target,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { lessons, getOverallProgress, getStreak, getPhaseProgress, challengesCompleted, getTodayActivity } =
    useProgressStore();
  const { getDueCards, getStats } = useReviewStore();
  const { getTodayStats } = usePomodoroStore();

  const totalLessons = allPhases.reduce((acc, p) => acc + p.lessons.length, 0);
  const overallPercent = getOverallProgress(totalLessons);
  const streak = getStreak();
  const dueCards = getDueCards();
  const reviewStats = getStats();
  const todayActivity = getTodayActivity();
  const todayPomodoro = getTodayStats();

  const completedLessonIds = Object.keys(lessons).filter((id) => lessons[id].status === 'completed');

  // Find next lesson to take
  let nextLesson = allPhases[0].lessons[0];
  let currentPhase = allPhases[0];

  for (const phase of allPhases) {
    const uncompleted = phase.lessons.find((l) => lessons[l.id]?.status !== 'completed');
    if (uncompleted) {
      nextLesson = uncompleted;
      currentPhase = phase;
      break;
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Hero / Quick Status Banner */}
      <div className="bg-navy-950 text-white rounded-2xl p-6 lg:p-8 border border-navy-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>German Urban Mobility Analytics</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-navy-300 text-sm mt-2 leading-relaxed">
            {t('app.tagline')}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to={`/lessons/${nextLesson.id}`}
              className="bg-accent-500 hover:bg-accent-400 text-navy-950 font-bold px-5 py-2.5 rounded-lg text-xs flex items-center space-x-2 transition-colors shadow-sm"
            >
              <span>
                {completedLessonIds.length === 0 ? t('dashboard.startBtn') : t('dashboard.continueBtn')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/project"
              className="bg-navy-900 hover:bg-navy-800 text-navy-200 border border-navy-700 font-semibold px-4 py-2.5 rounded-lg text-xs transition-colors"
            >
              {t('nav.project')} Blueprint
            </Link>
          </div>
        </div>

        {/* Next Lesson Snapshot Card on the right */}
        <div className="hidden lg:block absolute right-8 top-8 bottom-8 w-80 bg-navy-900/90 border border-navy-700/60 rounded-xl p-5 text-xs">
          <span className="text-navy-400 font-semibold uppercase tracking-wider text-2xs block">
            {t('dashboard.nextLesson')}
          </span>
          <h3 className="font-bold text-white text-sm mt-1 line-clamp-2">
            {nextLesson.id}. {t(`phases.phase${nextLesson.phaseId}.shortTitle` as any)}: {nextLesson.titleKey}
          </h3>
          <div className="mt-3 flex items-center space-x-3 text-navy-300 text-2xs">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-accent-400" />
              <span>{nextLesson.estimatedMinutes} {t('common.minutes')}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Target className="w-3 h-3 text-accent-400" />
              <span>Phase {nextLesson.phaseId}</span>
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-navy-800 text-navy-300 text-2xs line-clamp-2">
            {nextLesson.deliverable}
          </div>
        </div>
      </div>

      {/* 4 Core Questions Quick-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Completion */}
        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between text-navy-500 text-xs font-medium">
            <span>{t('dashboard.overallProgress')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-navy-900">{overallPercent}%</span>
            <span className="text-xs text-navy-500">
              ({completedLessonIds.length}/{totalLessons} lessons)
            </span>
          </div>
          <div className="w-full bg-surface-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-accent-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Spaced Reviews Due */}
        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between text-navy-500 text-xs font-medium">
            <span>{t('dashboard.reviewDue')}</span>
            <Repeat className="w-4 h-4 text-accent-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-navy-900">{dueCards.length}</span>
            <span className="text-xs text-navy-500">{t('review.cardsRemaining')}</span>
          </div>
          <div className="mt-3">
            {dueCards.length > 0 ? (
              <Link
                to="/review"
                className="text-xs font-semibold text-accent-600 hover:text-accent-700 flex items-center space-x-1"
              >
                <span>{t('review.startReview')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="text-2xs text-emerald-600 font-medium">
                ✓ {t('review.noCardsDue')}
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Focus Study Time */}
        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between text-navy-500 text-xs font-medium">
            <span>{t('dashboard.studyTime')}</span>
            <Clock className="w-4 h-4 text-navy-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-navy-900">
              {todayPomodoro.focusMinutes}
            </span>
            <span className="text-xs text-navy-500">{t('dashboard.minutesStudied')} today</span>
          </div>
          <div className="mt-3 text-2xs text-navy-500">
            {todayPomodoro.sessions} focus intervals recorded
          </div>
        </div>

        {/* Metric 4: Streak & Discipline */}
        <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between text-navy-500 text-xs font-medium">
            <span>{t('dashboard.streak')}</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-navy-900">{streak}</span>
            <span className="text-xs text-navy-500">{t('common.days')} in a row</span>
          </div>
          <div className="mt-3 text-2xs text-navy-500">
            {challengesCompleted.length} mini challenges solved
          </div>
        </div>
      </div>

      {/* Answer the 4 Core Analytical Questions */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-2xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-500 mb-4">
          Session Orientation & Immediate Priorities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Q1: What have I learned? */}
          <div className="p-4 rounded-lg bg-surface-50 border border-surface-200/80">
            <div className="font-bold text-navy-900 flex items-center space-x-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. {t('dashboard.whatLearned')}</span>
            </div>
            <p className="text-navy-600 leading-relaxed">
              {completedLessonIds.length > 0
                ? `You have completed ${completedLessonIds.length} lessons across the German urban mobility curriculum, producing working Python scripts, clean Parquet datasets, or relational queries.`
                : 'You are at the starting gate. You will master live REST API harvesting, data engineering with Pandas, SQL relational analytics, and ML delay forecasting.'}
            </p>
          </div>

          {/* Q2: What should I learn next? */}
          <div className="p-4 rounded-lg bg-surface-50 border border-surface-200/80">
            <div className="font-bold text-navy-900 flex items-center space-x-2 mb-1.5">
              <Target className="w-4 h-4 text-accent-600" />
              <span>2. {t('dashboard.whatNext')}</span>
            </div>
            <p className="text-navy-600 leading-relaxed">
              <strong>Lesson {nextLesson.id}: {nextLesson.titleKey}</strong> — Focus on{' '}
              {nextLesson.deliverable || 'hands-on assignment in your local VS Code environment'}.
            </p>
          </div>

          {/* Q3: What do I need to revise? */}
          <div className="p-4 rounded-lg bg-surface-50 border border-surface-200/80">
            <div className="font-bold text-navy-900 flex items-center space-x-2 mb-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>3. {t('dashboard.whatRevise')}</span>
            </div>
            <p className="text-navy-600 leading-relaxed">
              {dueCards.length > 0
                ? `You have ${dueCards.length} concept cards scheduled for active recall today (including SQL window functions, Pandas operations, and time-series splits).`
                : 'No urgent items due. Your memory retention is up to date based on the SM-2 spaced repetition scheduler.'}
            </p>
          </div>

          {/* Q4: How much practical work completed? */}
          <div className="p-4 rounded-lg bg-surface-50 border border-surface-200/80">
            <div className="font-bold text-navy-900 flex items-center space-x-2 mb-1.5">
              <TrendingUp className="w-4 h-4 text-navy-700" />
              <span>4. {t('dashboard.practicalCompleted')}</span>
            </div>
            <p className="text-navy-600 leading-relaxed">
              {completedLessonIds.length} verified project checkpoints • {challengesCompleted.length} independent mini
              challenges • {todayPomodoro.focusMinutes} focus minutes logged.
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum Phase Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-navy-950">
              {t('dashboard.phasesOverview')}
            </h2>
            <p className="text-xs text-navy-500 mt-0.5">
              8-phase end-to-end German urban mobility analytics lifecycle
            </p>
          </div>
          <Link
            to="/learning-path"
            className="text-xs font-semibold text-accent-600 hover:text-accent-700 flex items-center space-x-1"
          >
            <span>{t('nav.learningPath')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allPhases.map((phase) => {
            const { completed, total, percent } = getPhaseProgress(phase.id, phase.lessons.length);
            const isCompleted = completed === total && total > 0;

            return (
              <Link
                key={phase.id}
                to={`/learning-path#phase-${phase.id}`}
                className="bg-white p-4 rounded-xl border border-surface-200 hover:border-navy-300 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs font-bold uppercase tracking-wider text-navy-400">
                      Phase {phase.id}
                    </span>
                    {isCompleted ? (
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Done
                      </span>
                    ) : (
                      <span className="text-2xs font-semibold text-navy-500 font-mono">
                        {percent}%
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-navy-950 text-xs line-clamp-2">
                    {t(`phases.phase${phase.id}.shortTitle` as any)}
                  </h3>
                  <p className="text-2xs text-navy-500 mt-1 line-clamp-2">
                    {t(`phases.phase${phase.id}.description` as any)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between text-2xs text-navy-500">
                  <span>
                    {completed}/{total} lessons
                  </span>
                  <div className="w-16 bg-surface-100 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-accent-500 h-full rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
