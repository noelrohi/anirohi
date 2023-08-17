"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { auth } from "./lib/nextauth";
import { accounts } from "./db/schema/auth";
import { mutateAnilist } from "./lib/anilist";
import { revalidatePath } from "next/cache";

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
