const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Roxiler Store Rating API is running"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        const [result] = await pool.query("SELECT 1 AS test");

        res.json({
            success: true,
            message: "Database connected successfully",
            result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});