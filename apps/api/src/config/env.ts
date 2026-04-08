const REQUIRED_COMMON = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
const REQUIRED_PRODUCTION = ['DATABASE_URL', 'REDIS_URL', 'WEBHOOK_SIGNATURE_SECRET'];

export function validateEnv() {
  const missing = REQUIRED_COMMON.filter((key) => !process.env[key]);

  if (process.env.NODE_ENV === 'production') {
    missing.push(...REQUIRED_PRODUCTION.filter((key) => !process.env[key]));
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${[...new Set(missing)].join(', ')}`);
  }
}
