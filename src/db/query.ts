import { and, eq } from "drizzle-orm";
import { db } from ".";
import { accounts } from "./schema/auth";

export async function getAccessToken(userId: string) {
  const account = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, userId), eq(accounts.token_type, "bearer")),
  });
  return account?.access_token;
}
