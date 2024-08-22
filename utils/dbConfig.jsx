import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon('postgresql://expensedb_owner:hsyHnZfk0oc2@ep-frosty-sea-a5de5tlj.us-east-2.aws.neon.tech/expensedb?sslmode=require');
export const db = drizzle(sql, { schema });
