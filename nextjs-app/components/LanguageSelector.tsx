'use client';

import { Language, LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '../lib/validators';

interface LanguageSelectorProps {
  value: Language;
  onChange: (lang: Language) => void;
  disabled?: boolean;
  label: string;
  id: string;
}

export function LanguageSelector({ value, onChange, disabled, label, id }: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
        disabled={disabled}
        className="p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {LANGUAGE_NAMES[lang]}
          </option>
        ))}
      </select>
    </div>
  );
}
