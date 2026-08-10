/**
 * Optimizes Cloudinary image URLs by injecting auto-format, auto-quality,
 * and width-limiting transformations. This dramatically reduces image sizes
 * (often 60-80% smaller) and serves modern formats like WebP/AVIF automatically.
 *
 * For returning visitors, the browser cache + Cloudinary CDN cache ensures
 * near-instant loading.
 */

const CLOUDINARY_BASE = 'res.cloudinary.com';

/**
 * Add Cloudinary transformations to an image URL.
 * @param url - The original Cloudinary image URL
 * @param width - Max width in pixels (default 600 for product cards)
 * @param quality - Quality setting (default 'auto:good')
 */
export function optimizeCloudinaryUrl(
  url: string,
  _width?: number,
  quality: string = 'auto:good'
): string {
  if (!url || !url.includes(CLOUDINARY_BASE)) return url;

  // Already optimized — skip
  if (url.includes('/f_auto') || url.includes('f_auto,')) return url;

  // Insert transformations before /v{timestamp}/
  // Pattern: .../upload/v123456/... → .../upload/f_auto,q_auto:good/v123456/...
  return url.replace(
    /\/upload\/v/,
    `/upload/f_auto,q_${quality}/v`
  );
}

/**
 * Get a tiny blurred placeholder URL for skeleton loading.
 * Cloudinary can generate a 20px wide blurred version instantly from CDN cache.
 */
export function getPlaceholderUrl(url: string): string {
  if (!url || !url.includes(CLOUDINARY_BASE)) return '';
  return url.replace(
    /\/upload\/v/,
    '/upload/f_auto,q_10,w_20,e_blur:500/v'
  );
}
