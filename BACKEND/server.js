require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const activityRoutes = require("./routes/ActivityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// HOME ROUTE
app.get("/", (req, res) => {
    res.send("School Events Management API is Running!");
});

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/activities", activityRoutes);

// 404 HANDLER
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found: " + req.method + " " + req.originalUrl
    });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("Server running on port " + PORT);
        });
    } catch (error) {
        console.error("Server failed:", error.message);
        process.exit(1);
    }
}

startServer();