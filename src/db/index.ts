import { env } from "@/env.mjs";
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as auth from "./schema/auth";

export const schema = { ...auth };

export { mySqlTable as tableCreator } from "./schema/_table";

// Create the connection
const connection = connect({
  url: env.DATABASE_URL,
});
export const db = drizzle(connection, { schema });
