import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { config } from '../config/env';
import { Cache } from '../utils/cache';
import { splitSentences } from '../utils/splitSentences';
import { translateBatch } from '../services/translator';

const router = Router();

// Initialize cache with TTL from config
const translationCache = new Cache<string>(config.CACHE_TTL_SECONDS);

// Supported languages
const LANGUAGES = ['auto', 'vi', 'en', 'ja'] as const;
type Language = (typeof LANGUAGES)[number];

// Request validation schema
const translateSchema = z.object({
  text: z.string().min(1),
  sourceLang: z.enum(LANGUAGES),
  targetLang: z.enum(LANGUAGES).refine((lang) => lang !== 'auto', {
    message: "Target language cannot be 'auto'",
  }),
});

router.post('/translate', async (req: Request, res: Response) => {
  // Validate request
  const result = translateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).send({ error: 'Invalid request parameters' });
  }

  const { text, sourceLang, targetLang } = result.data;

  // Prevent same non-auto language translation
  if (sourceLang === targetLang && sourceLang !== ('auto' as Language)) {
    return res.status(400).send({ error: 'Source and target languages must be different' });
  }

  // Generate cache key
  const cacheKey = crypto.createHash('md5').update(`${text}-${sourceLang}-${targetLang}`).digest('hex');

  // Check cache
  const cached = translationCache.get(cacheKey);
  if (cached) {
    const cachedData = JSON.parse(cached);
    return res.send({
      ...cachedData,
      cached: true,
    });
  }

  try {
    // Split text into sentences
    const sentences = splitSentences(text);

    // Translate sentences
    const translatedSentences = await translateBatch({
      contents: sentences,
      sourceLang,
      targetLang,
    });

    // Join sentences back together and collect romaji
    const translatedText = translatedSentences.map((s) => s.text).join('');
    const detectedLanguage = translatedSentences[0]?.detectedLanguage;
    const sourceRomaji = translatedSentences[0]?.sourceRomaji;
    const targetRomaji = translatedSentences[0]?.targetRomaji;

    // Cache the result with romaji
    const cacheValue = JSON.stringify({
      translatedText,
      detectedLanguage,
      sourceRomaji,
      targetRomaji,
    });
    translationCache.set(cacheKey, cacheValue);

    res.send({
      translatedText,
      cached: false,
      ...(detectedLanguage && { detectedLanguage }),
      ...(sourceRomaji && { sourceRomaji }),
      ...(targetRomaji && { targetRomaji }),
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).send({ error: 'Translation failed' });
  }
});

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.send({ ok: true });
});

export default router;
