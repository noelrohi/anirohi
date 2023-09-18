import { ANIME } from "@consumet/extensions";

const gogoanime = new ANIME.Gogoanime();
const zoro = new ANIME.Zoro();

export async function getPopular() {
  const { results } = await gogoanime.fetchTopAiring();
  return results;
}

export async function getRecent() {
  const { results } = await gogoanime.fetchRecentEpisodes();
  return results;
}

export async function getEpisode(id: string) {
  const { results } = await gogoanime.fetchAnimeInfo(id);
  return results;
}

export async function searchAnime(query: string) {
  const { results } = await gogoanime.search(query);
  return results;
}

export async function getAnime(animeId: string) {
  const data = await gogoanime.fetchAnimeInfo(animeId);
  if (!data) throw new Error("No data found");
  return data;
}

export async function getAnimeEpisodes(animeId: string) {
  const data = await gogoanime.fetchEpisodeSources(animeId);
  return data;
}

export async function getSource(episodeId: string) {
  const data = await gogoanime.fetchEpisodeSources(episodeId);
  return data;
}
