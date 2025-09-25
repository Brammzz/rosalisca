import express from 'express';
const router = express.Router();
import {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getCertificateStats,
  uploadCertificateImage
} from '../controllers/certificateController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Public routes
router.route('/').get(getCertificates);
router.route('/stats').get(getCertificateStats);
router.route('/:id').get(getCertificateById);

// Admin routes with file upload
router.route('/').post(protect, admin, uploadCertificateImage, createCertificate);
router.route('/:id').put(protect, admin, uploadCertificateImage, updateCertificate);
router.route('/:id').delete(protect, admin, deleteCertificate);

export default router;
