export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://anirohi.xyz",
];

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // Same-origin requests don't send origin header
  return ALLOWED_ORIGINS.includes(origin);
}
