import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// When running on Cloud Run, DB_HOST usually points to the Unix socket
// e.g. /cloudsql/PROJECT:REGION:INSTANCE
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  // Enable SSL in production for Cloud SQL connections via TCP, 
  // or default behavior if using Unix sockets (often handled automatically by the driver)
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
