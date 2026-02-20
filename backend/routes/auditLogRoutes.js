import express from 'express';
import {
  getAllAuditLogs,
  getAuditLogById,
  getAuditLogsByTarget,
  getAuditLogStats
} from '../controllers/auditLogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Audit logs stats are admin-only
router.get('/stats', authorize('admin'), getAuditLogStats);

// Other routes accessible by both admin and directors
router.get('/', getAllAuditLogs);
router.get('/target/:model/:id', getAuditLogsByTarget);
router.get('/:id', getAuditLogById);

export default router;
