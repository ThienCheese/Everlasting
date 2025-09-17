import pool from "../config/db.js";

export async function revenueReport(req, res) {
  try {
    const result = await pool.query(`
      SELECT h.ten_sanh, SUM(i.tong_tien) as revenue
      FROM invoices i
      JOIN bookings b ON b.id = i.booking_id
      JOIN halls h ON h.id = b.sanh_id
      WHERE i.da_thanh_toan = true
      GROUP BY h.ten_sanh
      ORDER BY revenue DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
