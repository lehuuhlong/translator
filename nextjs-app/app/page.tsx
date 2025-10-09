'use client';

import { useState } from 'react';
import { Language } from '../lib/validators';
import { translate } from '../lib/api';
import { LanguageSelector } from '../components/LanguageSelector';
import { TextArea } from '../components/TextArea';

export default function Home() {
  const [sourceLang, setSourceLang] = useState<Language>('en');
  const [targetLang, setTargetLang] = useState<Language>('vi');
  const [sourceText, setSourceText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isCached, setIsCached] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setError('');
    setIsLoading(true);

    try {
      const result = await translate(sourceText, sourceLang, targetLang);
      setTranslation(result.translatedText);
      setIsCached(result.cached);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      setTranslation('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translation);
    setTranslation(sourceText);
  };

  const handleCopyTranslation = () => {
    if (translation) {
      navigator.clipboard.writeText(translation);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Language Translator</h1>

        <div className="flex gap-4 items-center">
          <LanguageSelector id="source-lang" label="From" value={sourceLang} onChange={setSourceLang} disabled={isLoading} />

          <button
            onClick={handleSwapLanguages}
            disabled={isLoading}
            className="mt-8 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Swap languages"
          >
            ⇄
          </button>

          <LanguageSelector id="target-lang" label="To" value={targetLang} onChange={setTargetLang} disabled={isLoading} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextArea
            id="source-text"
            label="Enter text"
            value={sourceText}
            onChange={setSourceText}
            placeholder="Type or paste text here..."
            readOnly={isLoading}
          />

          <div className="flex flex-col gap-2">
            <TextArea
              id="translation"
              label="Translation"
              value={translation}
              onChange={() => {}}
              readOnly
              placeholder="Translation will appear here..."
            />
            {translation && (
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{isCached ? 'Loaded from cache' : 'Freshly translated'}</span>
                <button onClick={handleCopyTranslation} className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <div className="flex justify-center">
          <button
            onClick={handleTranslate}
            disabled={isLoading || !sourceText.trim() || sourceLang === targetLang}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>
    </main>
  );
}
