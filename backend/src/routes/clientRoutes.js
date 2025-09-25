import express from 'express';
const router = express.Router();
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  updateClientProjectCount,
  getClientStats,
} from '../controllers/clientController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload, handleMulterError } from '../middleware/uploadMiddleware.js';

// Public routes
router.route('/').get(getClients);
router.route('/stats').get(getClientStats);
router.route('/:id').get(getClientById);

// Admin routes with file upload
router.route('/').post(protect, admin, upload.single('logo'), handleMulterError, createClient);
router.route('/:id').put(protect, admin, upload.single('logo'), handleMulterError, updateClient);
router.route('/:id').delete(protect, admin, deleteClient);
router.route('/:id/project-count').put(protect, admin, updateClientProjectCount);

export default router;
