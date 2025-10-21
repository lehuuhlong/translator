import { useState, useEffect } from 'react';
import { Language } from './validators';

export interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: Language;
  targetLang: Language;
  timestamp: number;
}

const STORAGE_KEY = 'translation_history';
const EXPIRY_DAYS = 7;

export function useTranslationHistory() {
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);

  const updateLocalStorage = (items: TranslationHistoryItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const findExistingTranslation = (sourceText: string, sourceLang: Language, targetLang: Language) => {
    return history.find((item) => item.sourceText === sourceText && item.sourceLang === sourceLang && item.targetLang === targetLang);
  };

  // Load history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory) as TranslationHistoryItem[];
      // Filter out expired items (older than 7 days)
      const now = Date.now();
      const validHistory = parsedHistory.filter((item) => now - item.timestamp <= EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      setHistory(validHistory);

      // If some items were expired, update localStorage
      if (validHistory.length !== parsedHistory.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validHistory));
      }
    }
  }, []);

  const addToHistory = (item: Omit<TranslationHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: TranslationHistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    updateLocalStorage(updatedHistory);
  };

  const selectFromHistory = (id: string) => {
    const selectedItem = history.find((item) => item.id === id);
    if (!selectedItem) return null;

    // Remove the selected item from its current position
    const filteredHistory = history.filter((item) => item.id !== id);

    // Create a new item with the same content but new timestamp and ID
    const newItem: TranslationHistoryItem = {
      ...selectedItem,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    // Add the item to the top of history
    const updatedHistory = [newItem, ...filteredHistory];
    setHistory(updatedHistory);
    updateLocalStorage(updatedHistory);

    return newItem;
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }

    return 'just now';
  };

  return {
    history,
    addToHistory,
    selectFromHistory,
    clearHistory,
    getTimeAgo,
    findExistingTranslation,
  };
}
