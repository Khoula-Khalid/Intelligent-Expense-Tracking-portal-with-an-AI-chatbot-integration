// lib/db.js
import { createClient } from 'drizzle-orm/postgres';

import { Budgets, Expenses, Goals, Income } from "./schema"; // Import your schema

// Create a PostgreSQL client
const client = createClient({
    host: "localhost",
    port: 5432,
    user: "your_username",
    password: "your_password",
    database: "your_database"
});

module.exports = { client, Budgets, Expenses, Goals, Income };
