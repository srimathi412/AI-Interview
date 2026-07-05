import { Router } from 'express';
import { uploadResume, analyzeResumeHandler, getResume } from '../controllers/resumeController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../config/multer.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/analyze', protect, aiLimiter, analyzeResumeHandler);
router.get('/:id', protect, getResume);

export default router;
