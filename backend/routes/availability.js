const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// POST /api/courts/availability
router.post("/", async (req, res) => {
  const { booking_date, time_slot } = req.body;

  try {
    // ดึง court ทั้งหมด
    const courtsRes = await pool.query("SELECT id, name FROM courts");
    const courts = courtsRes.rows;

    // ดึงการจองที่ตรงกับวันและช่วงเวลา
    const bookingsRes = await pool.query(
      "SELECT court_id FROM bookings WHERE booking_date = $1 AND time_slot = $2",
      [booking_date, time_slot]
    );
    const bookedCourts = bookingsRes.rows.map((b) => b.court_id);

    // สร้าง array พร้อมสถานะ
    const result = courts.map((court) => ({
      court_id: court.id,
      name: court.name,
      available: !bookedCourts.includes(court.id),
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ Error checking availability:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;