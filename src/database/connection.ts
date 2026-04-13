import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const getConnection = async (): Promise<PoolClient> => {
  return pool.connect();
};

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export const getPool = () => pool;

export default pool;
