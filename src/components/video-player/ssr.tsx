import { Icons } from "@/components/icons";
import { db } from "@/db";
import { histories } from "@/db/schema/main";
import { getSource } from "@/lib/consumet";
import { auth } from "@/lib/nextauth";
import { IAnimeEpisode, IAnimeInfo } from "@consumet/extensions";
import { and, eq } from "drizzle-orm";
import dynamic from "next/dynamic";

async function handleSource(id: string) {
  const [settleSource] = await Promise.allSettled([getSource(id)]);
  const source =
    settleSource.status === "fulfilled" ? settleSource.value : null;
  return source;
}

const VideoPlayerCSR = dynamic(() => import("./csr"), { ssr: false });

export default async function VideoPlayerSSR({
  episode,
}: {
  episode: IAnimeEpisode & { anime: IAnimeInfo };
}) {
  const session = await auth();
  let seekToValue, username;
  if (session?.user) {
    const history = await db.query.histories.findFirst({
      where: and(
        eq(histories.userId, session.user.id),
        eq(histories.slug, episode.anime.slug),
        eq(histories.episodeNumber, episode.number)
      ),
    });
    seekToValue = history?.duration;
    username = session.user?.name;
  }

  const source = await handleSource(episode.id);
  if (!source) return <>Oops, something went wrong!</>;
  return (
    <VideoPlayerCSR
      user={username}
      url={source.sources[0].url}
      episode={episode}
      playIcon={<Icons.play />}
      seekSecond={seekToValue}
    />
  );
}
