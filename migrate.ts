import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const PostgresEnv = z.object({
  DATABASE_URL: z.string().url(),
});
const ProcessEnv = PostgresEnv.parse(process.env);

const databaseUrl = drizzle(
  postgres(`${ProcessEnv.DATABASE_URL}`, { ssl: "require", max: 1 })
);

const main = async () => {
  try {
    await migrate(databaseUrl, { migrationsFolder: "drizzle" });
    console.log("Migration complete");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};
main();
