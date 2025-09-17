import pool from "../config/db.js";

export async function getInvoices(req, res) {
  try {
    const result = await pool.query("SELECT * FROM invoices ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createInvoice(req, res) {
  try {
    const { booking_id, tong_tien } = req.body;
    const result = await pool.query(
      "INSERT INTO invoices (booking_id, tong_tien) VALUES ($1,$2) RETURNING *",
      [booking_id, tong_tien]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function markPaid(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE invoices SET da_thanh_toan=true WHERE id=$1 RETURNING *",
      [id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Invoice not found" });
    res.json({ message: "Invoice marked as paid", invoice: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
