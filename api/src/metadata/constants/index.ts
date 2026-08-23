export const METADATA_QUEUE = 'metadata';

export const METADATA_JOB = 'extract';

export const METADATA_WORKER_CONCURRENCY = 3;

export const METADATA_FETCH_TIMEOUT_MS = 10_000;

export const METADATA_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 3_000,
  },
  removeOnComplete: 100,
  removeOnFail: 500,
};

export const METADATA_USER_AGENT =
  'Mozilla/5.0 (compatible; LinkVaultBot/1.0; +https://linkvault.app/bot)';
