import pool from "../config/db.js";

export async function getDishes(req, res) {
  try {
    const result = await pool.query("SELECT * FROM dishes ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getDish(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM dishes WHERE id = $1", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Dish not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createDish(req, res) {
  try {
    const { ten_mon, don_gia, ghi_chu } = req.body;
    const result = await pool.query(
      "INSERT INTO dishes (ten_mon, don_gia, ghi_chu) VALUES ($1,$2,$3) RETURNING *",
      [ten_mon, don_gia, ghi_chu]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateDish(req, res) {
  try {
    const { id } = req.params;
    const { ten_mon, don_gia, ghi_chu } = req.body;
    const result = await pool.query(
      "UPDATE dishes SET ten_mon=$1, don_gia=$2, ghi_chu=$3 WHERE id=$4 RETURNING *",
      [ten_mon, don_gia, ghi_chu, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Dish not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteDish(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM dishes WHERE id=$1 RETURNING id", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Dish not found" });
    res.json({ message: "Dish deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
