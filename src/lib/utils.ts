import { env } from "@/env.mjs";
import { AnimeResponse } from "@/types/enime";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function removeHtmlTags(html: string): string {
  const regexPattern = /<\/?[^>]+>/g;
  return html.replace(regexPattern, "");
}

export function toTitleCase(str: string): string {
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getTitle(anime: AnimeResponse["title"]) {
  return anime.english ? anime.english : anime.userPreferred;
}

export async function getNextEpisode(
  currentEpisodeIndex: number,
  episodes: {
    number: number;
  }[]
) {
  return episodes[currentEpisodeIndex + 1]?.number || null;
}

export const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "60s"),
});
