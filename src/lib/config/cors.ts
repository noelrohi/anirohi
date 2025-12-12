const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") ?? [];

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // Same-origin requests don't send origin header
  return ALLOWED_ORIGINS.includes(origin);
}

export function getAllowedOrigin(origin: string | null): string {
  if (origin && isAllowedOrigin(origin)) return origin;
  return ALLOWED_ORIGINS[0] ?? "";
}
