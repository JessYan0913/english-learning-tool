import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

config({
  path: '.env.local',
});

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    console.log('⚠️ POSTGRES_URL is not defined, skipping database migration');
    console.log('   This is expected during build time when no database is available');
    return;
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log('⏳ Enabling required extensions...');

  try {
    // 启用 pgcrypto 扩展（用于 gen_random_uuid 函数）
    await connection`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
    console.log('✅ pgcrypto extension enabled');

    // 启用 pgvector 扩展（用于向量数据类型）
    await connection`CREATE EXTENSION IF NOT EXISTS "vector"`;
    console.log('✅ pgvector extension enabled');
  } catch (error: any) {
    console.warn('⚠️ Warning: Some extensions could not be enabled:', error.message);
    console.warn('   This might cause migration failures if the extensions are required.');
  }

  console.log('⏳ Running migrations...');

  const start = Date.now();
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  const end = Date.now();

  console.log('✅ Migrations completed in', end - start, 'ms');
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
