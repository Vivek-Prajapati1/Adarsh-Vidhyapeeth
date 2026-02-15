import express from 'express';
import {
  getAllAuditLogs,
  getAuditLogById,
  getAuditLogsByTarget,
  getAuditLogStats
} from '../controllers/auditLogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllAuditLogs);
router.get('/stats', getAuditLogStats);
router.get('/target/:model/:id', getAuditLogsByTarget);
router.get('/:id', getAuditLogById);

export default router;
