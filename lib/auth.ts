import crypto from 'node:crypto';

export function getConfiguredIngestKeys() {
  return (process.env.INGEST_API_KEYS ?? '')
    .split(',')
    .map((key) => key.trim())
    .filter(Boolean);
}

export function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function isValidIngestKey(key: string | null) {
  if (!key) return false;
  const configured = getConfiguredIngestKeys();
  if (configured.length === 0) return process.env.NODE_ENV !== 'production';
  return configured.some((candidate) => crypto.timingSafeEqual(Buffer.from(sha256(candidate)), Buffer.from(sha256(key))));
}
