import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 4000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Supabase requires SSL
});

// Test connection at startup
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database connected:", res.rows[0]);
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
})();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
