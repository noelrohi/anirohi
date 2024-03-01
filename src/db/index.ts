import { env } from "@/env.mjs";
import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as auth from "./schema/auth";
import * as main from "./schema/main";

export const schema = { ...auth, ...main };

export { mySqlTable as tableCreator } from "./schema/_table";

const client = new Client({
  url: env.DATABASE_URL,
});

export const db = drizzle(client, { schema });
