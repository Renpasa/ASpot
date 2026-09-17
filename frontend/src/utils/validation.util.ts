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
    try {
      pathname = decodeURIComponent(pathname);
    } catch {
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
