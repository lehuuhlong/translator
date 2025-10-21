import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  AZURE_TRANSLATOR_KEY: z.string().min(1),
  AZURE_TRANSLATOR_REGION: z.string().min(1),
  PORT: z.string().transform(Number),
  CORS_ALLOW_ORIGIN: z.string(),
  CACHE_TTL_SECONDS: z.string().transform(Number),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(env.error.format(), null, 4));
  process.exit(1);
}

export const config = env.data;
