import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settings';
import type { Language } from '@/types';
import { Globe } from 'lucide-react';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'de', label: 'Deutsch', flag: 'DE' },
  { code: 'bhs', label: 'BHS', flag: 'BHS' },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useSettingsStore();

  const handleSelect = (code: Language) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <div className="flex items-center space-x-1 bg-surface-100 p-1 rounded-lg border border-surface-200 text-xs font-medium">
      <Globe className="w-3.5 h-3.5 text-navy-500 ml-1 mr-0.5" />
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => handleSelect(l.code)}
          className={`px-2 py-1 rounded transition-colors ${
            language === l.code
              ? 'bg-white text-navy-900 font-semibold shadow-xs border border-surface-200'
              : 'text-navy-600 hover:text-navy-900 hover:bg-surface-200/60'
          }`}
          title={l.label}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
};
