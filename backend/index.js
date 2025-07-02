const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);
const courtRoutes = require("./routes/court");
app.use("/api/courts", courtRoutes);
const bookingRoutes = require("./routes/booking");
app.use("/api/bookings", bookingRoutes);
const availabilityRoutes = require("./routes/availability");
app.use("/api/courts/availability", availabilityRoutes);


app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`✅ Connected to PostgreSQL! Server time: ${result.rows[0].now}`);
  } catch (err) {
    console.error("❌ Cannot connect to DB", err);
    res.status(500).send("❌ Database connection failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});