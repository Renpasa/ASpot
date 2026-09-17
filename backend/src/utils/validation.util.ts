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
    
    // N3: To prevent bypasses with trailing non-image extensions (like .php) or paths ending in a slash
    // while allowing known dynamic image services (Unsplash, Picsum), we normalize the path to remove trailing slashes.
    // We then extract any potential extension.
    // If an extension exists, it MUST be a valid image extension.
    // If NO extension exists, we only allow it if the host is a known provider (unsplash.com, picsum.photos)
    // or if the URL seems specifically formed (e.g., hash fragments or query params exist, though URL parsing isolates pathname).
    // Actually, checking if the domain is known is safer. But we also need to allow no-extension URLs generally if they don't look like executable files?
    // The issue says: "Tighten WITHOUT rejecting legitimate shapes that MUST keep passing: http://example.com/1.jpg, Unsplash photo URLs with query params, https://picsum.photos/seed/123/600/400, https://example.com/image.png#fragment."
    // If the path ends in a known non-image extension or just has any extension not in the allowlist, we reject.
    
    // Remove trailing slashes for extension matching
    const normalizedPath = pathname.replace(/\/+$/, '');
    
    const match = normalizedPath.match(/\.([a-z0-9]+)$/i);
    if (match) {
      const ext = match[1];
      const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif', 'tiff'];
      return imageExts.includes(ext);
    }
    
    // If there is no explicit extension, allow it. This allows Unsplash and Picsum which use paths like /photo-123 or /seed/123/600/400.
    // By matching the *normalized* path for an extension, a URL like .php/ or .php is caught by the regex if it ends in .php, 
    // because normalizedPath won't have the trailing slash.
    return true;
  } catch {
    return false;
  }
}
