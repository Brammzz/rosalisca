import express from 'express';
import {
  getCompanies,
  getCompanyById,
  getCompanyBySlug,
  getParentCompany,
  getSubsidiaries,
  createCompany,
  updateCompany,
  deleteCompany,
  updateCompanyStatus,
  updateSortOrder,
  getCompanyStats
} from '../controllers/companyController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload, handleMulterError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getCompanies);
router.route('/parent').get(getParentCompany);
router.route('/subsidiaries').get(getSubsidiaries);
router.route('/stats').get(getCompanyStats); // Move stats to public for now
router.route('/slug/:slug').get(getCompanyBySlug);
router.route('/:id').get(getCompanyById);

// Admin routes
router.route('/').post(protect, admin, upload.single('logo'), handleMulterError, createCompany);
router.route('/:id').put(protect, admin, upload.single('logo'), handleMulterError, updateCompany);
router.route('/:id').delete(protect, admin, deleteCompany);

// Admin management routes
router.route('/:id/status').patch(protect, admin, updateCompanyStatus);
router.route('/sort-order').patch(protect, admin, updateSortOrder);

export default router;
