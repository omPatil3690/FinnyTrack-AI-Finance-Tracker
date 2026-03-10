const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const envLocalPath = path.resolve(process.cwd(), ".env.local");
const envPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

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
