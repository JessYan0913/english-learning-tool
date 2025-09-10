import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

let _client: postgres.Sql | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getClient() {
  if (!_client) {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL is not defined');
    }
    _client = postgres(process.env.POSTGRES_URL);
  }
  return _client;
}

export function getDb() {
  if (!_db) {
    _db = drizzle(getClient());
  }
  return _db;
}

// 向后兼容的导出
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  },
});
