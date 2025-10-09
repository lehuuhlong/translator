import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Rate limit: 120 requests per minute per IP
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per window
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
