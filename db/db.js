import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  post: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  database: process.env.DB_NAME || "sales_analysis",
  password: process.env.DB_PASSWORD || "",
});

export const demonstratePoolConnection = async () => {
  const client = await pool.connect();

  let result = await client.query(
    "Select 'Pool connection successful...' as message;",
    []
  );

  console.log(result.rows[0].message);
};

export const queryDatabase = async (query, params) => {
  try {
    const client = await pool.connect();

    let result = await client.query(query, params);

    result.rows;
  } catch (err) {
    throw err;
  }
};
