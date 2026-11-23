import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Map,
  Briefcase,
  Zap,
  Repeat,
  BookOpen,
  BarChart3,
  Settings,
  ChevronRight,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { useReviewStore } from '@/stores/review';
import { useProgressStore } from '@/stores/progress';
import { useSettingsStore } from '@/stores/settings';
import { allPhases } from '@/content/phases';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { getDueCards } = useReviewStore();
  const { lessons, getPhaseProgress } = useProgressStore();
  const { sidebarCollapsed, toggleSidebar } = useSettingsStore();

  const dueCardsCount = getDueCards().length;

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/learning-path', icon: Map, label: t('nav.learningPath') },
    { to: '/project', icon: Briefcase, label: t('nav.project') },
    { to: '/challenges', icon: Zap, label: t('nav.challenges') },
    {
      to: '/review',
      icon: Repeat,
      label: t('nav.review'),
      badge: dueCardsCount > 0 ? dueCardsCount : undefined,
    },
    { to: '/notes', icon: BookOpen, label: t('nav.notes') },
    { to: '/progress', icon: BarChart3, label: t('nav.progress') },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {!sidebarCollapsed && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-35 bg-navy-950/40 backdrop-blur-2xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-surface-200 flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 flex items-center px-5 border-b border-surface-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy-900 text-accent-400 flex items-center justify-center font-black text-sm tracking-tighter shadow-xs">
              MES
            </div>
            <div>
              <span className="font-bold text-navy-950 tracking-tight text-sm block leading-none">
                DataCourse
              </span>
              <span className="text-2xs text-navy-500 uppercase tracking-widest font-semibold block mt-0.5">
                Germany ÖPNV
              </span>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-navy-900 text-white font-semibold shadow-xs'
                        : 'text-navy-700 hover:text-navy-950 hover:bg-surface-100'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 opacity-80" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-accent-500 text-navy-950 text-2xs font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Curriculum Phases Accordion / Quick Access */}
          <div className="pt-2 border-t border-surface-200">
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-navy-400">
                {t('dashboard.phasesOverview')}
              </span>
              <span className="text-2xs text-navy-400">8 Phases</span>
            </div>

            <div className="space-y-0.5">
              {allPhases.map((phase) => {
                const { completed, total, percent } = getPhaseProgress(phase.id, phase.lessons.length);
                const isFullyComplete = completed === total && total > 0;

                return (
                  <NavLink
                    key={phase.id}
                    to={`/learning-path#phase-${phase.id}`}
                    className="flex items-center justify-between px-3 py-1.5 rounded-md text-2xs text-navy-600 hover:text-navy-950 hover:bg-surface-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      {isFullyComplete ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-navy-300 shrink-0 group-hover:text-navy-400" />
                      )}
                      <span className="truncate font-medium">
                        {phase.id}. {t(`phases.phase${phase.id}.shortTitle` as any)}
                      </span>
                    </div>
                    <span className="text-2xs text-navy-400 shrink-0 ml-1 font-mono">
                      {percent}%
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-surface-200 bg-surface-50 text-2xs text-navy-500 flex items-center justify-between">
          <span>Infranode Live Data</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-2xs font-medium bg-emerald-100 text-emerald-800">
            ● Active
          </span>
        </div>
      </aside>
    </>
  );
};
