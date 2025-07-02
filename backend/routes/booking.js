const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin"); 

// 🧑‍💼 admin เท่านั้น: ดึงการจองทั้งหมด
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings ORDER BY booking_date DESC, time_slot"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error loading all bookings:", err);
    res.status(500).json({ error: "Failed to fetch all bookings" });
  }
});
// GET /api/bookings/me (ดึงข้อมูลการจองของผู้ใช้)
router.get("/me", verifyToken, async (req, res) => {
  const uid = req.user.uid;
  try {
    const result = await pool.query(
      "SELECT * FROM bookings WHERE user_uid = $1 ORDER BY booking_date DESC, time_slot",
      [uid]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching user's bookings:", err);
    res.status(500).json({ error: "Failed to fetch your bookings" });
  }
});
// POST /api/bookings (จองสนาม)
router.post("/", verifyToken, async (req, res) => {
  const { court_id, booking_date, time_slot } = req.body;
  const { uid, email } = req.user;

  try {
    const result = await pool.query(
      `INSERT INTO bookings (user_uid, user_email, court_id, booking_date, time_slot)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING *`,
      [uid, email, court_id, booking_date, time_slot]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Booking failed" });
  }
});

// GET /api/bookings/:id (ดึงข้อมูลการจองตาม ID)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const bookingId = req.params.id;

  try {
    const result = await pool.query("DELETE FROM bookings WHERE id = $1 RETURNING *", [bookingId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "ไม่พบรายการจองที่ต้องการลบ" });
    }

    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error("❌ ลบไม่สำเร็จ:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดขณะลบการจอง" });
  }
});


module.exports = router;