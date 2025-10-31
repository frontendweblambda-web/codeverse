import { config } from "dotenv";
import path from "path";
import { defineConfig, env } from "prisma/config";

config({ path: `.env.${process.env.NODE_ENV}` });
export default defineConfig({
  schema: path.resolve("db"),
  migrations: {
    path: path.resolve("db", "migrations"),
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
