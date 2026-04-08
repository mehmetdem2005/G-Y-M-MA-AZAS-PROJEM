export async function loadSecretsFromManager() {
  const secretId = process.env.AWS_SECRETS_MANAGER_ID;
  if (!secretId) return;

  try {
    const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
    const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'eu-central-1' });
    const output = await client.send(new GetSecretValueCommand({ SecretId: secretId }));

    if (!output.SecretString) return;

    const parsed = JSON.parse(output.SecretString) as Record<string, string>;
    Object.entries(parsed).forEach(([key, value]) => {
      if (!process.env[key]) process.env[key] = value;
    });

    console.log('[secrets] Loaded secrets from AWS Secrets Manager');
  } catch {
    console.warn('[secrets] AWS secrets manager is configured but SDK is unavailable or request failed');
  }
}
