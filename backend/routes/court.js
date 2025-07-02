const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/courts — ดึงสนามทั้งหมด
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courts ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /courts error:", err);
    res.status(500).json({ error: "Failed to fetch courts" });
  }
});

// POST /api/courts — เพิ่มสนามใหม่
router.post("/", async (req, res) => {
  try {
    const { name, type, location, price_per_hour, image_url } = req.body;

    const result = await pool.query(
      `INSERT INTO courts (name, type, location, price_per_hour, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, type, location, price_per_hour, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /courts error:", err);
    res.status(500).json({ error: "Failed to create court" });
  }
});

module.exports = router;