import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { getStats } from "@/lib/anilist";
import { AreaChart } from "@tremor/react";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { AreaChartYear, GeneralStats } from "./statistics";

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

export default async function DashboardPage({ params }: DashboardPageProps) {
  const user = await db.query.users.findFirst({
    where: eq(users.name, params.name),
  });
  if (!user) throw new Error("User not found");
  return (
    <main className="container">
      <div className="flex flex-col">
        {/* <Suspense fallback={<>Loading ...</>}>
          <GeneralStats username={user.name} />
        </Suspense> */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Suspense fallback={<>Loading ...</>}>
            <AreaChartYear username={user.name} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
