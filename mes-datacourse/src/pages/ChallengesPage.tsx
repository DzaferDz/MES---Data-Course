import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { allChallenges } from '@/content/challenges';
import { useProgressStore } from '@/stores/progress';
import { CodeBlockWithCopy } from '@/components/ui/MarkdownRenderer';
import {
  Zap,
  CheckCircle2,
  Circle,
  HelpCircle,
  Eye,
  EyeOff,
  Filter,
  Terminal,
  Database,
  FileSpreadsheet,
  PieChart,
} from 'lucide-react';

export const ChallengesPage: React.FC = () => {
  const { t } = useTranslation();
  const { challengesCompleted, toggleChallenge } = useProgressStore();

  const [toolFilter, setToolFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [openChallengeId, setOpenChallengeId] = useState<string | null>(allChallenges[0]?.id || null);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  const toggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHints = (id: string) => {
    setRevealedHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredChallenges = allChallenges.filter((ch) => {
    if (toolFilter !== 'all' && ch.tool !== toolFilter) return false;
    if (difficultyFilter !== 'all' && ch.difficulty !== difficultyFilter) return false;
    return true;
  });

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'python':
        return <Terminal className="w-3.5 h-3.5 text-emerald-600" />;
      case 'sql':
        return <Database className="w-3.5 h-3.5 text-blue-600" />;
      case 'excel':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />;
      case 'powerbi':
        return <PieChart className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-accent-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight flex items-center space-x-2">
            <Zap className="w-6 h-6 text-accent-600" />
            <span>{t('challenges.title')}</span>
          </h1>
          <p className="text-xs text-navy-600 mt-1">
            {t('challenges.subtitle')} — Independent technical hurdles to test and cement your competence
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Tool Filter */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-surface-200">
            {['all', 'python', 'sql', 'excel', 'powerbi'].map((tool) => (
              <button
                key={tool}
                onClick={() => setToolFilter(tool)}
                className={`px-2 py-1 rounded text-2xs font-semibold capitalize transition-colors ${
                  toolFilter === tool
                    ? 'bg-navy-900 text-white'
                    : 'text-navy-600 hover:bg-surface-100'
                }`}
              >
                {tool}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-surface-200">
            {['all', 'beginner', 'intermediate', 'advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2 py-1 rounded text-2xs font-semibold capitalize transition-colors ${
                  difficultyFilter === diff
                    ? 'bg-navy-900 text-white'
                    : 'text-navy-600 hover:bg-surface-100'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {filteredChallenges.map((ch) => {
          const isDone = challengesCompleted.includes(ch.id);
          const isOpen = openChallengeId === ch.id;
          const isSolRevealed = !!revealedSolutions[ch.id];
          const isHintRevealed = !!revealedHints[ch.id];

          return (
            <div
              key={ch.id}
              className={`bg-white rounded-xl border transition-all overflow-hidden ${
                isOpen ? 'border-navy-400 shadow-xs' : 'border-surface-200 shadow-2xs hover:border-surface-300'
              }`}
            >
              {/* Challenge Card Header */}
              <div
                onClick={() => setOpenChallengeId(isOpen ? null : ch.id)}
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-surface-50/60 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChallenge(ch.id);
                    }}
                    className="p-0.5 text-navy-400 hover:text-navy-700 transition-colors"
                    title={isDone ? t('challenges.solved') : t('challenges.markDone')}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-navy-300" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-navy-950 text-sm">
                        {ch.titleKey}
                      </span>
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-2xs font-semibold uppercase bg-surface-100 text-navy-700">
                        {getToolIcon(ch.tool)}
                        <span>{ch.tool}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-2xs font-semibold uppercase ${
                          ch.difficulty === 'beginner'
                            ? 'bg-emerald-50 text-emerald-800'
                            : ch.difficulty === 'intermediate'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {ch.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-2xs text-navy-500 font-medium hidden sm:inline">
                    Phase {ch.phaseId}
                  </span>
                  <span className="text-xs font-semibold text-accent-600">
                    {isOpen ? 'Close' : 'Open'}
                  </span>
                </div>
              </div>

              {/* Challenge Expanded Body */}
              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-surface-100 space-y-4 text-xs">
                  {/* Task Description */}
                  <div>
                    <h4 className="text-2xs font-bold uppercase tracking-wider text-navy-500 mb-1">
                      {t('challenges.task')}
                    </h4>
                    <p className="text-navy-800 leading-relaxed font-sans">{ch.descriptionKey}</p>
                  </div>

                  {/* Expected Output */}
                  <div className="p-3 bg-surface-50 rounded-lg border border-surface-200">
                    <h4 className="text-2xs font-bold uppercase tracking-wider text-navy-600 mb-1">
                      {t('challenges.expectedResult')}
                    </h4>
                    <p className="text-navy-700 font-sans">{ch.expectedOutputKey}</p>
                  </div>

                  {/* Hints */}
                  <div>
                    <button
                      onClick={() => toggleHints(ch.id)}
                      className="text-2xs font-semibold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isHintRevealed ? 'Hide Hints' : 'Need a Hint?'}</span>
                    </button>
                    {isHintRevealed && (
                      <ul className="mt-2 pl-4 list-disc space-y-1 text-2xs text-navy-600 bg-amber-50/60 p-3 rounded-lg border border-amber-200/60">
                        {ch.hintsKeys.map((hint, i) => (
                          <li key={i}>{hint}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Solution Reveal */}
                  <div>
                    <button
                      onClick={() => toggleSolution(ch.id)}
                      className="px-3 py-1.5 rounded text-2xs font-semibold bg-surface-100 hover:bg-surface-200 text-navy-800 flex items-center space-x-1.5 transition-colors"
                    >
                      {isSolRevealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>{t('challenges.hideSolution')}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('challenges.showSolution')}</span>
                        </>
                      )}
                    </button>

                    {isSolRevealed && (
                      <div className="mt-3">
                        <CodeBlockWithCopy code={ch.solutionKey} language={ch.tool} />
                      </div>
                    )}
                  </div>

                  {/* Completion Action */}
                  <div className="pt-2 border-t border-surface-100 flex items-center justify-between">
                    <button
                      onClick={() => toggleChallenge(ch.id)}
                      className={`px-3 py-1.5 rounded-lg text-2xs font-bold flex items-center space-x-1.5 transition-colors ${
                        isDone
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-navy-900 text-white hover:bg-navy-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isDone ? t('challenges.solved') : t('challenges.markDone')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
