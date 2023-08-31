"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { accounts } from "@/db/schema/auth";
import { InsertHistory, histories } from "@/db/schema/main";
import { mutateAnilist } from "@/lib/anilist";
import { auth } from "@/lib/nextauth";
import { headers } from "next/headers";
import { ratelimit } from "@/lib/utils";

export async function updateAnimeProgress(
  animeId: number,
  progress: number,
  pathname: string
) {
  try {
    const session = await auth();
    const account = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId, session?.user.id),
        eq(accounts.token_type, "bearer")
      ),
    });

    const accessToken = account?.access_token;
    if (!accessToken) return { ok: false, message: "No access token found" };
    const query = `mutation($id: Int, $progress: Int){
                    SaveMediaListEntry(mediaId: $id, progress: $progress ) {
                        id
                    }
                }`;
    const variables = {
      id: animeId,
      progress: progress,
    };
    const data = await mutateAnilist(query, accessToken, variables);
    if (data.errors) return { ok: false, message: data.errors[0]["message"] };
    return { ok: true, message: data.data };
  } catch (e) {
    const error = e as Error;
    return { ok: false, message: error.message };
  } finally {
    revalidatePath(pathname);
  }
}

export async function deleteFromHistory(pathname: string) {
  const ip = headers().get("x-forwarded-for");
  const { success, limit, remaining, reset } = await ratelimit.limit(
    ip ?? "anonymous" + "-deleteFromHistory"
  );
  if (!success) {
    console.log(
      `ratelimit hit for deleteFromHistory , reset in ${new Date(
        reset
      ).toUTCString()}`
    );
    return;
  }
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated!");
  await db
    .delete(histories)
    .where(
      and(
        eq(histories.userId, session.user.id),
        eq(histories.pathname, pathname)
      )
    );
  revalidatePath("/home");
}

export async function addToHistory(input: InsertHistory) {
  const ip = headers().get("x-forwarded-for");
  const { success, limit, remaining, reset } = await ratelimit.limit(
    ip ?? "anonymous" + "-addToHistory"
  );
  if (!success) {
    console.log(
      `ratelimit hit for addToHistory , reset in ${new Date(
        reset
      ).toUTCString()}`
    );
    return;
  }
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated!");
  const history = await db.query.histories.findFirst({
    where: and(
      eq(histories.userId, session.user.id),
      eq(histories.title, input.title)
    ),
  });
  if (history) {
    await db
      .update(histories)
      .set({ ...input, userId: session.user.id })
      .where(
        and(
          eq(histories.userId, session.user.id),
          eq(histories.title, input.title)
        )
      );
  } else {
    await db.insert(histories).values({ ...input, userId: session.user.id });
  }
  revalidatePath("/home");
}
