'use client';

import { useRef, useEffect, memo, useCallback } from 'react';
import { APP_CONFIG } from '../lib/constants';

interface TextAreaProps {
  value: string;
  onChange: (text: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  id: string;
  romaji?: string;
  showRomaji?: boolean;
}

const TextAreaComponent = ({ value, onChange, readOnly, placeholder, id, romaji, showRomaji }: TextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = value.length;
  const showCount = !readOnly;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (newValue.length <= APP_CONFIG.MAX_TEXT_LENGTH) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set new height based on scrollHeight
      textarea.style.height = `${Math.max(textarea.scrollHeight, 160)}px`;
    }
  }, [value]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <textarea
          ref={textAreaRef}
          id={id}
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder={placeholder}
          maxLength={APP_CONFIG.MAX_TEXT_LENGTH}
          className="w-full min-h-[160px] px-4 pr-16 py-4 resize-none overflow-hidden bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white text-lg placeholder:text-gray-400 dark:placeholder:text-gray-600"
          aria-label={placeholder}
        />
        {showCount && (
          <div className="absolute bottom-4 right-4">
            <span className="text-sm text-gray-400" aria-live="polite">
              {charCount} / {APP_CONFIG.MAX_TEXT_LENGTH}
            </span>
          </div>
        )}
      </div>
      {showRomaji && romaji && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">{romaji}</p>
        </div>
      )}
    </div>
  );
};

export const TextArea = memo(TextAreaComponent);
