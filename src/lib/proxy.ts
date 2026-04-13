const DEFAULT_HEADERS = {
  Referer: "https://megacloud.blog/",
  Origin: "https://megacloud.blog",
};

/**
 * Generate a proxied URL for video streams, subtitles, and images.
 * Uses the local /api/proxy route.
 */
export function getProxyUrl(
  url: string,
  headers?: Record<string, string>,
): string {
  if (!url) return "";

  const encodedUrl = encodeURIComponent(url);
  const mergedHeaders = { ...DEFAULT_HEADERS, ...headers };
  const encodedHeaders = encodeURIComponent(JSON.stringify(mergedHeaders));

  return `/api/proxy?url=${encodedUrl}&headers=${encodedHeaders}`;
}
