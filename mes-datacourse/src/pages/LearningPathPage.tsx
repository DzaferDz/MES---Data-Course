import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { allPhases } from '@/content/phases';
import { useProgressStore } from '@/stores/progress';
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Filter,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const LearningPathPage: React.FC = () => {
  const { t } = useTranslation();
  const { lessons, getPhaseProgress } = useProgressStore();
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | 'all'>('all');
  const [collapsedPhases, setCollapsedPhases] = useState<Record<number, boolean>>({});

  const toggleCollapse = (phaseId: number) => {
    setCollapsedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const filteredPhases =
    selectedPhaseFilter === 'all'
      ? allPhases
      : allPhases.filter((p) => p.id === selectedPhaseFilter);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">
            {t('nav.learningPath')}
          </h1>
          <p className="text-xs text-navy-600 mt-1">
            Structured 8-phase technical journey from raw Infranode data to Machine Learning
          </p>
        </div>

        {/* Phase Filter Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedPhaseFilter('all')}
            className={`px-2.5 py-1 rounded-md font-semibold text-2xs transition-colors ${
              selectedPhaseFilter === 'all'
                ? 'bg-navy-900 text-white shadow-2xs'
                : 'bg-white text-navy-600 hover:bg-surface-100 border border-surface-200'
            }`}
          >
            {t('challenges.all')}
          </button>
          {allPhases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhaseFilter(phase.id)}
              className={`px-2.5 py-1 rounded-md font-semibold text-2xs transition-colors shrink-0 ${
                selectedPhaseFilter === phase.id
                  ? 'bg-navy-900 text-white shadow-2xs'
                  : 'bg-white text-navy-600 hover:bg-surface-100 border border-surface-200'
              }`}
            >
              Phase {phase.id}
            </button>
          ))}
        </div>
      </div>

      {/* Phases List */}
      <div className="space-y-6">
        {filteredPhases.map((phase) => {
          const { completed, total, percent } = getPhaseProgress(phase.id, phase.lessons.length);
          const isCollapsed = !!collapsedPhases[phase.id];

          return (
            <div
              key={phase.id}
              id={`phase-${phase.id}`}
              className="bg-white rounded-xl border border-surface-200 shadow-2xs overflow-hidden transition-all"
            >
              {/* Phase Header Banner */}
              <div
                onClick={() => toggleCollapse(phase.id)}
                className="p-5 cursor-pointer hover:bg-surface-50/80 transition-colors flex items-center justify-between border-b border-surface-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-9 h-9 rounded-lg bg-navy-900 text-accent-400 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    {phase.id}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-navy-950">
                      {t(`phases.phase${phase.id}.title` as any)}
                    </h2>
                    <p className="text-xs text-navy-500 mt-0.5 leading-relaxed">
                      {t(`phases.phase${phase.id}.description` as any)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-navy-900 block font-mono">
                      {completed}/{total}
                    </span>
                    <span className="text-2xs text-navy-400 block">
                      {percent}% completed
                    </span>
                  </div>
                  <button className="text-navy-400 hover:text-navy-700 p-1">
                    {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Lessons List inside Phase */}
              {!isCollapsed && (
                <div className="divide-y divide-surface-100">
                  {phase.lessons.map((lesson) => {
                    const status = lessons[lesson.id]?.status || 'not_started';
                    const isDone = status === 'completed';

                    return (
                      <div
                        key={lesson.id}
                        className="p-4 sm:px-6 hover:bg-surface-50/60 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div className="flex items-start space-x-3.5">
                          <div className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Circle className="w-4 h-4 text-navy-300" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-navy-900">
                                {lesson.titleKey}
                              </span>
                              {lesson.deliverable && (
                                <span className="hidden md:inline-flex items-center space-x-1 text-2xs px-2 py-0.5 bg-surface-100 text-navy-600 rounded">
                                  <FileText className="w-2.5 h-2.5 text-accent-600" />
                                  <span className="truncate max-w-xs">{lesson.deliverable}</span>
                                </span>
                              )}
                            </div>

                            {/* Lesson Objectives preview */}
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-2xs text-navy-500">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-navy-400" />
                                <span>{lesson.estimatedMinutes} {t('common.minutes')}</span>
                              </span>
                              <span className="truncate max-w-md">
                                • {lesson.objectives[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action CTA */}
                        <div className="shrink-0 flex items-center space-x-3 self-end sm:self-center">
                          {isDone ? (
                            <span className="text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                              {t('lesson.completed')}
                            </span>
                          ) : null}
                          <Link
                            to={`/lessons/${lesson.id}`}
                            className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
                          >
                            <span>{isDone ? 'Review' : 'Start'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
