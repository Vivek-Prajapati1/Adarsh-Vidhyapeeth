import express from 'express';
import {
  getAllSeats,
  getAvailableSeatsByType,
  getSeatStats,
  cleanupExpiredSeats
} from '../controllers/seatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllSeats);
router.get('/stats', getSeatStats);
router.get('/available/:type', getAvailableSeatsByType);
router.post('/cleanup', cleanupExpiredSeats);

export default router;
