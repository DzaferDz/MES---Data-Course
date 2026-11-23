import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLessonById, getNextLessonId, getPreviousLessonId } from '@/content/phases';
import { useProgressStore } from '@/stores/progress';
import { useNotesStore } from '@/stores/notes';
import { MarkdownRenderer, CodeBlockWithCopy } from '@/components/ui/MarkdownRenderer';
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  HelpCircle,
  FileCode,
  BookOpen,
  Send,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const lessonData = id ? getLessonById(id) : undefined;
  const { lessons, setLessonStatus } = useProgressStore();
  const { notes, addNote } = useNotesStore();

  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!lessonData) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="text-xl font-bold text-navy-950">Lesson not found</h2>
        <Link to="/learning-path" className="text-accent-600 font-semibold underline text-xs">
          Return to Learning Path
        </Link>
      </div>
    );
  }

  const { lesson, phase } = lessonData;
  const status = lessons[lesson.id]?.status || 'not_started';
  const isCompleted = status === 'completed';

  const nextId = getNextLessonId(lesson.id);
  const prevId = getPreviousLessonId(lesson.id);

  const lessonNotes = notes.filter((n) => n.lessonId === lesson.id);

  const handleToggleComplete = () => {
    const nextStatus = isCompleted ? 'not_started' : 'completed';
    setLessonStatus(lesson.id, nextStatus);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNote({
      title: `${lesson.id} Note`,
      content: newNoteText.trim(),
      tags: [`Phase ${phase.id}`, `Lesson ${lesson.id}`],
      lessonId: lesson.id,
      phaseId: phase.id,
    });
    setNewNoteText('');
  };

  const toggleChecklist = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-28">
      {/* Top Breadcrumb & Next/Prev Controls */}
      <div className="flex items-center justify-between border-b border-surface-200 pb-3 text-xs">
        <div className="flex items-center space-x-2 text-navy-500">
          <Link to="/learning-path" className="hover:text-navy-900 transition-colors font-medium">
            {t('nav.learningPath')}
          </Link>
          <span className="text-surface-300">/</span>
          <span className="font-medium text-navy-600">Phase {phase.id}</span>
          <span className="text-surface-300">/</span>
          <span className="text-navy-950 font-bold">Lesson {lesson.id}</span>
        </div>

        <div className="flex items-center space-x-2">
          {prevId && (
            <button
              onClick={() => navigate(`/lessons/${prevId}`)}
              className="px-2.5 py-1 text-2xs font-semibold rounded-md bg-white border border-surface-200 hover:bg-surface-100 text-navy-700 flex items-center space-x-1 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Prev</span>
            </button>
          )}
          {nextId && (
            <button
              onClick={() => navigate(`/lessons/${nextId}`)}
              className="px-2.5 py-1 text-2xs font-semibold rounded-md bg-white border border-surface-200 hover:bg-surface-100 text-navy-700 flex items-center space-x-1 transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Lesson Hero Header */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-navy-900 text-accent-300">
              Phase {phase.id} • {t(`phases.phase${phase.id}.shortTitle` as any)}
            </span>
            <span className="flex items-center space-x-1 text-2xs text-navy-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-navy-400" />
              <span>{lesson.estimatedMinutes} {t('common.minutes')}</span>
            </span>
          </div>

          {/* Mark Complete CTA Button */}
          <button
            onClick={handleToggleComplete}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all shadow-xs cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-navy-900 hover:bg-navy-800 text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('lesson.completed')}</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-navy-400" />
                <span>{t('lesson.markComplete')}</span>
              </>
            )}
          </button>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight leading-snug">
          {lesson.titleKey}
        </h1>

        {lesson.deliverable && (
          <div className="p-3.5 bg-accent-50/60 rounded-xl border border-accent-200/70 text-xs flex items-center space-x-2.5 text-navy-800">
            <Sparkles className="w-4 h-4 text-accent-700 shrink-0" />
            <div>
              <span className="font-bold text-navy-950">{t('lesson.deliverable')}: </span>
              <span className="text-navy-700 font-sans">{lesson.deliverable}</span>
            </div>
          </div>
        )}
      </div>

      {/* 1. Learning Objectives */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 sm:p-7 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-navy-400 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-accent-600" />
          <span>{t('lesson.objectives')}</span>
        </h2>
        <ul className="space-y-2 text-xs text-navy-800">
          {lesson.objectives.map((obj, i) => (
            <li key={i} className="flex items-start space-x-3 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-600 mt-2 shrink-0" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 2-7. Main Lesson Sections */}
      {lesson.sections.map((sec, idx) => {
        // Section: Theory or Info
        if (sec.type === 'theory' || sec.type === 'info') {
          return (
            <div key={idx} className="bg-white rounded-xl border border-surface-200 p-6 sm:p-7 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-navy-950 border-b border-surface-100 pb-3">
                {sec.titleKey}
              </h2>
              <div className="lesson-body text-navy-800 text-xs sm:text-sm leading-relaxed">
                <MarkdownRenderer content={sec.contentKey} />
              </div>
            </div>
          );
        }

        // Section: Practical Exercise (External Workflow Notice)
        if (sec.type === 'exercise') {
          return (
            <div key={idx} className="bg-white rounded-xl border-2 border-navy-800 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-surface-100 pb-3">
                <h2 className="text-base font-bold text-navy-950 flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-accent-600" />
                  <span>{sec.titleKey}</span>
                </h2>
                <span className="px-2.5 py-1 rounded text-2xs font-semibold bg-navy-100 text-navy-800 flex items-center space-x-1">
                  <ExternalLink className="w-3 h-3 text-navy-600" />
                  <span>{t('lesson.openInVSCode')}</span>
                </span>
              </div>
              <div className="text-xs sm:text-sm text-navy-800 leading-relaxed">
                <MarkdownRenderer content={sec.contentKey} />
              </div>
            </div>
          );
        }

        // Section: Expected Output
        if (sec.type === 'expectedOutput') {
          return (
            <div key={idx} className="bg-surface-50 rounded-xl border border-surface-200 p-6 space-y-3">
              <h2 className="text-2xs font-bold uppercase tracking-wider text-navy-500">
                {t('lesson.expectedOutput')}
              </h2>
              <div className="text-xs text-navy-800 leading-relaxed">
                <MarkdownRenderer content={sec.contentKey} />
              </div>
            </div>
          );
        }

        // Section: Hints (Collapsible)
        if (sec.type === 'hints') {
          return (
            <div key={idx} className="bg-white rounded-xl border border-surface-200 p-5 shadow-2xs">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full flex items-center justify-between text-left text-xs font-bold text-navy-900 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>{sec.titleKey}</span>
                </div>
                <div className="flex items-center space-x-1 text-2xs font-semibold text-accent-700">
                  <span>{showHints ? t('lesson.hideHints') : t('lesson.showHints')}</span>
                  {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>
              {showHints && (
                <div className="mt-4 pt-3 border-t border-surface-100 text-xs text-navy-800">
                  <MarkdownRenderer content={sec.contentKey} />
                </div>
              )}
            </div>
          );
        }

        // Section: Reference Solution (Collapsible with Code Block)
        if (sec.type === 'solution') {
          return (
            <div key={idx} className="bg-white rounded-xl border border-surface-200 p-5 shadow-2xs">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="w-full flex items-center justify-between text-left text-xs font-bold text-navy-950 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-emerald-600" />
                  <span>{sec.titleKey}</span>
                </div>
                <div className="flex items-center space-x-1 text-2xs font-semibold text-accent-700">
                  {showSolution ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{t('lesson.hideSolution')}</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('lesson.showSolution')}</span>
                    </>
                  )}
                </div>
              </button>
              {showSolution && (
                <div className="mt-4 pt-3 border-t border-surface-100 text-xs">
                  <MarkdownRenderer content={sec.contentKey} />
                </div>
              )}
            </div>
          );
        }

        // Section: Reflection Questions
        if (sec.type === 'reflection') {
          return (
            <div key={idx} className="bg-accent-50/40 rounded-xl border border-accent-200/80 p-6 space-y-3">
              <h2 className="text-2xs font-bold uppercase tracking-wider text-accent-800">
                {t('lesson.reflection')}
              </h2>
              <div className="text-xs text-navy-800 leading-relaxed">
                <MarkdownRenderer content={sec.contentKey} />
              </div>
            </div>
          );
        }

        // Section: Checklist
        if (sec.type === 'checklist' && sec.checklistItems) {
          return (
            <div key={idx} className="bg-white rounded-xl border border-surface-200 p-6 shadow-2xs space-y-3">
              <h2 className="text-2xs font-bold uppercase tracking-wider text-navy-400">
                {t('lesson.checklist')}
              </h2>
              <div className="space-y-2 text-xs">
                {sec.checklistItems.map((item, cIdx) => (
                  <label
                    key={cIdx}
                    onClick={() => toggleChecklist(item)}
                    className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item]}
                      onChange={() => {}}
                      className="rounded border-surface-300 text-accent-600 focus:ring-accent-500 h-4 w-4"
                    />
                    <span className={checkedItems[item] ? 'line-through text-navy-400 font-sans' : 'text-navy-800 font-sans'}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}

      {/* In-Lesson Notes Dock */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-navy-500 flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-navy-600" />
            <span>{t('lesson.notesForThisLesson')}</span>
          </h2>
          <span className="text-2xs text-navy-400">{lessonNotes.length} recorded</span>
        </div>

        {lessonNotes.length > 0 && (
          <div className="space-y-2">
            {lessonNotes.map((n) => (
              <div key={n.id} className="p-3.5 bg-surface-50 rounded-lg border border-surface-200 text-xs">
                <MarkdownRenderer content={n.content} />
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddNote} className="flex gap-2">
          <input
            type="text"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder={t('lesson.addNotePrompt')}
            className="flex-1 bg-surface-50 border border-surface-200 rounded-lg px-3 py-2 text-xs text-navy-900 focus:outline-hidden focus:border-accent-500"
          />
          <button
            type="submit"
            className="bg-navy-900 hover:bg-navy-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-200">
        <div>
          {prevId ? (
            <Link
              to={`/lessons/${prevId}`}
              className="text-xs font-semibold text-navy-600 hover:text-navy-950 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Lesson {prevId}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <button
          onClick={handleToggleComplete}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all shadow-xs cursor-pointer ${
            isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-navy-900 hover:bg-navy-800 text-white'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('lesson.markIncomplete')}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('lesson.markComplete')}</span>
            </>
          )}
        </button>

        <div>
          {nextId ? (
            <Link
              to={`/lessons/${nextId}`}
              className="text-xs font-semibold text-navy-900 hover:text-navy-950 flex items-center space-x-1"
            >
              <span>Lesson {nextId}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link to="/project" className="text-xs font-bold text-accent-700 hover:text-accent-800">
              Complete Project →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
