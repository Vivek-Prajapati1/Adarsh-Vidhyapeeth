import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary immediately
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify config loaded
if (process.env.CLOUDINARY_CLOUD_NAME) {
  console.log('✅ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.error('❌ Cloudinary environment variables not loaded!');
}

// Storage for student photos - using async params
export const studentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'adarsh-vidyapeeth/students',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

// Storage for payment receipts - using async params
export const receiptStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'adarsh-vidyapeeth/receipts',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      resource_type: 'auto',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

export default cloudinary;
