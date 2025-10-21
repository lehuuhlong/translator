import { config } from '../config/env';

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
  return data.map((item) => ({
    text: item.translations[0].text,
    ...(item.detectedLanguage && {
      detectedLanguage: {
        language: item.detectedLanguage.language,
        confidence: item.detectedLanguage.score,
      },
    }),
  }));
}
