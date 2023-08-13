import { getAnime, getEpisode } from "@/lib/enime";
import { AnimeResponse } from "@/types/enime";
import { notFound } from "next/navigation";
import React from "react";

interface EpisodePageProps {
  params: {
    episode: string;
    slug: string;
  };
}

async function handleAnime(slug: string) {
  const [settleAnime] = await Promise.allSettled([getAnime(slug)]);
  const anime = settleAnime.status === "fulfilled" ? settleAnime.value : null;
  if (!anime) notFound();
  return anime;
}

async function handleEpisode(
  episodes: AnimeResponse["episodes"],
  episode: string
) {
  const episodeId = episodes.find((ep) => String(ep.number) === episode)?.id;
  if (!episodeId) notFound();
  const [settleEpisode] = await Promise.allSettled([getEpisode(episodeId)]);
  const episodeData =
    settleEpisode.status === "fulfilled" ? settleEpisode.value : null;
  if (!episodeData) notFound();
  return episodeData;
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const anime = await handleAnime(params.slug);
  const episode = await handleEpisode(anime.episodes, params.episode);
  return <div>{JSON.stringify(episode)}</div>;
}
