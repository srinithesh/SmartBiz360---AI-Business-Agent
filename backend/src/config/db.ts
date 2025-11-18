
import { Pool } from 'pg';
import config from './index';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // FIX: Resolve TypeScript error for 'process.exit' by casting to 'any'.
  (process as any).exit(-1);
});

export default pool;