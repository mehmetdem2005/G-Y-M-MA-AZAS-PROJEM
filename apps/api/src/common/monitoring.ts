let sentryEnabled = false;
let sentry: any = null;

export function initMonitoring() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  try {
    // Optional dependency: enable only when installed and configured.
    sentry = require('@sentry/node');
    sentry.init({ dsn, environment: process.env.NODE_ENV || 'development' });
    sentryEnabled = true;
    console.log('[monitoring] Sentry initialized');
  } catch {
    console.warn('[monitoring] SENTRY_DSN set but @sentry/node is not installed');
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  if (sentryEnabled && sentry) {
    sentry.withScope((scope: any) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => scope.setExtra(key, value));
      }
      sentry.captureException(error);
    });
  }
}
