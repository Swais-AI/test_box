import { Pool } from 'pg';

// Connection pool — reads DATABASE_URL from .env.local (frontend root)
// Locally → points at local Postgres. On EC2 → points at AWS RDS.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    '[lib/db] DATABASE_URL is not set. Add it to .env.local at the frontend root.'
  );
}

const pool = new Pool({
  connectionString,
  // sslmode=require is parsed from the URL by node-postgres; no extra config needed for RDS
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('[lib/db] Unexpected pool error:', err);
});

export default pool;
