import pool from "../config/db.js";

export async function getServices(req, res) {
  try {
    const result = await pool.query("SELECT * FROM services ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getService(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM services WHERE id = $1", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Service not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createService(req, res) {
  try {
    const { ten_dich_vu, don_gia, ghi_chu } = req.body;
    const result = await pool.query(
      "INSERT INTO services (ten_dich_vu, don_gia, ghi_chu) VALUES ($1,$2,$3) RETURNING *",
      [ten_dich_vu, don_gia, ghi_chu]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const { ten_dich_vu, don_gia, ghi_chu } = req.body;
    const result = await pool.query(
      "UPDATE services SET ten_dich_vu=$1, don_gia=$2, ghi_chu=$3 WHERE id=$4 RETURNING *",
      [ten_dich_vu, don_gia, ghi_chu, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Service not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM services WHERE id=$1 RETURNING id", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
