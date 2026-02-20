import './config/env.js'; // Load environment variables FIRST
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Now import modules that use environment variables
import connectDatabase from './config/database.js';
import './config/cloudinary.js'; // Initialize Cloudinary with env vars
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

// Connect to database
connectDatabase();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  credentials: true
}));
app.use(compression());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/directors', directorRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Multer errors
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
  
  // Cloudinary or other file upload errors
  if (err.message && err.message.includes('Cloudinary')) {
    return res.status(500).json({
      success: false,
      message: 'File upload failed. Please check Cloudinary configuration.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('📁 Cloudinary:', process.env.CLOUDINARY_CLOUD_NAME ? `✅ ${process.env.CLOUDINARY_CLOUD_NAME}` : '❌ Not configured');
  
  // Run fee status fix on startup
  await fixFeeStatus();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
