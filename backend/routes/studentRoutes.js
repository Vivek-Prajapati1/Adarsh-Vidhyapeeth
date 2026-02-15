import express from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  restoreStudent,
  getStudentStats
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadStudent } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getStudentStats);

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
