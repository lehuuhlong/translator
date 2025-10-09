import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { config } from '../config/env';
import { Cache } from '../utils/cache';
import { splitSentences } from '../utils/splitSentences';
import { translateBatch, translateBatchWithGlossary } from '../services/googleTranslate';

const router = Router();

// Initialize cache with TTL from config
const translationCache = new Cache<string>(config.CACHE_TTL_SECONDS);

// Supported languages
const LANGUAGES = ['vi', 'en', 'ja'] as const;
type Language = (typeof LANGUAGES)[number];

// Request validation schema
const translateSchema = z.object({
  text: z.string().min(1),
  sourceLang: z.enum(LANGUAGES),
  targetLang: z.enum(LANGUAGES),
});

router.post('/translate', async (req: Request, res: Response) => {
  // Validate request
  const result = translateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).send({ error: 'Invalid request parameters' });
  }

  const { text, sourceLang, targetLang } = result.data;

  // Prevent same language translation
  if (sourceLang === targetLang) {
    return res.status(400).send({ error: 'Source and target languages must be different' });
  }

  // Generate cache key
  const cacheKey = crypto.createHash('md5').update(`${text}-${sourceLang}-${targetLang}`).digest('hex');

  // Check cache
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return res.send({ translatedText: cached, cached: true });
  }

  try {
    // Split text into sentences
    const sentences = splitSentences(text);

    // Translate sentences
    const translatedSentences = await (config.USE_GLOSSARY
      ? translateBatchWithGlossary({
          contents: sentences,
          sourceLang,
          targetLang,
        })
      : translateBatch({
          contents: sentences,
          sourceLang,
          targetLang,
        }));

    // Join sentences back together
    const translatedText = translatedSentences.join('');

    // Cache the result
    translationCache.set(cacheKey, translatedText);

    res.send({ translatedText, cached: false });
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
