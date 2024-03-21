"use server";

import { db } from "@/db";
import {
  InsertComments,
  InsertHistory,
  anime,
  comments,
  histories,
} from "@/db/schema/main";
import { mutateAnilist } from "@/lib/anilist";
import { auth, signIn as login, signOut as logout } from "@/lib/nextauth";
import { ratelimit } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getAccessToken } from "@/db/query";
import { search } from "@/lib/consumet";
import { notifications } from "@/lib/gql-queries";
import { Notifications } from "@/types/anilist/notifications";

export async function updateAnimeProgress(
  animeId: number,
  progress: number,
  pathname: string,
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) throw new Error("User must be logged in!");
    const accessToken = await getAccessToken(userId);

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
    if (data.errors) return { ok: false, message: data.errors[0].message };
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
    ip ?? "anonymous" + "-deleteFromHistory",
  );
  if (!success) {
    console.log(
      `ratelimit hit for deleteFromHistory , reset in ${new Date(
        reset,
      ).toUTCString()}`,
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
        eq(histories.pathname, pathname),
      ),
    );
  revalidatePath("/home");
}

export async function addToHistory(input: InsertHistory) {
  try {
    const ip = headers().get("x-forwarded-for");
    const { success, limit, remaining, reset } = await ratelimit.limit(
      `${ip ?? "anonymous"}-addToHistory`,
    );
    if (!success) throw new Error("Ratelimit hit! Try again later.");
    const session = await auth();
    if (!session?.user) throw new Error("Not authenticated!");
    const history = await db.query.histories.findFirst({
      where: and(
        eq(histories.userId, session.user.id),
        eq(histories.title, input.title),
      ),
    });
    if (history) {
      await db
        .update(histories)
        .set({ ...input, userId: session.user.id })
        .where(
          and(
            eq(histories.userId, session.user.id),
            eq(histories.title, input.title),
          ),
        );
    } else {
      await db.insert(histories).values({ ...input, userId: session.user.id });
    }
    revalidatePath("/home");
  } catch (error) {
    console.error(error);
  }
}

export async function addComment(input: InsertComments, pathname?: string) {
  const ip = headers().get("x-forwarded-for");
  const { success, limit, remaining, reset } = await ratelimit.limit(
    `${ip ?? "anonymous"}-addComment`,
  );
  if (!success) {
    console.log(
      `ratelimit hit for addComment , reset in ${new Date(
        reset,
      ).toUTCString()}`,
    );
    return;
  }
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated!");
  await db.insert(comments).values({ ...input, userId: session.user.id });
  if (pathname) revalidatePath(pathname);
}

export async function signIn() {
  await login("anilist");
}

export async function signOut() {
  await logout();
}

export async function deleteComment({
  pathname,
  commentId,
}: {
  pathname: string;
  commentId: number;
}) {
  const rows = (await db.delete(comments).where(eq(comments.id, commentId)))
    .fields;
  if (pathname) revalidatePath(pathname);
  return rows;
}

export async function moreNotifs(page: number) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("No user.");
    const query = notifications;
    const accessToken = await getAccessToken(session.user.id);
    if (!accessToken) throw new Error("No token found! Please try again.");
    const variables = {
      page,
      feed: "all",
    };
    // console.log(page);
    const data: Notifications = await mutateAnilist(
      query,
      accessToken,
      variables,
    );
    return data.data.Page.notifications;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function checkAnimeFromDB(anilistId: number) {
  // console.log(anilistId)
  const data = await db.query.anime.findFirst({
    where: eq(anime.anilistId, anilistId),
  });
  if (!data) return { exist: false, data: null };
  return { exist: true, data };
}

function convertReleaseYearToNumber(str_year: string) {
  const num = Number(str_year.replace("Released: ", ""));
  return num;
}

export async function searchAnime({ q, page }: { q: string; page: number }) {
  const data = await search({ query: q, page });
  const results = data.results.map(({ title, id, releaseDate, image }) => {
    const data = {
      title: title,
      slug: id,
      year: releaseDate,
      image,
    };
    return data;
  });
  const filteredData = results.sort(
    (a, b) =>
      convertReleaseYearToNumber(a.year) - convertReleaseYearToNumber(b.year),
  );
  // console.log(results, "=> filtered");
  return {
    ...data,
    results: filteredData,
  };
}
