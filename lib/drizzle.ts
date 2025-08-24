import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Ambil DATABASE_URL dari environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
