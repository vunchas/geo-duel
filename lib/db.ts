type SqlValue = string | number | null;
type FirstRow = Record<string, SqlValue>;

type RunResult = { meta: { changes: number } };

type Statement = {
  bind: (...values: SqlValue[]) => Statement;
  first: <T = FirstRow>() => Promise<T | null>;
  run: () => Promise<RunResult>;
};

type Database = { prepare: (sql: string) => Statement };

function postgresUrl() {
  return (
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    (process.env.DATABASE_URL?.startsWith("postgres")
      ? process.env.DATABASE_URL
      : undefined)
  );
}

function sqliteUrl() {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;
  if (process.env.LIBSQL_URL) return process.env.LIBSQL_URL;
  if (
    process.env.DATABASE_URL?.startsWith("libsql:") ||
    process.env.DATABASE_URL?.startsWith("file:")
  ) {
    return process.env.DATABASE_URL;
  }
  if (!process.env.VERCEL) return "file:geo-duel.db";
  return undefined;
}

function toPostgres(sql: string) {
  const ignoreInsert = /INSERT OR IGNORE INTO games/i.test(sql);
  const rewritten = ignoreInsert
    ? sql.replace(/INSERT OR IGNORE INTO games/i, "INSERT INTO games")
    : sql;
  let index = 0;
  const parameterized = rewritten.replace(/\?/g, () => `$${++index}`);
  return ignoreInsert
    ? `${parameterized} ON CONFLICT (code) DO NOTHING`
    : parameterized;
}

const SQLITE_SCHEMA = `
CREATE TABLE IF NOT EXISTS games (
  code TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_games_expires_at ON games (expires_at);
`;

let ready: Promise<Database> | null = null;

async function createPostgres(): Promise<Database> {
  const url = postgresUrl();
  if (!url) throw new Error("Postgres URL missing.");
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(url, { fullResults: true });
  await sql.query(`
CREATE TABLE IF NOT EXISTS games (
  code TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  expires_at BIGINT NOT NULL
)`);
  await sql.query(
    "CREATE INDEX IF NOT EXISTS idx_games_expires_at ON games (expires_at)"
  );
  return {
    prepare(query: string): Statement {
      const pgSql = toPostgres(query);
      return makeStatement(async (values) => {
        const result = await sql.query(pgSql, values);
        return {
          rows: result.rows as FirstRow[],
          changes: result.rowCount ?? 0,
        };
      });
    },
  };
}

async function createSqlite(): Promise<Database> {
  const { createClient } = await import("@libsql/client");
  const url = sqliteUrl();
  if (!url) {
    throw new Error(
      "Mokymosi kambariai laikinai nepasiekiami. Bandyk dar kartą."
    );
  }
  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  await client.executeMultiple(SQLITE_SCHEMA);
  return {
    prepare(query: string): Statement {
      return makeStatement(async (values) => {
        const result = await client.execute({ sql: query, args: values });
        return {
          rows: result.rows as unknown as FirstRow[],
          changes: result.rowsAffected,
        };
      });
    },
  };
}

function makeStatement(
  execute: (values: SqlValue[]) => Promise<{ rows: FirstRow[]; changes: number }>
): Statement {
  const bind = (...values: SqlValue[]): Statement => ({
    bind: (...next) => bind(...values, ...next),
    first: async <T = FirstRow>() => {
      const { rows } = await execute(values);
      return (rows[0] as T) ?? null;
    },
    run: async () => {
      const { changes } = await execute(values);
      return { meta: { changes } };
    },
  });
  return bind();
}

function openDatabase() {
  if (!ready) {
    ready = postgresUrl() ? createPostgres() : createSqlite();
  }
  return ready;
}

export function db(): Database {
  return {
    prepare(sql: string): Statement {
      const bind = (...values: SqlValue[]): Statement => ({
        bind: (...next) => bind(...values, ...next),
        first: async <T = FirstRow>() => {
          const database = await openDatabase();
          return database.prepare(sql).bind(...values).first<T>();
        },
        run: async () => {
          const database = await openDatabase();
          return database.prepare(sql).bind(...values).run();
        },
      });
      return bind();
    },
  };
}
