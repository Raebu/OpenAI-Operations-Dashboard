import crypto from 'node:crypto';

export type Role = 'viewer' | 'analyst' | 'reviewer' | 'admin';

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

export type AuthenticatedPrincipal = {
  subject: string;
  organisationId: string;
  role: Role;
};

const roleRank: Record<Role, number> = {
  viewer: 0,
  analyst: 1,
  reviewer: 2,
  admin: 3
};

export function hasRole(principal: AuthenticatedPrincipal, minimum: Role) {
  return roleRank[principal.role] >= roleRank[minimum];
}

export function requireProductionAuthConfigured() {
  if (process.env.NODE_ENV !== 'production') return;
  if (!process.env.AUTH_ISSUER || !process.env.AUTH_AUDIENCE) {
    throw new Error('AUTH_ISSUER and AUTH_AUDIENCE are required in production.');
  }
}
