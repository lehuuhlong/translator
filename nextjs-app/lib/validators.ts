export const SUPPORTED_LANGUAGES = ['auto', 'vi', 'en', 'ja'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<Language, string> = {
  auto: 'Phát hiện ngôn ngữ',
  vi: 'Tiếng Việt',
  en: 'Tiếng Anh',
  ja: 'Tiếng Nhật',
};

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
