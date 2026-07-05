import { Router } from 'express';
import { getUsers, deleteUser, getAdminStats, getAllInterviews } from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/auth.js';

const router = Router();

router.use(protect, admin);

router.get('/users', getUsers);
router.delete('/user/:id', deleteUser);
router.get('/stats', getAdminStats);
router.get('/interviews', getAllInterviews);

export default router;
