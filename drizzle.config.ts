import { env } from "@/env.mjs";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema",
  driver: "pg",
  out: "./src/db",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["anirohi_*"],
  verbose: true,
  strict: true,
});
