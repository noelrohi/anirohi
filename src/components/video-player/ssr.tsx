import { Icons } from "@/components/icons";
import { getSource } from "@/lib/enime";
import { auth } from "@/lib/nextauth";
import { EpisodeResponse } from "@/types/enime";
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
  episode: EpisodeResponse;
}) {
  const session = await auth();
  const username = session?.user?.name;
  const source = await handleSource(episode?.sources[0].id);
  if (!source) return <>Oops, something went wrong!</>;
  return (
    <VideoPlayerCSR
      user={username}
      url={source.url}
      episode={episode}
      playIcon={<Icons.play />}
    />
  );
}
