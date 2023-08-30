import { env } from "@/env.mjs";
import { AnimeResponse } from "@/types/enime";
import { type ClassValue, clsx } from "clsx";
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
