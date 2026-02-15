import express from 'express';
import {
  getAllPricing,
  updatePricing,
  updatePricingById,
  getPriceByTypePlan
} from '../controllers/pricingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllPricing);
router.get('/:type/:plan', getPriceByTypePlan);

// Admin only
router.put('/:id', authorize('admin'), updatePricingById);
router.put('/:type/:plan', authorize('admin'), updatePricing);

export default router;
