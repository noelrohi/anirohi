"use client";

import { checkAnimeFromDB, moreNotifs } from "@/_actions";
import { Icons } from "@/components/icons";
import { convertUnixTimestamp } from "@/lib/utils";
import { Notifications } from "@/types/anilist/notifications";
import { Button, Card } from "@tremor/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface NotificationListProps {
  list: Notifications["data"]["Page"]["notifications"];
}

export default function NotificationList({ list }: NotificationListProps) {
  const [notifs, setNotifs] = useState(list);
  const [page, setPage] = useState(2);
  const [isLoading, startLoading] = useTransition();
  const [anilistId, setAnilistId] = useState<null | number>(null);
  const router = useRouter();
  async function loadMore() {
    setPage(page + 1);
    startLoading(async () => {
      const moreData = await moreNotifs(page);
      setNotifs([...notifs, ...moreData]);
    });
  }

  async function redirectTo({
    anilistId,
    title,
    episodeNumber,
  }: {
    anilistId: number;
    title: string;
    episodeNumber: number;
  }) {
    const anime = await checkAnimeFromDB(anilistId);
    if (anime.exist)
      return router.push(`/anime/${anime.data?.slug}/${episodeNumber}`);
    toast.message(
      <p>
        <strong>{title}</strong> is not yet registered in database! Go to its
        series page and try again later.
      </p>,
    );
  }
  return (
    <>
      {notifs
        .filter((notif) => notif.type === "AIRING")
        .map((notif) => {
          const title =
            notif.media?.title.english ?? notif.media?.title.userPreferred;
          const episodeNumber = notif.episode;
          return (
            <Card
              key={notif.id}
              decoration="right"
              decorationColor="indigo"
              className="flex cursor-pointer justify-between"
              onClick={() => {
                notif.media?.id &&
                  title &&
                  redirectTo({
                    anilistId: notif.media.id,
                    title,
                    episodeNumber,
                  });
              }}
            >
              <div className="max-w-[200px] text-lg lg:max-w-fit">
                Episode {notif.episode} of
                <strong> {title}</strong> aired.
              </div>
              <div className="text-muted-foreground">
                {convertUnixTimestamp(notif.createdAt)}
              </div>
            </Card>
          );
        })}
      <Button onClick={loadMore}>
        {isLoading && (
          <Icons.loader className="mr-2 inline-flex size-4 animate-spin" />
        )}
        {isLoading ? "Loading" : "Load More"}
      </Button>
    </>
  );
}
