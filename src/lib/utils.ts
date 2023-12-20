import { env } from "@/env.mjs";
import { AnimeInfo } from "@/types/consumet";
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

export async function nextEpisode(
  currentEpisodeIndex: number,
  episodes: AnimeInfo["episodes"]
) {
  return episodes ? episodes[currentEpisodeIndex + 1]?.number : null;
}

export async function prevEpisode(
  currentEpisodeIndex: number,
  episodes: AnimeInfo["episodes"]
) {
  return episodes ? episodes[currentEpisodeIndex - 1]?.number : null;
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

export function isMacOs() {
  if (typeof window === "undefined") return false;

  return window.navigator.userAgent.includes("Mac");
}

// using this for now since dayjs isn't accurate with days/weeks in my case, prolly timezone related
export function convertUnixTimestamp(unixTimestamp: number): string {
  const currentTime = new Date().getTime() / 1000; // Current Unix timestamp
  const diffInSeconds = Math.floor(currentTime - unixTimestamp);

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffInSeconds < 60) {
    return formatter.format(-diffInSeconds, "second");
  } else if (diffInSeconds < 3600) {
    return formatter.format(-Math.floor(diffInSeconds / 60), "minute");
  } else if (diffInSeconds < 86400) {
    return formatter.format(-Math.floor(diffInSeconds / 3600), "hour");
  } else if (diffInSeconds < 86400 * 7) {
    return formatter.format(-Math.floor(diffInSeconds / 86400), "day");
  } else {
    const dateObj = new Date(unixTimestamp * 1000);
    return getRelativeTime(dateObj.toISOString());
  }
}
