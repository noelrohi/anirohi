import { env } from "@/env.mjs";
import { AnimeResponse } from "@/types/enime";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { kv } from "@vercel/kv";
import dayjs from "dayjs";
import { Ratelimit } from "@upstash/ratelimit";
import { IAnimeInfo, ITitle } from "@consumet/extensions";
import relativetime from "dayjs/plugin/relativeTime";

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
  episodes: IAnimeInfo["episodes"] | undefined
) {
  return episodes ? episodes[currentEpisodeIndex + 1].number : null;
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

export function getAnimeTitle(title: string | ITitle) {
  return typeof title === "string"
    ? title
    : title.english
    ? title.english
    : title.userPreferred;
}
