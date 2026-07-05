import { Router } from 'express';
import {
  sendChatMessage,
  getChatHistory,
  getDailyChallenge,
  getCareerRecommendations,
  getLeaderboard,
} from '../controllers/extraController.js';
import { protect } from '../middlewares/auth.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/chat', protect, aiLimiter, sendChatMessage);
router.get('/chat/history', protect, getChatHistory);
router.get('/daily-challenge', protect, getDailyChallenge);
router.get('/career', protect, getCareerRecommendations);
router.get('/leaderboard', protect, getLeaderboard);

export default router;
