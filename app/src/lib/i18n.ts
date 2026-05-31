/**
 * Lightweight i18n: client-side translation hook
 * No routing changes. Just localStorage + context.
 */

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import zhMessages from '../../messages/zh.json';
import hiMessages from '../../messages/hi.json';
import arMessages from '../../messages/ar.json';

export type Language = 'en' | 'es' | 'zh' | 'hi' | 'ar';

export const LANGUAGES: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  hi: 'हिन्दी',
  ar: 'العربية'
};

const messages: Record<Language, typeof enMessages> = {
  en: enMessages,
  es: esMessages,
  zh: zhMessages,
  hi: hiMessages,
  ar: arMessages
};

/**
 * Get nested value from object using dot notation
 * e.g., "buttons.save" → messages.buttons.save
 */
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((curr, prop) => curr?.[prop], obj) || path;
}

export function getMessages(language: Language) {
  return messages[language] || messages.en;
}

export function t(language: Language, key: string): string {
  const msg = getMessages(language);
  return getNestedValue(msg, key);
}

/**
 * Detect user's preferred language from browser
 */
export function detectLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';

  const browserLang = navigator.language?.split('-')[0];
  if (browserLang && Object.keys(messages).includes(browserLang)) {
    return browserLang as Language;
  }

  return 'en';
}

/**
 * Get/set language from localStorage
 */
export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('language') as Language | null;
}

export function setStoredLanguage(language: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', language);
  }
}

/**
 * Get initial language (stored > detected > default)
 */
export function getInitialLanguage(): Language {
  return getStoredLanguage() || detectLanguage() || 'en';
}
