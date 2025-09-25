import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getDashboardOverview } from '../controllers/adminController.js';

const router = express.Router();

// @desc    Get dashboard overview
// @route   GET /api/admin/overview
// @access  Private/Admin
// Temporarily disabled for debugging
router.get('/overview', getDashboardOverview);

export default router;
