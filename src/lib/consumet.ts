import {
  AnimeInfo,
  ConsumetResponse,
  Recent,
  Search,
  TopAiring,
  Watch,
} from "@/types/consumet";

const url = "https://api.consumet.org/anime/gogoanime";

export async function recent() {
  const response = await fetch(`${url}/recent-episodes`);
  if (!response.ok) throw new Error("Failed to fetch recent episodes.");
  const data: ConsumetResponse<Recent> = await response.json();
  return data;
}
export async function topAiring() {
  const response = await fetch(`${url}/top-airing`);
  if (!response.ok) throw new Error("Failed to fetch top airing.");
  const data: ConsumetResponse<TopAiring> = await response.json();
  return data;
}

type SearchProps = {
  query: string;
  page?: number;
};

export async function search({ query, page = 1 }: SearchProps) {
  const response = await fetch(`${url}/${query}?page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch search.");
  const data: ConsumetResponse<Search> = await response.json();
  return data;
}

export async function animeInfo(animeId: string) {
  const response = await fetch(`${url}/info/${animeId}`);
  if (!response.ok) throw new Error("Failed to fetch anime info.");
  const data: AnimeInfo = await response.json();
  return data;
}

interface WatchProps {
  episodeId: string;
  server?: string;
}

export async function watch({ episodeId, server = "gogocdn" }: WatchProps) {
  const response = await fetch(`${url}/watch/${episodeId}?server=${server}`);
  if (!response.ok) throw new Error("Failed to fetch watch.");
  const data: Watch = await response.json();
  return data;
}
