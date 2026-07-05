import { Router } from 'express';
import {
  startInterview,
  evaluateAnswerHandler,
  submitInterview,
  getInterviewHistory,
  getInterviewReport,
  saveProgress,
  getDashboardStats,
} from '../controllers/interviewController.js';
import { protect } from '../middlewares/auth.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.get('/dashboard', protect, getDashboardStats);
router.post('/start', protect, aiLimiter, startInterview);
router.post('/evaluate', protect, aiLimiter, evaluateAnswerHandler);
router.post('/submit', protect, submitInterview);
router.post('/save', protect, saveProgress);
router.get('/history', protect, getInterviewHistory);
router.get('/report/:id', protect, getInterviewReport);

export default router;
