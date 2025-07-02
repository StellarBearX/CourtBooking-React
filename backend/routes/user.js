const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.post("/", async (req, res) => {
  try {
    const { google_id, name, email } = req.body;

    const userCheck = await pool.query(
      "SELECT * FROM users WHERE google_id = $1",
      [google_id]
    );

    if (userCheck.rows.length > 0) {
      return res.status(200).json(userCheck.rows[0]);
    }

    const newUser = await pool.query(
      "INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3) RETURNING *",
      [google_id, name, email]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;