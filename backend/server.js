import './config/env.js';

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

// ======================
// Import Config
// ======================
import connectDatabase from "./config/database.js";
import "./config/cloudinary.js";
import { fixFeeStatus } from "./scripts/fixFeeStatus.js";

// ======================
// Import Routes
// ======================
import authRoutes from "./routes/authRoutes.js";
import directorRoutes from "./routes/directorRoutes.js";
import pricingRoutes from "./routes/pricingRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// ======================
// Setup
// ======================

const app = express();
const PORT = process.env.PORT || 5001;

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// Connect Database
// ======================

connectDatabase();

// ======================
// Middlewares
// ======================

app.use(helmet());
app.use(cors());
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ======================
// Routes
// ======================

app.use("/api/auth", authRoutes);
app.use("/api/directors", directorRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/notifications", notificationRoutes);


// ======================
// Root Route (For Deployment Check)
// ======================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Server is Running Successfully",
    environment: process.env.NODE_ENV || "development",
    time: new Date()
  });
});


// ======================
// Health Check
// ======================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    time: new Date()
  });
});


// ======================
// Error Handler
// ======================

app.use((err, req, res, next) => {

  console.error("❌ Error:", err.message);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });

});


// ======================
// 404 Route
// ======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


// ======================
// Start Server
// ======================

app.listen(PORT, async () => {

  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=================================");

  // Fix fee status after server start
  await fixFeeStatus();

});


// ======================
// Handle Unhandled Promise
// ======================

process.on("unhandledRejection", (err) => {

  console.error("❌ Unhandled Rejection:", err.message);

  process.exit(1);

});