import { Icons } from "@/components/icons";
import { db } from "@/db";
import { histories } from "@/db/schema/main";
import { env } from "@/env.mjs";
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
  const url =
    data.sources.find((s) => s.quality === "720p")?.url || data.sources[0].url;
  const urlWithProxy = `${env.NEXT_PUBLIC_M3U8_PROXY_URL}?url=${url}`;
  return (
    <VideoPlayerCSR
      user={username}
      url={urlWithProxy}
      episode={episode}
      playIcon={<Icons.play />}
      seekSecond={seekToValue}
    />
  );
}
