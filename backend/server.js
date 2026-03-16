import './config/env.js'; // Load environment variables FIRST
import express from 'express';
import cors from "cors";
import helmet from 'helmet';
import compression from 'compression';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Import modules that use environment variables
import connectDatabase from './config/database.js';
import './config/cloudinary.js';
import { fixFeeStatus } from './scripts/fixFeeStatus.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import directorRoutes from './routes/directorRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect Database
connectDatabase();

const app = express();


// ======================
// Middleware
// ======================

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"), false);
    }
  },
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(compression());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ======================
// Static Files
// ======================

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ======================
// Routes
// ======================

app.use('/api/auth', authRoutes);
app.use('/api/directors', directorRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/notifications', notificationRoutes);


// ======================
// Root Route
// ======================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is Running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});


// ======================
// Health Check
// ======================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});


// ======================
// Error Handler
// ======================

app.use((err, req, res, next) => {

  console.error("❌ Error:", err);

  // Multer Errors
  if (err instanceof multer.MulterError) {

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Cloudinary errors
  if (err.message && err.message.includes('Cloudinary')) {
    return res.status(500).json({
      success: false,
      message: 'File upload failed. Check Cloudinary configuration.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });

});


// ======================
// 404 Handler
// ======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {

  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);

  console.log(
    '📁 Cloudinary:',
    process.env.CLOUDINARY_CLOUD_NAME
      ? `✅ ${process.env.CLOUDINARY_CLOUD_NAME}`
      : '❌ Not configured'
  );

  // Fix fee status
  await fixFeeStatus();

});


// ======================
// Handle Unhandled Promise Rejections
// ======================

process.on('unhandledRejection', (err) => {

  console.error(`❌ Unhandled Rejection: ${err.message}`);

  process.exit(1);

});