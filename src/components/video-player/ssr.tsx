import { Icons } from "@/components/icons";
import { db } from "@/db";
import { histories } from "@/db/schema/main";
import { auth } from "@/lib/nextauth";
import { Anime, AnimeEpisode } from "@tutkli/jikan-ts";
import { and, eq } from "drizzle-orm";
import dynamic from "next/dynamic";

const VideoPlayerCSR = dynamic(() => import("./csr"), { ssr: false });

export default async function VideoPlayerSSR({
  episode,
}: {
  episode: AnimeEpisode & { anime: Anime };
}) {
  const session = await auth();
  let seekToValue, username;
  if (session?.user) {
    const history = await db.query.histories.findFirst({
      where: and(
        eq(histories.userId, session.user.id),
        eq(histories.slug, String(episode.anime.mal_id)),
        eq(histories.episodeNumber, episode.mal_id)
      ),
    });
    seekToValue = history?.duration;
    username = session.user?.name;
  }
  const searchRes = await fetch(
    `https://api.consumet.org/anime/gogoanime/${episode.anime.title}`,
    { next: { revalidate: 60 * 5 } }
  );
  if (!searchRes.ok) return <>Oops, I can't find this series.</>;
  const searchData = await searchRes.json();
  const seriesRes = await fetch(
    `https://api.consumet.org/anime/gogoanime/info/${searchData.results[0]?.id}`,
    { next: { revalidate: 60 * 5 } }
  );
  if (!seriesRes.ok) return <>Oops, I can't find this series.</>;
  const seriesData = await seriesRes.json();
  const res = await fetch(
    `https://api.consumet.org/anime/gogoanime/watch/${
      seriesData.episodes.find((e: any) => e.number == episode.mal_id)?.id
    }`,
    { next: { revalidate: 60 * 5 } }
  );
  if (!res.ok) return <>Oops, something went wrong!</>;
  const data = await res.json();
  return (
    <VideoPlayerCSR
      user={username}
      url={data.sources[0].url}
      episode={episode}
      playIcon={<Icons.play />}
      seekSecond={seekToValue}
    />
  );
}
