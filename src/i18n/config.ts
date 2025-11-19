import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import esTranslations from './locales/es/translation.json'
import enTranslations from './locales/en/translation.json'
import koTranslations from './locales/ko/translation.json'

const savedLanguage = localStorage.getItem('client-language') || 'es'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: esTranslations,
      },
      en: {
        translation: enTranslations,
      },
      ko: {
        translation: koTranslations,
      },
    },
    lng: savedLanguage,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

