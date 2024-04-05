import { Icons } from "@/components/icons";
import { db } from "@/db";
import { histories } from "@/db/schema/main";
import { watch } from "@/lib/consumet";
import { auth } from "@/lib/nextauth";
import type { AnimeInfo } from "@/types/consumet";
import { and, eq } from "drizzle-orm";
import dynamic from "next/dynamic";

const VideoPlayerCSR = dynamic(() => import("./csr"), { ssr: false });

export default async function VideoPlayerSSR({
  episode,
}: {
  episode: AnimeInfo["episodes"][0] & { anime: AnimeInfo };
}) {
  const session = await auth();
  let seekToValue: undefined | number = undefined;
  let username: string | undefined | null = undefined;
  if (session?.user) {
    const history = await db.query.histories.findFirst({
      where: and(
        eq(histories.userId, session.user.id),
        eq(histories.slug, String(episode.anime.id)),
        eq(histories.episodeNumber, episode.number),
      ),
    });
    seekToValue = history?.duration ? Number(history.duration) : undefined;
    username = session.user?.name;
  }
  const data = await watch({ episodeId: episode.id });
  return (
    <VideoPlayerCSR
      user={username}
      url={
        data.sources.find((s) => s.quality === "720p")?.url ||
        data.sources[0].url
      }
      episode={episode}
      playIcon={<Icons.play />}
      seekSecond={seekToValue}
    />
  );
}
