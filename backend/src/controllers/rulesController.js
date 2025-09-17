import pool from "../config/db.js";

export async function getRules(req, res) {
  try {
    const result = await pool.query("SELECT * FROM rules ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateRule(req, res) {
  try {
    const { rule_name, config } = req.body;
    const result = await pool.query(
      `INSERT INTO rules (rule_name, config)
       VALUES ($1, $2)
       ON CONFLICT (rule_name) DO UPDATE SET config = EXCLUDED.config
       RETURNING *`,
      [rule_name, config]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
