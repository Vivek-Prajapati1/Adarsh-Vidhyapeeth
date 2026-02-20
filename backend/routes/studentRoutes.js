import express from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  restoreStudent,
  getStudentStats,
  recalculateFeeStatus
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadStudent } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getStudentStats);

// Admin only - recalculate fee status for all students
router.post('/recalculate-fees', authorize('admin'), recalculateFeeStatus);

router.route('/')
  .get(getAllStudents)
  .post(uploadStudent.single('studentPhoto'), createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(uploadStudent.single('studentPhoto'), updateStudent)
  .delete(deleteStudent);

// Admin only - restore
router.put('/:id/restore', authorize('admin'), restoreStudent);

export default router;
