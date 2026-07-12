require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const authRoutes = require("./routes/auth.routes");
const tripRoutes = require("./routes/trip.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.use("/api/trips", tripRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "TransitOps Backend Running 🚀"
    });
});

module.exports = app;