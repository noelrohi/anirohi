import { Icons } from "@/components/icons";
import { getSource } from "@/lib/enime";
import { auth } from "@/lib/nextauth";
import VideoPlayerCSR from "./csr";

async function handleSource(id: string) {
  const [settleSource] = await Promise.allSettled([getSource(id)]);
  const source =
    settleSource.status === "fulfilled" ? settleSource.value : null;
  return source;
}

export default async function VideoPlayerSSR({
  sourceId,
}: {
  sourceId: string;
}) {
  const session = await auth();
  const username = session?.user?.name;
  const source = await handleSource(sourceId);
  if (!source) return <>Oops, something went wrong!</>;
  return (
    <VideoPlayerCSR
      user={username}
      url={source.url}
      playIcon={<Icons.play />}
    />
  );
}
