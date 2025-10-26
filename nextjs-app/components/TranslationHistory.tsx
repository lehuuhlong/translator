import { memo } from 'react';
import { LANGUAGE_NAMES } from '../lib/validators';
import { TranslationHistoryItem } from '../lib/useTranslationHistory';

interface TranslationHistoryProps {
  history: TranslationHistoryItem[];
  getTimeAgo: (timestamp: number) => string;
  onSelect: (item: TranslationHistoryItem) => void;
}

export const TranslationHistory = memo(function TranslationHistory({ history, getTimeAgo, onSelect }: TranslationHistoryProps) {
  if (history.length === 0) {
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400">No translation history yet</div>;
  }

  return (
    <div className="custom-scrollbar flex flex-col divide-y divide-gray-200 dark:divide-gray-800 overflow-y-auto max-h-[calc(100vh-31rem)]">
      {history.map((item) => (
        <button key={item.id} onClick={() => onSelect(item)} className="p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{LANGUAGE_NAMES[item.sourceLang]}</span>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{LANGUAGE_NAMES[item.targetLang]}</span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">{getTimeAgo(item.timestamp)}</span>
          </div>
          <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">{item.sourceText}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{item.translatedText}</p>
        </button>
      ))}
    </div>
  );
});
