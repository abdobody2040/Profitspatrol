
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { en } from "../locales/en";
import { ar } from "../locales/ar";
import { es } from "../locales/es";
import { fr } from "../locales/fr";
import { de } from "../locales/de";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      ar: ar,
      es: es,
      fr: fr,
      de: de
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already safes from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

i18n.on('languageChanged', (lng) => {
  document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
