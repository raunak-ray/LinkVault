import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema/index.ts",
    out: "./src/db/migrations",
    verbose: true,
    strict: true,
    dbCredentials: {
        url: process.env.DB_URL!
    }
})
