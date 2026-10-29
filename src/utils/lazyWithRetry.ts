import { lazy, ComponentType, LazyExoticComponent } from 'react';

const RELOAD_STORAGE_PREFIX = 'arc_lazy_reload_';
const RELOAD_COOLDOWN_MS = 15000;

/**
 * Detects whether a runtime error is caused by a dynamic chunk fetch failure
 * or a transient Vite module hash / React hook dispatcher mismatch during navigation.
 */
export function isRecoverableChunkOrHookError(error: unknown): boolean {
  if (!error) return false;
  const message =
    error instanceof Error
      ? `${error.name}: ${error.message}`
      : String(error);

  const lower = message.toLowerCase();
  return (
    lower.includes('invalid hook call') ||
    lower.includes("reading 'usestate'") ||
    lower.includes("reading 'useeffect'") ||
    lower.includes("reading 'usecontext'") ||
    lower.includes("reading 'usememo'") ||
    lower.includes("reading 'usecallback'") ||
    lower.includes("reading 'useref'") ||
    lower.includes('failed to fetch dynamically imported module') ||
    lower.includes('error loading dynamically imported module') ||
    lower.includes('importing a module script failed') ||
    lower.includes('chunkloaderror') ||
    lower.includes('loading chunk') ||
    lower.includes('unable to preload css')
  );
}

/**
 * Wraps React.lazy() with automatic retry logic and safe cache-busting recovery
 * so secondary pages and admin editors remain lazy-loaded on demand without
 * crashing if a chunk request encounters a transient network hiccup or stale Vite hash.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  chunkName = 'view',
  retries = 3,
  intervalMs = 300
): LazyExoticComponent<T> {
  return lazy(async () => {
    const storageKey = `${RELOAD_STORAGE_PREFIX}${chunkName}`;
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const mod = await factory();
        try {
          sessionStorage.removeItem(storageKey);
        } catch {
          // Ignore storage access errors in restricted contexts
        }
        return mod;
      } catch (err) {
        lastError = err;
        if (attempt < retries) {
          await new Promise((resolve) =>
            setTimeout(resolve, intervalMs * Math.pow(1.5, attempt))
          );
        }
      }
    }

    // If all retries failed, check if we can perform a one-time clean reload
    try {
      const lastReloadRaw = sessionStorage.getItem(storageKey);
      const now = Date.now();
      const lastReloadTime = lastReloadRaw ? parseInt(lastReloadRaw, 10) : 0;

      if (!lastReloadTime || now - lastReloadTime > RELOAD_COOLDOWN_MS) {
        sessionStorage.setItem(storageKey, String(now));
        window.location.reload();
        // Return a never-resolving promise while the browser reloads
        return new Promise<{ default: T }>(() => {});
      }
    } catch {
      // Ignore sessionStorage errors
    }

    throw lastError;
  });
}
