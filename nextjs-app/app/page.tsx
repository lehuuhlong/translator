'use client';

import { useEffect, useState } from 'react';
import { Language, LANGUAGE_NAMES } from '../lib/validators';
import { translate } from '../lib/api';
import { LanguageSelector } from '../components/LanguageSelector';
import { TextArea } from '../components/TextArea';
import { useDebounce } from '../lib/hooks';

export default function Home() {
  const [sourceLang, setSourceLang] = useState<Language>('auto');
  const [targetLang, setTargetLang] = useState<Language>('vi');
  const [sourceText, setSourceText] = useState('');
  const debouncedText = useDebounce(sourceText, 500); // 0.5 second delay
  const [translation, setTranslation] = useState('');
  const [isCached, setIsCached] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLang, setDetectedLang] = useState<Language | null>(null);

  useEffect(() => {
    const handleTranslate = async () => {
      // Clear translation if input is empty
      if (!debouncedText.trim()) {
        setTranslation('');
        setError('');
        return;
      }

      setError('');
      setIsLoading(true);

      try {
        const result = await translate(debouncedText, sourceLang, targetLang);
        setTranslation(result.translatedText);
        setIsCached(result.cached);
        if (result.detectedLanguage) {
          setDetectedLang(result.detectedLanguage.language);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Translation failed');
        setTranslation('');
      } finally {
        setIsLoading(false);
      }
    };

    handleTranslate();
  }, [debouncedText, sourceLang, targetLang]);

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') return;
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
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-blue-500">
              <path
                fill="currentColor"
                d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
              />
            </svg>
            <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100">Translate</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <div>
              <LanguageSelector id="source-lang" label="" value={sourceLang} onChange={setSourceLang} disabled={isLoading} />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSwapLanguages}
                disabled={isLoading || sourceLang === 'auto'}
                className={`p-2 rounded-lg transition-colors ${
                  sourceLang === 'auto'
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-gray-900'
                }`}
                aria-label="Swap languages"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M7 8l-4 4 4 4M17 8l4 4-4 4M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div>
              <LanguageSelector id="target-lang" label="" value={targetLang} onChange={setTargetLang} disabled={isLoading} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
            <div className="relative">
              <TextArea id="source-text" value={sourceText} onChange={setSourceText} placeholder="Enter text" readOnly={isLoading} />
              {sourceText && (
                <button
                  onClick={() => {
                    setSourceText('');
                    setTranslation('');
                    setDetectedLang(null);
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
            <div className="relative">
              <TextArea id="translation" value={translation} onChange={() => {}} readOnly placeholder="Translation" />
              <div className="absolute top-4 right-4 flex gap-2">
                {isLoading && (
                  <div className="p-1.5 text-blue-500">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                )}
                {translation && (
                  <button
                    onClick={handleCopyTranslation}
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V7C18 5.89543 17.1046 5 16 5H14M8 5V3C8 1.89543 8.89543 1 10 1H12C13.1046 1 14 1.89543 14 3V5M8 5H14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-center">{error}</div>}
      </div>
    </main>
  );
}
