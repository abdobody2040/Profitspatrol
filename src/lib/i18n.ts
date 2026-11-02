
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "../locales/en";
import { ar } from "../locales/ar";
import { es } from "../locales/es";
import { fr } from "../locales/fr";
import { de } from "../locales/de";
import { resources as arcadeResources } from "../features/games/locales/sourceResources";

// Read the app's own language preference from localStorage (key = 'app_language').
// We do NOT use the browser's navigator.language to avoid picking up the
// user's OS locale (e.g. French) instead of the app's chosen language.
const SUPPORTED_LANGS = ['en', 'ar', 'es', 'fr', 'de'];
const storedLang = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.getItem === 'function'
  ? window.localStorage.getItem('app_language')
  : null;
const initialLang = storedLang && SUPPORTED_LANGS.includes(storedLang) ? storedLang : 'ar';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      ar: ar,
      es: es,
      fr: fr,
      de: de
    },
    lng: initialLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

// Register integrated arcade games resources across all supported languages
const arcadeRes = arcadeResources as Record<string, any>;
SUPPORTED_LANGS.forEach((lng) => {
  if (arcadeRes[lng]?.translation) {
    i18n.addResourceBundle(lng, 'translation', arcadeRes[lng].translation, true, true);
  }
});

i18n.on('languageChanged', (lng) => {
  document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  // Persist the user's chosen language in our own key (not the i18next default 'i18nextLng')
  localStorage.setItem('app_language', lng);
});

export default i18n;
