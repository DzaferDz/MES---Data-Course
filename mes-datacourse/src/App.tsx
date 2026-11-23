import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { PomodoroWidget } from '@/components/pomodoro/PomodoroWidget';

import { DashboardPage } from '@/pages/DashboardPage';
import { LearningPathPage } from '@/pages/LearningPathPage';
import { LessonDetailPage } from '@/pages/LessonDetailPage';
import { MainProjectPage } from '@/pages/MainProjectPage';
import { ChallengesPage } from '@/pages/ChallengesPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { NotesPage } from '@/pages/NotesPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface-50 text-navy-900 flex flex-col antialiased">
        {/* Top Sticky Header */}
        <Header />

        <div className="flex-1 flex">
          {/* Collapsible Left Navigation Sidebar */}
          <Sidebar />

          {/* Main Workspace Area (offset by sidebar width on desktop) */}
          <main className="flex-1 lg:pl-64 min-w-0 flex flex-col">
            <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/learning-path" element={<LearningPathPage />} />
                <Route path="/lessons/:id" element={<LessonDetailPage />} />
                <Route path="/project" element={<MainProjectPage />} />
                <Route path="/challenges" element={<ChallengesPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<DashboardPage />} />
              </Routes>
            </div>
          </main>
        </div>

        {/* Floating Focus Pomodoro Timer */}
        <PomodoroWidget />
      </div>
    </BrowserRouter>
  );
};

export default App;
