export const SUPPORTED_LANGUAGES = ['auto', 'ja', 'en', 'vi'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<Language, string> = {
  auto: 'Detect language',
  ja: 'Japanese',
  en: 'English',
  vi: 'Vietnamese',
};

export function getNextAvailableLanguage(currentLang: Language, selectedLang: Language, sourceLang?: Language): Language {
  // Don't change if selecting 'auto' for source
  if (selectedLang === 'auto') return selectedLang;

  // If languages would be the same, pick the next available one
  if (currentLang === selectedLang || selectedLang === sourceLang) {
    const availableLangs = SUPPORTED_LANGUAGES.filter((lang) => lang !== 'auto' && lang !== sourceLang && lang !== currentLang);
    return availableLangs[0] || currentLang;
  }

  return selectedLang;
}

export function isValidLanguage(lang: string): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
}

export function validateLanguagePair(source: string, target: string): string | null {
  if (!isValidLanguage(source)) {
    return 'Invalid source language';
  }

  if (!isValidLanguage(target)) {
    return 'Invalid target language';
  }

  if (source === target && source !== 'auto') {
    return 'Source and target languages must be different';
  }

  return null;
}
