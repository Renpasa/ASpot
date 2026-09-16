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
    const pathname = parsed.pathname.toLowerCase();
    
    // Check if there is an extension-like suffix
    const match = pathname.match(/\.([a-z0-9]+)$/i);
    if (match) {
      const ext = match[1];
      const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif', 'tiff'];
      return imageExts.includes(ext);
    }
    
    // If no extension, we allow it (e.g. Unsplash, Picsum, hash-fragments can bypass if parsed path has no ext)
    return true;
  } catch {
    return false;
  }
}
