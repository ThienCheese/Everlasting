import pool from "../config/db.js";

export async function getBookings(req, res) {
  try {
    const result = await pool.query("SELECT * FROM bookings ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getBooking(req, res) {
  try {
    const { id } = req.params;
    const booking = await pool.query("SELECT * FROM bookings WHERE id=$1", [id]);
    if (!booking.rows.length) return res.status(404).json({ error: "Booking not found" });

    // fetch related dishes & services
    const dishes = await pool.query(
      `SELECT d.ten_mon, bd.don_gia
       FROM booking_dishes bd
       JOIN dishes d ON d.id = bd.dish_id
       WHERE bd.booking_id=$1`,
      [id]
    );

    const services = await pool.query(
      `SELECT s.ten_dich_vu, bs.so_luong, bs.don_gia
       FROM booking_services bs
       JOIN services s ON s.id = bs.service_id
       WHERE bs.booking_id=$1`,
      [id]
    );

    res.json({
      ...booking.rows[0],
      mon_an: dishes.rows,
      dich_vu: services.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createBooking(req, res) {
  try {
    const {
      chu_re, co_dau, dien_thoai, ngay_dai_tiec, ca, sanh_id,
      tien_dat_coc, so_luong_ban, so_ban_du_tru,
      mon_an = [], dich_vu = []
    } = req.body;

    const result = await pool.query(
      `INSERT INTO bookings
       (chu_re, co_dau, dien_thoai, ngay_dai_tiec, ca, sanh_id, tien_dat_coc, so_luong_ban, so_ban_du_tru)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [chu_re, co_dau, dien_thoai, ngay_dai_tiec, ca, sanh_id, tien_dat_coc, so_luong_ban, so_ban_du_tru]
    );
    const bookingId = result.rows[0].id;

    for (const dish of mon_an) {
      await pool.query(
        "INSERT INTO booking_dishes (booking_id, dish_id, don_gia) VALUES ($1,$2,$3)",
        [bookingId, dish.id, dish.don_gia]
      );
    }

    for (const service of dich_vu) {
      await pool.query(
        "INSERT INTO booking_services (booking_id, service_id, so_luong, don_gia) VALUES ($1,$2,$3,$4)",
        [bookingId, service.id, service.so_luong, service.don_gia]
      );
    }

    res.status(201).json({ message: "Đặt tiệc cưới thành công", id: bookingId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateBooking(req, res) {
  try {
    const { id } = req.params;
    const { so_luong_ban, mon_an = [] } = req.body;

    const result = await pool.query(
      "UPDATE bookings SET so_luong_ban=$1 WHERE id=$2 RETURNING *",
      [so_luong_ban, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Booking not found" });

    if (mon_an.length) {
      await pool.query("DELETE FROM booking_dishes WHERE booking_id=$1", [id]);
      for (const dish of mon_an) {
        await pool.query(
          "INSERT INTO booking_dishes (booking_id, dish_id, don_gia) VALUES ($1,$2,$3)",
          [id, dish.id, dish.don_gia]
        );
      }
    }

    res.json({ message: "Cập nhật thông tin tiệc cưới thành công", booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteBooking(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM bookings WHERE id=$1 RETURNING id", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Tiệc cưới đã được hủy thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
