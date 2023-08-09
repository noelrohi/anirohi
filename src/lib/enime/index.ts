import { env } from "@/env.mjs"; // On server
import {
  AnimeEpisodesResponse,
  AnimeResponse,
  EpisodeResponse,
  PopularResponse,
  RecentResponse,
  SearchResponse,
} from "@/types/enime";

const url = "https://api.enime.moe";
const options = { next: { revalidate: 60 } };

export async function getEpisode(id: string) {
  const endpoint = `${url}/episode/${id}`;
  const res = await fetch(endpoint, options);
  if (!res.ok) throw new Error(res.statusText);
  const data: EpisodeResponse = await res.json();
  return data;
}

export async function getPopular() {
  const endpoint = `${url}/popular`;
  const res = await fetch(endpoint, options);
  if (!res.ok) throw new Error(res.statusText);
  const data: PopularResponse = await res.json();
  return data;
}

export async function getRecent() {
  const endpoint = `${url}/recent`;
  const res = await fetch(endpoint, options);
  if (!res.ok) throw new Error(res.statusText);
  const data: RecentResponse = await res.json();
  return data;
}

export async function searchAnime(query: string) {
  const endpoint = `${url}/search/${query}`;
  const res = await fetch(endpoint, options);
  if (!res.ok) if (!res.ok) throw new Error(res.statusText);
  const data: SearchResponse = await res.json();
  return data;
}

export async function getAnime(slug: string) {
  const endpoint = `${url}/anime/${slug}`;
  const res = await fetch(endpoint, options);
  if (!res.ok) if (!res.ok) throw new Error(res.statusText);
  const data: AnimeResponse = await res.json();
  return data;
}

export async function getAnimeEpisodes(slug: string) {
  const endpoint = `${url}/anime/${slug}/episodes`;
  const res = await fetch(endpoint, options);
  if (!res.ok) if (!res.ok) throw new Error(res.statusText);
  const data: AnimeEpisodesResponse = await res.json();
  return data;
}
