import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Next.js loads .env.local at runtime, but drizzle-kit (CLI) does not — load it here.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
