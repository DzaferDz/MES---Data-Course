import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useProgressStore } from '@/stores/progress';
import { usePomodoroStore } from '@/stores/pomodoro';
import { Flame, Clock, Award, Menu } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { getStreak, getOverallProgress } = useProgressStore();
  const { isRunning, timeRemaining } = usePomodoroStore();
  const { toggleSidebar } = useSettingsStore();

  const streak = getStreak();
  const overallPercent = getOverallProgress(35); // Estimated ~35 core deliverable checkpoints

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-xs border-b border-surface-200 px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Mobile Sidebar Toggle + Breadcrumb or Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-navy-600 hover:bg-surface-100 lg:hidden"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
          <span className="font-bold text-navy-900 tracking-tight text-sm lg:text-base">
            {t('app.title')}
          </span>
          <span className="hidden md:inline-block text-surface-300">/</span>
          <span className="hidden md:inline-block text-xs text-navy-500 font-medium truncate max-w-xs">
            {t('app.subtitle')}
          </span>
        </div>
      </div>

      {/* Right: Stats, Timer Status, Language Switcher */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        {/* Streak Counter */}
        <div
          className="flex items-center space-x-1.5 text-xs text-navy-700 bg-surface-50 px-2.5 py-1 rounded-md border border-surface-200"
          title={`${streak} ${t('dashboard.streak')}`}
        >
          <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-amber-500 fill-amber-500' : 'text-navy-400'}`} />
          <span className="font-semibold text-navy-800">{streak}</span>
          <span className="hidden sm:inline text-navy-500 text-2xs">{t('common.days')}</span>
        </div>

        {/* Progress Pill */}
        <div
          className="hidden sm:flex items-center space-x-1.5 text-xs text-navy-700 bg-surface-50 px-2.5 py-1 rounded-md border border-surface-200"
          title={`${overallPercent}% ${t('dashboard.overallProgress')}`}
        >
          <Award className="w-3.5 h-3.5 text-accent-600" />
          <span className="font-semibold text-navy-800">{overallPercent}%</span>
        </div>

        {/* Pomodoro Quick Indicator */}
        {isRunning && (
          <div className="flex items-center space-x-1.5 text-xs text-accent-800 bg-accent-50 px-2.5 py-1 rounded-md border border-accent-200 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-accent-600" />
            <span className="font-mono font-bold">{formatTimer(timeRemaining)}</span>
          </div>
        )}

        {/* Language Switcher */}
        <LanguageSwitcher />
      </div>
    </header>
  );
};
