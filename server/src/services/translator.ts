import { config } from '../config/env';
import { convertToRomaji, isJapaneseText } from './romaji';

export interface TranslateRequest {
  contents: string[];
  sourceLang: string;
  targetLang: string;
}

interface TranslateResponse {
  translations: {
    text: string;
    to: string;
  }[];
  detectedLanguage?: {
    language: string;
    score: number;
  };
}

export interface TranslationResult {
  text: string;
  detectedLanguage?: {
    language: string;
    confidence: number;
  };
  sourceRomaji?: string;
  targetRomaji?: string;
}

export async function translateBatch({ contents, sourceLang, targetLang }: TranslateRequest): Promise<TranslationResult[]> {
  const endpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLang}${
    sourceLang !== 'auto' ? `&from=${sourceLang}` : ''
  }`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': config.AZURE_TRANSLATOR_KEY,
      'Ocp-Apim-Subscription-Region': config.AZURE_TRANSLATOR_REGION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contents.map((text) => ({ text }))),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Translation failed: ${error}`);
  }

  const data: TranslateResponse[] = await response.json();

  const results = await Promise.all(
    data.map(async (item, index) => {
      const sourceText = contents[index];
      const translatedText = item.translations[0].text;
      const detectedLang = item.detectedLanguage?.language || sourceLang;

      // Handle romaji conversions
      const sourceRomaji =
        (detectedLang === 'ja' || sourceLang === 'ja') && (await isJapaneseText(sourceText)) ? await convertToRomaji(sourceText) : undefined;

      const targetRomaji = targetLang === 'ja' && (await isJapaneseText(translatedText)) ? await convertToRomaji(translatedText) : undefined;

      return {
        text: translatedText,
        ...(item.detectedLanguage && {
          detectedLanguage: {
            language: detectedLang,
            confidence: item.detectedLanguage.score,
          },
        }),
        ...(sourceRomaji && { sourceRomaji }),
        ...(targetRomaji && { targetRomaji }),
      };
    })
  );

  return results;
}
