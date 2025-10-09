import { Language } from './validators';

interface TranslateResponse {
  translatedText: string;
  cached: boolean;
}

interface TranslateError {
  error: string;
}

export async function translate(text: string, sourceLang: Language, targetLang: Language): Promise<TranslateResponse> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;
  if (!apiBase) {
    throw new Error('NEXT_PUBLIC_API_BASE environment variable is not set');
  }

  const response = await fetch(`${apiBase}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      sourceLang,
      targetLang,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as TranslateError).error || 'Translation failed');
  }

  return data as TranslateResponse;
}
