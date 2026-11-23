import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/translation.json';
import de from './de/translation.json';
import bhs from './bhs/translation.json';

const savedLang = localStorage.getItem('mes_lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    bhs: { translation: bhs },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('mes_lang', lng);
});

export default i18n;
