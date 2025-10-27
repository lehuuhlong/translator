import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { rateLimiter } from './middlewares/rateLimit';
import { errorHandler } from './middlewares/errorHandler';
import translateRouter from './routes/translate';

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: config.CORS_ALLOW_ORIGIN,
    methods: ['GET', 'POST'],
  })
);

app.set('trust proxy', true);
app.use(rateLimiter);

// Routes
app.use(translateRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});
