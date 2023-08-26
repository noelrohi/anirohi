import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { getStats } from "@/lib/anilist";
import { AreaChart } from "@tremor/react";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { Charts, GeneralStats } from "./statistics";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import { GeneralStats as GenStat } from "@/types/anilist/general-stats";

interface DashboardPageProps {
  params: {
    name: string;
  };
}

export async function generateStaticParams(): Promise<
  DashboardPageProps["params"][]
> {
  const users = await db.query.users.findMany();
  const params = users.map((user) => {
    return { name: user.name };
  });
  return params;
}

export async function generateMetadata({ params }: DashboardPageProps) {
  const data: GenStat = await getStats(params.name, "general");

  const metadata: Metadata = {
    title: `${params.name}'s Dashboard`,
    description: `A user of Anirohi. Watched ${data.data.User.statistics.anime.count} animes`,
  };
  return metadata;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const user = await db.query.users.findFirst({
    where: eq(users.name, params.name),
  });
  if (!user) throw new Error("User not found! Try signing in...");
  return (
    <main className="container">
      <div className="flex flex-col gap-8 py-8">
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
