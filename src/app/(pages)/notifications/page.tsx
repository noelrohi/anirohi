import { getAccessToken } from "@/db/query";
import { mutateAnilist } from "@/lib/anilist";
import { notifications } from "@/lib/gql-queries";
import { auth } from "@/lib/nextauth";
import { Notifications } from "@/types/anilist/notifications";
import { notFound, redirect } from "next/navigation";
import NotificationList from "./notificationList";

interface NotificationPageProps {}

export default async function NotificationPage({}: NotificationPageProps) {
  const session = await auth();
  if (!session) redirect("/");
  const query = notifications;
  const accessToken = await getAccessToken(session.user.id);
  if (!accessToken) throw new Error("No token found! Please try again.");
  const page = 1;
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
        <NotificationList list={data.data.Page.notifications} />
      </div>
    </div>
  );
}
