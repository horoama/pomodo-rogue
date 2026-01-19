import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { ja, en } from './translations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'settings_language';

const resources = {
  ja,
  en,
};

// Detect device language or fallback to 'ja'
const deviceLanguage = getLocales()[0]?.languageCode ?? 'ja';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage, // Default to device language initially
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3', // For Android compatibility
  } as any);

// Load saved language preference
export const loadLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Failed to load language', error);
  }
};

// Save language preference
export const setLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    i18n.changeLanguage(language);
  } catch (error) {
    console.error('Failed to save language', error);
  }
};

export default i18n;
