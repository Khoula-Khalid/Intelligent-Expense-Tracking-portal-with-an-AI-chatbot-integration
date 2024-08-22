/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.jsx",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://expensedb_owner:hsyHnZfk0oc2@ep-frosty-sea-a5de5tlj.us-east-2.aws.neon.tech/expensedb?sslmode=require',
    }
  };