import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { validateEnv } from './config/env';
import { requestIdMiddleware } from './common/request-id.middleware';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { initMonitoring } from './common/monitoring';
import { loadSecretsFromManager } from './config/secrets';

async function bootstrap() {
  await loadSecretsFromManager();
  validateEnv();
  initMonitoring();

  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enable('trust proxy');

  app.use(requestIdMiddleware);
  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https://*.cloudfront.net'],
          connectSrc: ["'self'", 'https://api.stripe.com'],
          frameSrc: ['https://*.stripe.com', 'https://*.iyzico.com'],
        },
      },
      hsts: { maxAge: 31536000, includeSubDomains: true },
      frameguard: { action: 'sameorigin' },
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });

  await app.listen(3001);
}
bootstrap();
