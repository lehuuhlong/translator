'use client';

import { Language, LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '../lib/validators';
import { memo, useMemo } from 'react';

interface LanguageSelectorProps {
  value: Language;
  onChange: (lang: Language) => void;
  disabled?: boolean;
  label: string;
  id: string;
}

export const LanguageSelector = memo(function LanguageSelector({ value, onChange, disabled, label, id }: LanguageSelectorProps) {
  const isSource = id.includes('source');
  const languageList = useMemo(() => (isSource ? SUPPORTED_LANGUAGES : SUPPORTED_LANGUAGES.filter((lang) => lang !== 'auto')), [isSource]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-1">
        {languageList.map((lang) => (
          <button
            key={lang}
            onClick={() => !disabled && onChange(lang)}
            disabled={disabled || lang === value}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              lang === value
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {LANGUAGE_NAMES[lang]}
          </button>
        ))}
      </div>
    </div>
  );
});
