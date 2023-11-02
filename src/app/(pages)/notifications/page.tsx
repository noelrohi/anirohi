import { getAccessToken } from "@/db/query";
import { mutateAnilist } from "@/lib/anilist";
import { notifications } from "@/lib/gql-queries";
import { auth } from "@/lib/nextauth";
import { getRelativeTime } from "@/lib/utils";
import { Notifications } from "@/types/anilist/notifications";
import { Card } from "@tremor/react";
import { notFound } from "next/navigation";

interface NotificationPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function NotificationPage({
  searchParams,
}: NotificationPageProps) {
  const session = await auth();
  if (!session) notFound();
  const query = notifications;
  const accessToken = await getAccessToken(session.user.id);
  if (!accessToken) throw new Error("No token found! Please try again.");
  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const variables = {
    page,
    feed: "all",
  };
  const data: Notifications = await mutateAnilist(
    query,
    accessToken,
    variables
  );
  return (
    <div className="mx-auto px-4 lg:container my-10">
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Notifications
        </h1>
        {data.data.Page.notifications
          .filter((notif) => notif.type === "AIRING")
          .map((notif) => {
            const title =
              notif.media?.title.english ?? notif.media?.title.userPreferred;
            const createdAt = new Date(notif.createdAt * 1000).toDateString();
            return (
              <Card
                key={notif.id}
                decoration="right"
                decorationColor="indigo"
                className="flex justify-between"
              >
                <div className="text-lg max-w-[200px] lg:max-w-fit">{`Episode ${notif.episode} of ${title} aired.`}</div>
                <div className="text-muted-foreground">
                  {getRelativeTime(createdAt)}
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
