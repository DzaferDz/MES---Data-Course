import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settings';
import { usePomodoroStore } from '@/stores/pomodoro';
import { useProgressStore } from '@/stores/progress';
import type { Language } from '@/types';
import {
  Settings,
  Globe,
  Sun,
  Moon,
  Timer,
  Download,
  Upload,
  AlertTriangle,
  Check,
  Info,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, theme, setTheme } = useSettingsStore();
  const { config, setConfig } = usePomodoroStore();
  const { resetAll, exportBackup, importBackup } = useProgressStore();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [focusInput, setFocusInput] = useState(config.focusMinutes);
  const [shortBreakInput, setShortBreakInput] = useState(config.shortBreakMinutes);
  const [longBreakInput, setLongBreakInput] = useState(config.longBreakMinutes);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleSaveTimer = () => {
    setConfig({
      focusMinutes: Number(focusInput),
      shortBreakMinutes: Number(shortBreakInput),
      longBreakMinutes: Number(longBreakInput),
    });
  };

  const handleExport = () => {
    const data = exportBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mes-datacourse-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackup(content);
      if (success) {
        setImportStatus('Backup imported successfully!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm(t('settings.resetConfirm'))) {
      resetAll();
      alert('All progress has been reset.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-surface-200 pb-5">
        <h1 className="text-2xl font-black text-navy-950 tracking-tight flex items-center space-x-2">
          <Settings className="w-6 h-6 text-accent-600" />
          <span>{t('settings.title')}</span>
        </h1>
        <p className="text-xs text-navy-600 mt-1">{t('settings.subtitle')}</p>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-navy-950">
          <Globe className="w-4 h-4 text-accent-600" />
          <span>{t('settings.language')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { code: 'en', label: 'English', desc: 'Default language' },
            { code: 'de', label: 'Deutsch', desc: 'Vollständige Übersetzung' },
            { code: 'bhs', label: 'Bosanski / Hrvatski / Srpski', desc: 'Potpuni prevod' },
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => handleLanguageChange(l.code as Language)}
              className={`p-4 rounded-xl border text-left transition-all ${
                language === l.code
                  ? 'border-navy-900 bg-navy-50/50 shadow-xs'
                  : 'border-surface-200 hover:border-surface-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-navy-950 text-xs">{l.label}</span>
                {language === l.code && <Check className="w-4 h-4 text-navy-900" />}
              </div>
              <p className="text-2xs text-navy-500 mt-1">{l.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Appearance Theme */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-navy-950">
          <Sun className="w-4 h-4 text-accent-600" />
          <span>{t('settings.theme')}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-lg border text-xs font-semibold flex items-center space-x-2 transition-all ${
              theme === 'light'
                ? 'border-navy-900 bg-navy-50/50 text-navy-950 shadow-xs'
                : 'border-surface-200 text-navy-600 hover:bg-surface-50'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{t('settings.light')}</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-lg border text-xs font-semibold flex items-center space-x-2 transition-all ${
              theme === 'dark'
                ? 'border-navy-900 bg-navy-50/50 text-navy-950 shadow-xs'
                : 'border-surface-200 text-navy-600 hover:bg-surface-50'
            }`}
          >
            <Moon className="w-4 h-4 text-navy-700" />
            <span>{t('settings.dark')}</span>
          </button>
        </div>
      </div>

      {/* Focus Timer Configuration */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-navy-950">
          <Timer className="w-4 h-4 text-accent-600" />
          <span>{t('settings.pomodoro')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-2xs font-semibold text-navy-600 mb-1">
              {t('settings.focusDuration')}
            </label>
            <input
              type="number"
              min={10}
              max={60}
              value={focusInput}
              onChange={(e) => setFocusInput(Number(e.target.value))}
              className="w-full p-2 bg-surface-50 border border-surface-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold text-navy-600 mb-1">
              {t('settings.shortBreakDuration')}
            </label>
            <input
              type="number"
              min={2}
              max={15}
              value={shortBreakInput}
              onChange={(e) => setShortBreakInput(Number(e.target.value))}
              className="w-full p-2 bg-surface-50 border border-surface-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold text-navy-600 mb-1">
              {t('settings.longBreakDuration')}
            </label>
            <input
              type="number"
              min={10}
              max={30}
              value={longBreakInput}
              onChange={(e) => setLongBreakInput(Number(e.target.value))}
              className="w-full p-2 bg-surface-50 border border-surface-200 rounded-lg text-xs"
            />
          </div>
        </div>

        <button
          onClick={handleSaveTimer}
          className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-4 py-2 rounded-lg"
        >
          {t('common.save')}
        </button>
      </div>

      {/* Backup & Persistence */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-navy-950">
          <Download className="w-4 h-4 text-accent-600" />
          <span>Data Storage & Portability</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="bg-surface-100 hover:bg-surface-200 text-navy-800 font-semibold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 border border-surface-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('settings.exportData')}</span>
          </button>

          <label className="bg-surface-100 hover:bg-surface-200 text-navy-800 font-semibold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 border border-surface-200 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>{t('settings.importData')}</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>

        {importStatus && <div className="text-xs font-semibold text-accent-700">{importStatus}</div>}
      </div>

      {/* Danger Zone: Reset */}
      <div className="bg-rose-50/40 rounded-xl border border-rose-200 p-6 space-y-3 text-xs">
        <div className="flex items-center space-x-2 font-bold text-rose-900">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{t('settings.resetProgress')}</span>
        </div>
        <p className="text-rose-700 leading-relaxed">{t('settings.resetWarning')}</p>
        <button
          onClick={handleReset}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-lg"
        >
          {t('settings.resetProgress')}
        </button>
      </div>

      {/* About Box */}
      <div className="bg-surface-50 rounded-xl border border-surface-200 p-6 space-y-2 text-xs text-navy-600">
        <div className="flex items-center space-x-2 font-bold text-navy-900">
          <Info className="w-4 h-4 text-accent-600" />
          <span>{t('settings.about')}</span>
        </div>
        <p className="leading-relaxed">{t('settings.aboutDesc')}</p>
        <p className="text-2xs text-navy-400 font-mono pt-2">
          MES-DataCourse v1.0.0 • React + Vite + TypeScript + Tailwind • Infranode Open API Telemetry
        </p>
      </div>
    </div>
  );
};
