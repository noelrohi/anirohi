import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getAnime, getEpisode, getSource } from "@/lib/enime";
import { AnimeResponse } from "@/types/enime";
import { notFound } from "next/navigation";
import VideoPlayer from "./video-player";
import { Suspense } from "react";
import Image from "next/image";

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

async function handleSource(id: string) {
  const [settleSource] = await Promise.allSettled([getSource(id)]);
  const source =
    settleSource.status === "fulfilled" ? settleSource.value : null;
  if (!source) notFound();
  return source;
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const anime = await handleAnime(params.slug);
  const episode = await handleEpisode(anime.episodes, params.episode);
  const source = await handleSource(episode.sources[0].id);
  return (
    <div className="container">
      <AspectRatio ratio={16 / 7}>
        <Suspense>
          <VideoPlayer
            url={source.url}
            playIcon={<Icons.play />}
            fallback={
              <Image
                src={episode.image || "/images/placeholder.png"}
                alt={episode.title}
                fill
                className="object-contain"
              />
            }
          />
        </Suspense>
      </AspectRatio>
    </div>
  );
}
