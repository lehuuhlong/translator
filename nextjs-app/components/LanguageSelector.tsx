'use client';

import { Language, LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '../lib/validators';
import { memo, useMemo, useRef, useEffect, useState } from 'react';

interface LanguageSelectorProps {
  value: Language;
  onChange: (lang: Language) => void;
  disabled?: boolean;
  label: string;
  id: string;
}

interface Position {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const LanguageSelector = memo(function LanguageSelector({ value, onChange, disabled, label, id }: LanguageSelectorProps) {
  const isSource = id.includes('source');
  const languageList = useMemo(() => (isSource ? SUPPORTED_LANGUAGES : SUPPORTED_LANGUAGES.filter((lang) => lang !== 'auto')), [isSource]);
  const [activePosition, setActivePosition] = useState<Position | null>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (value && buttonRefs.current.has(value)) {
      const button = buttonRefs.current.get(value);
      if (button) {
        const rect = button.getBoundingClientRect();
        const parentRect = button.parentElement?.getBoundingClientRect();
        if (parentRect) {
          setActivePosition({
            left: rect.left - parentRect.left,
            top: rect.top - parentRect.top,
            width: rect.width,
            height: rect.height,
          });
        }
      }
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-1 relative">
        {/* Background animation element */}
        {activePosition && (
          <div
            className="absolute bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-all duration-300 ease-out"
            style={{
              left: activePosition.left,
              top: activePosition.top,
              width: activePosition.width,
              height: activePosition.height,
            }}
          />
        )}
        {languageList.map((lang) => (
          <button
            key={lang}
            ref={(el) => {
              if (el) {
                buttonRefs.current.set(lang, el);
              }
            }}
            onClick={() => !disabled && onChange(lang)}
            disabled={disabled || lang === value}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-300 ease-in-out relative ${
              lang === value
                ? 'text-blue-600 dark:text-blue-400 shadow-sm z-10'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm'
            }`}
          >
            {LANGUAGE_NAMES[lang]}
          </button>
        ))}
      </div>
    </div>
  );
});
