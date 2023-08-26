import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { getStats } from "@/lib/anilist";
import { AreaChart } from "@tremor/react";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { Charts, GeneralStats } from "./statistics";
import { Separator } from "@/components/ui/separator";

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
  if (!user) throw new Error("User not found! Try signing in...");
  return (
    <main className="container">
      <div className="flex flex-col gap-8 py-8">
        <Suspense fallback={<>Loading ...</>}>
          <GeneralStats username={user.name} />
        </Suspense>
        <Suspense fallback={<>Loading ...</>}>
          <Charts username={user.name} />
        </Suspense>
      </div>
    </main>
  );
}
