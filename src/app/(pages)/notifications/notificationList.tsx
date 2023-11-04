"use client";

import { moreNotifs } from "@/_actions";
import { Icons } from "@/components/icons";
import { convertUnixTimestamp } from "@/lib/utils";
import { Notifications } from "@/types/anilist/notifications";
import { Button, Card } from "@tremor/react";
import { useState, useTransition } from "react";

interface NotificationListProps {
  list: Notifications["data"]["Page"]["notifications"];
}

export default function NotificationList({ list }: NotificationListProps) {
  const [notifs, setNotifs] = useState(list);
  const [page, setPage] = useState(2);
  const [isLoading, startLoading] = useTransition();
  async function loadMore() {
    setPage(page + 1);
    startLoading(async () => {
      const moreData = await moreNotifs(page);
      setNotifs([...notifs, ...moreData]);
    });
  }
  return (
    <>
      {notifs
        .filter((notif) => notif.type === "AIRING")
        .map((notif) => {
          const title =
            notif.media?.title.english ?? notif.media?.title.userPreferred;
          return (
            <Card
              key={notif.id}
              decoration="right"
              decorationColor="indigo"
              className="flex justify-between"
            >
              <div className="text-lg max-w-[200px] lg:max-w-fit">
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
          <Icons.loader className="animate-spin w-4 h-4 mr-2 inline-flex" />
        )}
        {isLoading ? "Loading" : "Load More"}
      </Button>
    </>
  );
}
