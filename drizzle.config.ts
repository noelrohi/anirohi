import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config();

export default {
  schema: "./src/db/schema",
  driver: "mysql2",
  out: "./src/db",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
  tablesFilter: ["rohi_*"],
} satisfies Config;
