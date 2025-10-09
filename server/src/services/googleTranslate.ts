import { TranslationServiceClient } from '@google-cloud/translate';
import { config } from '../config/env';

const translationClient = new TranslationServiceClient();
const parentPath = `projects/${config.GCLOUD_PROJECT_ID}/locations/global`;

export interface TranslateRequest {
  contents: string[];
  sourceLang: string;
  targetLang: string;
}

export async function translateBatch({ contents, sourceLang, targetLang }: TranslateRequest): Promise<string[]> {
  const [response] = await translationClient.translateText({
    parent: parentPath,
    contents,
    sourceLanguageCode: sourceLang,
    targetLanguageCode: targetLang,
    mimeType: 'text/plain',
  });

  return response.translations?.map((t) => t.translatedText || '') || [];
}

export async function translateBatchWithGlossary({ contents, sourceLang, targetLang }: TranslateRequest): Promise<string[]> {
  if (!config.GLOSSARY_ID) {
    throw new Error('Glossary ID is required but not configured');
  }

  const [response] = await translationClient.translateText({
    parent: parentPath,
    contents,
    sourceLanguageCode: sourceLang,
    targetLanguageCode: targetLang,
    mimeType: 'text/plain',
    glossaryConfig: {
      glossary: config.GLOSSARY_ID,
    },
  });

  return response.translations?.map((t) => t.translatedText || '') || [];
}
