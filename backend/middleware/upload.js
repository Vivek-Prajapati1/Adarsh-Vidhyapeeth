import multer from 'multer';
import { studentStorage, receiptStorage } from '../config/cloudinary.js';

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const mimetype = file.mimetype;
  
  if (mimetype === 'image/jpeg' || mimetype === 'image/jpg' || mimetype === 'image/png' || mimetype === 'application/pdf') {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png) and PDF files are allowed'), false);
  }
};

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
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
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed'
    });
  }
  
  next();
};

// Create separate multer instances for different upload types
export const uploadStudent = multer({
  storage: studentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

export const uploadReceipt = multer({
  storage: receiptStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Default export for backward compatibility
const upload = multer({
  storage: receiptStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

export default upload;
export { handleMulterError };
