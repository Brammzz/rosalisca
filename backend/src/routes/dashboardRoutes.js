import express from 'express';
import { 
  getDashboardOverview, 
  getProjectsStats, 
  getContactsStats, 
  getApplicationsStats, 
  getCertificatesStats, 
  getRecentActivities 
} from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all dashboard routes
router.use(protect);

// Dashboard overview
router.get('/overview', getDashboardOverview);

// Statistics endpoints
router.get('/stats/projects', getProjectsStats);
router.get('/stats/contacts', getContactsStats);
router.get('/stats/applications', getApplicationsStats);
router.get('/stats/certificates', getCertificatesStats);

// Recent activities
router.get('/recent-activities', getRecentActivities);

export default router;
