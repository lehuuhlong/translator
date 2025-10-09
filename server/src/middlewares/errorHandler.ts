import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error(err);

  // Don't leak stack traces in production
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  res.status(500).json({ error: message });
}
