import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import en from "./en/en.json";
import ar from "./ar/ar.json";

i18n
  .use(initReactI18next) 
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
        resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    supportedLngs: ['en', 'ar'],
    fallbackLng: "en",
    detection : {
      order: ['htmlTag','querystring', 'hash', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'path', 'subdomain'],
      caches: ['cookie']
    },
    backend:{
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
     interpolation: {
      escapeValue: false,
    }
  });

export default i18n;