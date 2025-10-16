import express from 'express';
import { loginUser, logoutUser, getCurrentUser } from '../controllers/authController.js';
import { authenticatedUser } from '../middleware/cookieAuth.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', authenticatedUser, getCurrentUser);

export default router;
