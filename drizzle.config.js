require("dotenv/config");

/** @type {import("drizzle-kit").Config} */
module.exports = {
  schema: "./utils/schema.jsx",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString:
      process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL,
  },
};
