// Single source of truth for product naming and the public origin used by
// metadata, the web manifest, and the sitemap. The origin must be configured
// per deployment; the fallback is an explicit placeholder, not a real host.

export const SITE_NAME = 'Everyday Learning Lab';
export const SITE_SHORT_NAME = 'Learning Lab';
export const SITE_DESCRIPTION =
  'Bài học khoa học ngắn, mô phỏng tương tác và thử thách thực tế cho toán, lý, hoá, sinh — kèm giả định, giới hạn và tài liệu tham khảo.';

const FALLBACK_SITE_URL = 'https://everyday-learning-lab.example';

/**
 * Absolute public origin, without a trailing slash.
 *
 * Set `NEXT_PUBLIC_SITE_URL` (for example `https://lab.example.org`) in every
 * deployment so canonical URLs and `sitemap.xml` point at the real host.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return url.origin;
      }
    } catch {
      // Invalid configuration falls back to the documented placeholder.
    }
  }
  return FALLBACK_SITE_URL;
}
