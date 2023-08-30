"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "./db";
import { accounts } from "./db/schema/auth";
import { histories } from "./db/schema/main";
import { mutateAnilist } from "./lib/anilist";
import { auth } from "./lib/nextauth";
import { historySchema } from "./lib/validations/history";

export async function updateAnimeProgress(
  animeId: number,
  progress: number,
  pathname: string
) {
  try {
    const session = await auth();
    const account = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId, session.user.id),
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

export async function addToHistory(input: z.infer<typeof historySchema>) {
  const cookieStore = cookies();
  const historyId = cookieStore.get("historyId")?.value;
  if (!historyId) {
    const history = await db.insert(histories).values({
      imageUrl: input.image,
      title: input.title,
      episodeNumber: input.episodeNumber,
      progress: input.played,
    });

    cookieStore.set("historyId", String(history.insertId));
    revalidatePath("/home");
    return;
  }
  const history = await db.query.histories.findFirst({
    where: eq(histories.id, Number(historyId)),
  });

  // TODO: Find a better way to deal with expired historyId
  if (!history) {
    cookieStore.set({
      name: "historyId",
      value: "",
      expires: new Date(0),
    });

    await db.delete(histories).where(eq(histories.id, Number(historyId)));

    throw new Error("History not found, please try again.");
  }

  await db
    .update(histories)
    .set({
      progress: input.played,
      episodeNumber: input.episodeNumber,
    })
    .where(eq(histories.id, Number(historyId)));

  revalidatePath("/home");
}
