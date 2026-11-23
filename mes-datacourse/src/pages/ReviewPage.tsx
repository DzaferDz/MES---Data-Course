import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { allReviewCards } from '@/content/review-cards';
import { useReviewStore } from '@/stores/review';
import { useProgressStore } from '@/stores/progress';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import type { RecallRating } from '@/types';
import {
  Repeat,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Brain,
  Award,
  RotateCcw,
} from 'lucide-react';

export const ReviewPage: React.FC = () => {
  const { t } = useTranslation();
  const { schedules, initCard, rateCard, getDueCards, getStats } = useReviewStore();
  const { logActivity } = useProgressStore();

  // Initialize cards if not already in store
  useEffect(() => {
    allReviewCards.forEach((c) => initCard(c.id));
  }, [initCard]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0);

  const dueCardIds = getDueCards();
  const currentCardId = dueCardIds[currentIndex];
  const currentCard = allReviewCards.find((c) => c.id === currentCardId);

  const stats = getStats();

  const handleRating = (rating: RecallRating) => {
    if (!currentCardId) return;
    rateCard(currentCardId, rating);
    logActivity('review');
    setSessionCompletedCount((c) => c + 1);
    setShowAnswer(false);
    // Don't necessarily increment if queue shrunk
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionCompletedCount(0);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-surface-200 pb-5">
        <h1 className="text-2xl font-black text-navy-950 tracking-tight flex items-center space-x-2">
          <Repeat className="w-6 h-6 text-accent-600" />
          <span>{t('review.title')}</span>
        </h1>
        <p className="text-xs text-navy-600 mt-1">
          {t('review.subtitle')} — Powered by the SM-2 spaced repetition algorithm
        </p>
      </div>

      {/* Spaced Repetition Stats Ribbon */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded-lg border border-surface-200 text-center">
          <span className="text-2xs text-navy-400 font-semibold uppercase tracking-wider block">
            {t('review.dueToday')}
          </span>
          <span className="text-xl font-black text-navy-900 block mt-0.5">
            {dueCardIds.length}
          </span>
        </div>

        <div className="p-3 bg-white rounded-lg border border-surface-200 text-center">
          <span className="text-2xs text-navy-400 font-semibold uppercase tracking-wider block">
            {t('review.learning')}
          </span>
          <span className="text-xl font-black text-blue-600 block mt-0.5">
            {stats.learning}
          </span>
        </div>

        <div className="p-3 bg-white rounded-lg border border-surface-200 text-center">
          <span className="text-2xs text-navy-400 font-semibold uppercase tracking-wider block">
            {t('review.mastered')}
          </span>
          <span className="text-xl font-black text-emerald-600 block mt-0.5">
            {stats.mastered}
          </span>
        </div>

        <div className="p-3 bg-white rounded-lg border border-surface-200 text-center">
          <span className="text-2xs text-navy-400 font-semibold uppercase tracking-wider block">
            {t('review.totalCards')}
          </span>
          <span className="text-xl font-black text-navy-900 block mt-0.5">
            {stats.total || allReviewCards.length}
          </span>
        </div>
      </div>

      {/* Main Flashcard / Active Recall Area */}
      {currentCard ? (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-2xs font-semibold text-navy-400 border-b border-surface-100 pb-3">
            <span className="uppercase tracking-wider">
              {currentCard.topic} • Phase {currentCard.phaseId}
            </span>
            <span>
              {dueCardIds.length} {t('review.cardsRemaining')}
            </span>
          </div>

          {/* Question Box */}
          <div className="py-4">
            <div className="text-2xs font-bold uppercase tracking-wider text-accent-700 mb-2">
              Question
            </div>
            <h2 className="text-base sm:text-lg font-bold text-navy-950 leading-relaxed font-sans">
              {currentCard.questionKey}
            </h2>
          </div>

          {/* Answer Box (Hidden until revealed) */}
          {showAnswer ? (
            <div className="pt-4 border-t border-surface-100 space-y-3 animate-fade-in">
              <div className="text-2xs font-bold uppercase tracking-wider text-emerald-700">
                Answer & Key Takeaway
              </div>
              <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 text-xs">
                <MarkdownRenderer content={currentCard.answerKey} />
              </div>

              {/* Recall Rating Buttons (SM-2) */}
              <div className="pt-4 space-y-2">
                <span className="text-2xs font-bold uppercase tracking-wider text-navy-500 block text-center">
                  {t('review.rateRecall')}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    onClick={() => handleRating('again')}
                    className="p-2.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors text-center"
                  >
                    {t('review.again')}
                  </button>
                  <button
                    onClick={() => handleRating('hard')}
                    className="p-2.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors text-center"
                  >
                    {t('review.hard')}
                  </button>
                  <button
                    onClick={() => handleRating('good')}
                    className="p-2.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors text-center"
                  >
                    {t('review.good')}
                  </button>
                  <button
                    onClick={() => handleRating('easy')}
                    className="p-2.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors text-center"
                  >
                    {t('review.easy')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-surface-100 text-center">
              <button
                onClick={() => setShowAnswer(true)}
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-xs"
              >
                {t('review.showAnswer')}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty / Complete State */
        <div className="bg-white rounded-2xl border border-surface-200 p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-navy-950">
            {sessionCompletedCount > 0 ? t('review.reviewComplete') : t('review.noCardsDue')}
          </h2>
          <p className="text-xs text-navy-600 max-w-md mx-auto leading-relaxed">
            All analytical concepts and memory benchmarks are up to date. Come back tomorrow or continue with your next
            practical lesson.
          </p>
          <div className="pt-2">
            <button
              onClick={handleRestart}
              className="text-xs font-semibold text-navy-600 hover:text-navy-900 border border-surface-200 px-3 py-1.5 rounded-lg inline-flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice All Flashcards Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
