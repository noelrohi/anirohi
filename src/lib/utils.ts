import { env } from "@/env.mjs";
import { AnimeEpisode } from "@tutkli/jikan-ts";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import relativetime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

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

export async function getNextEpisode(
  currentEpisodeIndex: number,
  episodes: AnimeEpisode[]
) {
  return episodes ? episodes[currentEpisodeIndex + 1]?.mal_id : null;
}

export const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "60s"),
});

dayjs.extend(relativetime);

export function getRelativeTime(date: string | undefined) {
  if (typeof date === "undefined") return "";
  return dayjs(date).fromNow();
}
