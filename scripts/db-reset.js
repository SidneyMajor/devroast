/**
 * Temporary helper to recreate the database schema without interactive prompts.
 * Drops existing tables/enums and creates the new roasts + analysis_items tables.
 */
const { Client } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://sid:sidestudo@localhost:5432/devroast";

const statements = [
  "DROP TABLE IF EXISTS analysis_items CASCADE",
  "DROP TABLE IF EXISTS roasts CASCADE",
  "DROP TYPE IF EXISTS verdict CASCADE",
  "DROP TYPE IF EXISTS severity CASCADE",
  "CREATE TYPE severity AS ENUM ('critical','warning','good')",
  "CREATE TYPE verdict AS ENUM ('needs_serious_help','rough_around_edges','decent_code','solid_work','exceptional')",
  `CREATE TABLE roasts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL,
    language varchar(50) NOT NULL,
    line_count integer NOT NULL,
    roast_mode boolean NOT NULL DEFAULT false,
    score real NOT NULL,
    verdict verdict NOT NULL,
    roast_quote text,
    suggested_fix text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE analysis_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    roast_id uuid NOT NULL REFERENCES roasts(id) ON DELETE CASCADE,
    severity severity NOT NULL,
    title varchar(200) NOT NULL,
    description text NOT NULL,
    "order" integer NOT NULL
  )`,
  "CREATE INDEX roasts_score_idx ON roasts(score)",
];

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  for (const sql of statements) {
    await client.query(sql);
  }
  await client.end();
  console.log("Schema reset done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
