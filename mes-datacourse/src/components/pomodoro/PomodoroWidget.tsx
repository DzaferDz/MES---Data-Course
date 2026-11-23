import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePomodoroStore } from '@/stores/pomodoro';
import { useProgressStore } from '@/stores/progress';
import { Play, Pause, RotateCcw, FastForward, Timer, X } from 'lucide-react';

export const PomodoroWidget: React.FC = () => {
  const { t } = useTranslation();
  const {
    state,
    isRunning,
    timeRemaining,
    sessionCount,
    start,
    pause,
    reset,
    skip,
    tick,
    isVisible,
    toggleVisibility,
    getTodayStats,
  } = usePomodoroStore();

  const { logActivity } = useProgressStore();

  // Run interval when running
  useEffect(() => {
    let interval: number | null = null;
    if (isRunning) {
      interval = window.setInterval(() => {
        const completed = tick();
        if (completed && state === 'focus') {
          logActivity('pomodoro', 25);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick, state, logActivity]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const todayStats = getTodayStats();

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-5 right-5 z-40 bg-navy-900 text-white p-3 rounded-full shadow-lg hover:bg-navy-800 transition-all flex items-center space-x-2 border border-navy-700"
        title={t('pomodoro.toggleWidget')}
      >
        <Timer className="w-5 h-5 text-accent-400" />
        {isRunning && (
          <span className="text-xs font-mono font-bold text-accent-300">
            {formatTime(timeRemaining)}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 bg-white border border-surface-200 rounded-xl shadow-xl w-72 p-4 text-navy-900 transition-all">
      <div className="flex items-center justify-between border-b border-surface-200 pb-2 mb-3">
        <div className="flex items-center space-x-1.5">
          <Timer className="w-4 h-4 text-accent-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-navy-600">
            {state === 'focus'
              ? t('pomodoro.focus')
              : state === 'short_break'
              ? t('pomodoro.shortBreak')
              : state === 'long_break'
              ? t('pomodoro.longBreak')
              : t('pomodoro.focus')}
          </span>
        </div>
        <button
          onClick={toggleVisibility}
          className="text-navy-400 hover:text-navy-700 transition-colors"
          title={t('common.close')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-center my-2">
        <div className="text-3xl font-mono font-bold tracking-tight text-navy-900">
          {formatTime(timeRemaining)}
        </div>
        <div className="text-2xs text-navy-500 mt-1">
          {t('pomodoro.session')} #{sessionCount + 1} • {todayStats.sessions} {t('pomodoro.todaySessions').toLowerCase()} ({todayStats.focusMinutes}m)
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-2 mt-4 pt-2 border-t border-surface-100">
        <button
          onClick={() => (isRunning ? pause() : start())}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
            isRunning
              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              : 'bg-navy-900 text-white hover:bg-navy-800'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>{t('pomodoro.pause')}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>{t('pomodoro.start')}</span>
            </>
          )}
        </button>

        <button
          onClick={skip}
          className="p-1.5 rounded-lg text-navy-600 hover:bg-surface-100 transition-colors"
          title={t('pomodoro.skip')}
        >
          <FastForward className="w-4 h-4" />
        </button>

        <button
          onClick={reset}
          className="p-1.5 rounded-lg text-navy-600 hover:bg-surface-100 transition-colors"
          title={t('pomodoro.reset')}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
