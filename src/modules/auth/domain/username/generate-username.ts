import { randomBytes } from 'crypto'

const MIN_SEED_LENGTH = 3
const MAX_SEED_LENGTH = 16
const DEFAULT_SEED = 'user'
const SUFFIX_BYTES = 4

export function sanitizeUsernameSeed(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, MAX_SEED_LENGTH)
}

export function seedFromEmail(email: string | null | undefined): string {
  const local = (email ?? '').split('@')[0] ?? ''
  const sanitized = sanitizeUsernameSeed(local)
  return sanitized.length >= MIN_SEED_LENGTH ? sanitized : DEFAULT_SEED
}

export function randomUsernameSuffix(): string {
  return randomBytes(SUFFIX_BYTES).toString('hex')
}

export function buildCandidateUsername(seed: string): string {
  return `${seed}_${randomUsernameSuffix()}`
}
