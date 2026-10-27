// Setup Turso DB: create tables and seed data using @libsql/client directly
// Run with: set -a && source .env && set +a && bun run prisma/setup-turso.ts
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

async function execStmt(client: any, stmt: string, label: string) {
  try {
    await client.execute(stmt);
    const preview = stmt.replace(/\s+/g, " ").slice(0, 80);
    console.log(`OK [${label}]:`, preview);
  } catch (e: any) {
    console.error(`ERR [${label}]:`, e.message);
    throw e;
  }
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) throw new Error("TURSO_DATABASE_URL not set");

  const client = createClient({ url, authToken });

  // 1) Schema setup - strip line comments before splitting on ;
  const schemaPath = join(process.cwd(), "prisma", "schema.sql");
  const rawSql = readFileSync(schemaPath, "utf8");
  // Remove SQL line comments (lines starting with --)
  const noComments = rawSql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  const statements = noComments
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`\n=== Executing ${statements.length} schema statements ===`);
  for (let i = 0; i < statements.length; i++) {
    await execStmt(client, statements[i], `schema-${i}`);
  }

  // 2) Seed data
  const seedPath = join(process.cwd(), "prisma", "seed-sql.ts");
  const seedModule = await import(seedPath);
  await seedModule.seedData(client);

  console.log("\n=== Done ===");
  process.exit(0);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
