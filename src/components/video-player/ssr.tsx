import { Icons } from "@/components/icons";
import { db } from "@/db";
import { histories } from "@/db/schema/main";
import { getSource } from "@/lib/enime";
import { auth } from "@/lib/nextauth";
import { EpisodeResponse } from "@/types/enime";
import { and, eq } from "drizzle-orm";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

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
  episode: EpisodeResponse;
}) {
  const session = await auth();
  const cookieStore = cookies();
  const historyId = cookieStore.get("historyId")?.value;
  const history = await db.query.histories.findFirst({
    where: and(
      eq(histories.userId, session.user.id),
      eq(histories.id, Number(historyId))
    ),
  });
  const username = session?.user?.name;
  const source = await handleSource(episode?.sources[0].id);
  if (!source) return <>Oops, something went wrong!</>;
  return (
    <VideoPlayerCSR
      user={username}
      url={source.url}
      episode={episode}
      playIcon={<Icons.play />}
      seekSecond={
        history?.medias?.find((anime) => anime.slug === episode.anime.slug)
          ?.seconds
      }
    />
  );
}
