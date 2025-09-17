import pool from "../config/db.js";

export async function getHalls(req, res) {
  try {
    const result = await pool.query("SELECT * FROM halls ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getHall(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM halls WHERE id = $1", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Hall not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createHall(req, res) {
  try {
    const { ten_sanh, loai_sanh, so_luong_ban_toi_da, don_gia_ban_toi_thieu, ghi_chu } = req.body;
    const result = await pool.query(
      `INSERT INTO halls (ten_sanh, loai_sanh, so_luong_ban_toi_da, don_gia_ban_toi_thieu, ghi_chu)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [ten_sanh, loai_sanh, so_luong_ban_toi_da, don_gia_ban_toi_thieu, ghi_chu]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateHall(req, res) {
  try {
    const { id } = req.params;
    const { ten_sanh, loai_sanh, so_luong_ban_toi_da, don_gia_ban_toi_thieu, ghi_chu } = req.body;
    const result = await pool.query(
      `UPDATE halls
       SET ten_sanh=$1, loai_sanh=$2, so_luong_ban_toi_da=$3, don_gia_ban_toi_thieu=$4, ghi_chu=$5
       WHERE id=$6 RETURNING *`,
      [ten_sanh, loai_sanh, so_luong_ban_toi_da, don_gia_ban_toi_thieu, ghi_chu, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Hall not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteHall(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM halls WHERE id=$1 RETURNING id", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Hall not found" });
    res.json({ message: "Hall deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
