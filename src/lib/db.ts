import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../drizzle/schema';

const connectionString = process.env.NEXT_SUPABASE_DATABASE_URL;

if (!connectionString) {
  throw new Error('NEXT_SUPABASE_DATABASE_URL is not set');
}

// Disable prefetch as it is not supported for "Transaction" mode in Supabase
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
