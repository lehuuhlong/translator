import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  GCLOUD_PROJECT_ID: z.string(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string(),
  PORT: z.string().transform(Number),
  CORS_ALLOW_ORIGIN: z.string(),
  CACHE_TTL_SECONDS: z.string().transform(Number),
  USE_GLOSSARY: z.string().transform((val) => val === 'true'),
  GLOSSARY_ID: z.string().optional(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(env.error.format(), null, 4));
  process.exit(1);
}

export const config = env.data;
