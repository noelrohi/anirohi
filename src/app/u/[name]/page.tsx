import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { getStats } from "@/lib/anilist";
import { absoluteUrl } from "@/lib/utils";
import { GeneralStats as GenStat } from "@/types/anilist/general-stats";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Charts, GeneralStats } from "./statistics";

interface DashboardPageProps {
  params: {
    name: string;
  };
}

// export async function generateStaticParams(): Promise<
//   DashboardPageProps["params"][]
// > {
//   const users = await db.query.users.findMany();
//   const params = users.map((user) => {
//     return { name: user.name! };
//   });
//   return params;
// }

async function getUserByUsername(username: string) {
  const data = await db.query.users.findFirst({
    where: eq(users.name, username),
  });
  if (!data) notFound();
  return data;
}

export async function generateMetadata({ params }: DashboardPageProps) {
  const user = await getUserByUsername(params.name);
  const data: GenStat = await getStats(user.name, "general");
  const title = `${user.name}'s Dashboard`;
  const description = `A user of Anirohi. Watched anime ${data.data.User.statistics.anime.count} times`;

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: absoluteUrl("/opengraph-image.png"),
          width: 1200,
          height: 630,
          alt: "opengraph image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image.png")],
    },
  };
  return metadata;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const user = await getUserByUsername(params.name);
  return (
    <main className="container">
      <div className="flex flex-col gap-8 py-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={user.image ?? ""}
              alt={user.name ?? ""}
              className="object-cover"
            />
            <AvatarFallback className="capitalize">
              {user.name?.at(0) ?? "G"}
            </AvatarFallback>
          </Avatar>
          <h1 className="scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl">
            {user.name}
          </h1>
        </div>
        <Suspense fallback={<div>Loading cards...</div>}>
          <GeneralStats username={user.name} />
        </Suspense>
        <Suspense fallback={<div>Loading charts ...</div>}>
          <Charts username={user.name} />
        </Suspense>
      </div>
    </main>
  );
}
