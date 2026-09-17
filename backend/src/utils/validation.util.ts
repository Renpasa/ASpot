/**
 * Note: This file is deliberately duplicated in frontend/src/utils/validation.util.ts
 * and backend/src/utils/validation.util.ts to avoid introducing complex build/workspace plumbing.
 * If you update this rule, make sure to update it in both places.
 */

export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }

  // Must start with http or https
  if (!/^https?:\/\//i.test(url)) {
    return false;
  }

  try {
    const parsed = new URL(url);
    
    let pathname = parsed.pathname;
    let rounds = 0;
    let isFixpoint = false;

    // Iterative decode to fixpoint, bounded to max 5 rounds
    while (rounds < 5) {
      try {
        const next = decodeURIComponent(pathname);
        if (next === pathname) {
          isFixpoint = true;
          break;
        }
        pathname = next;
        rounds++;
      } catch {
        return false;
      }
    }

    if (!isFixpoint) {
      return false;
    }

    // Reject if pathname or full url contains control characters (U+0000-U+001F, U+007F)
    // eslint-disable-next-line no-control-regex
    if (/[\x00-\x1F\x7F]/.test(pathname) || /[\x00-\x1F\x7F]/.test(url)) {
      return false;
    }
    
    pathname = pathname.toLowerCase();
    
    // N3: To prevent bypasses with trailing non-image extensions (like .php) or paths ending in a slash/dot
    // while allowing known dynamic image services (Unsplash, Picsum), we normalize the path to remove trailing slashes and dots.
    // We then extract any potential extension.
    // If an extension exists, it MUST be a valid image extension.
    // If NO extension exists, we allow it.
    
    // Remove trailing slashes and dots for extension matching
    const normalizedPath = pathname.replace(/[/.]+$/, '');
    
    const match = normalizedPath.match(/\.([a-z0-9]+)$/i);
    if (match) {
      const ext = match[1];
      const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif', 'tiff'];
      return imageExts.includes(ext);
    }
    
    return true;
  } catch {
    return false;
  }
}
