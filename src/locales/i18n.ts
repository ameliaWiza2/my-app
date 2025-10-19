import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './translations/en.json';
import es from './translations/es.json';
import fr from './translations/fr.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
};

const getDeviceLanguage = (): string => {
  const locales = RNLocalize.getLocales();
  if (locales.length > 0) {
    const languageCode = locales[0].languageCode;
    return Object.keys(resources).includes(languageCode) ? languageCode : 'en';
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  compatibilityJSON: 'v3',
});

RNLocalize.addEventListener('change', () => {
  const newLanguage = getDeviceLanguage();
  i18n.changeLanguage(newLanguage);
});

export default i18n;
