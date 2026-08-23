import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestContext } from './middleware/request-context.js';
import { errorHandler } from './middleware/error-handler.js';
import { healthRouter } from './modules/health/routes.js';
import { ordersRouter } from './modules/orders/routes.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGINS.split(',').map((value) => value.trim()) }));
  app.use(express.json({ limit: '1mb' }));
  app.use(requestContext);

  app.get('/api/v1', (_req, res) => {
    res.json({ name: 'Restaurant OS API', version: 'v1' });
  });

  app.use('/health', healthRouter);
  app.use('/api/v1/orders', ordersRouter);

  app.use(errorHandler);
  return app;
}
