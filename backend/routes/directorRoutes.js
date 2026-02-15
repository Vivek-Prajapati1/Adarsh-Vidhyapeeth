import express from 'express';
import {
  getAllDirectors,
  createDirector,
  updateDirector,
  toggleDirectorStatus,
  getDirectorById
} from '../controllers/directorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are admin-only
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAllDirectors)
  .post(createDirector);

router.route('/:id')
  .get(getDirectorById)
  .put(updateDirector);

router.put('/:id/toggle-status', toggleDirectorStatus);

export default router;
