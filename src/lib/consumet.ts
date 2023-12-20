import "server-only";
import {
  AnimeInfo,
  ConsumetResponse,
  Recent,
  Search,
  TopAiring,
  Watch,
} from "@/types/consumet";
import { notFound } from "next/navigation";
import { getMediaDataByTitle } from "./anilist";

// const url = "https://api.consumet.org/anime/gogoanime";
const url = "https://api-ani.rohi.dev/api/gogoanime";

export async function recent(page: number = 1) {
  const response = await fetch(`${url}/recent?page=${page}`, {
    cache: "no-cache",
  });
  if (!response.ok) throw new Error("Failed to fetch recent episodes.");
  const data: ConsumetResponse<Recent> = await response.json();
  return data;
}
export async function topAiring(page: number = 1) {
  const response = await fetch(`${url}/trending?page=${page}`, {
    cache: "no-cache",
  });
  if (!response.ok) throw new Error("Failed to fetch top airing.");
  const data: ConsumetResponse<TopAiring> = await response.json();
  return data;
}

type SearchProps = {
  query: string;
  page?: number;
};

export async function search({ query, page = 1 }: SearchProps) {
  const response = await fetch(`${url}/search?q=${query}&page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch search.");
  const data: ConsumetResponse<Search> = await response.json();
  return data;
}

export async function animeInfo(animeId: string) {
  const response = await fetch(`${url}/info/${animeId}`, { cache: "no-cache" });
  if (!response.ok) throw new Error("Failed to fetch anime info.");
  const data: AnimeInfo = await response.json();
  return data;
}

interface WatchProps {
  episodeId: string;
}

export async function watch({ episodeId }: WatchProps) {
  const response = await fetch(`${url}/episode-source/${episodeId}`);
  if (!response.ok) throw new Error("Failed to fetch watch.");
  const data: Watch = await response.json();
  return data;
}

export async function handleSlug(slug: string) {
  const [settleSlug] = await Promise.allSettled([animeInfo(slug)]);
  const data = settleSlug.status === "fulfilled" ? settleSlug.value : null;
  if (!data) notFound();
  const anilist = await getMediaDataByTitle({ title: data.title });

  return { consumet: data, anilist: anilist?.Media };
}