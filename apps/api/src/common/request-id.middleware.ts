import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const startedAt = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();

  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    const log = {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
    };
    console.log(JSON.stringify(log));
  });

  next();
}
