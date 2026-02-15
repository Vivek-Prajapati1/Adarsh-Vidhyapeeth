import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  addPayment,
  reversePayment,
  getCollectionStats,
  getPaymentsByStudent
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadReceipt, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/stats/collection', getCollectionStats);
router.get('/student/:studentId', getPaymentsByStudent);

router.route('/')
  .get(getAllPayments)
  .post(
    uploadReceipt.single('receiptImage'),
    handleMulterError,
    addPayment
  );

router.get('/:id', getPaymentById);

// Admin only - reverse payment
router.put('/:id/reverse', authorize('admin'), reversePayment);

export default router;
