import express from 'express';
const router = express.Router();
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  removeGalleryImage,
  updateGalleryImage,
  uploadProjectImages,
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Public routes
router.route('/').get(getProjects);
router.route('/:id').get(getProjectById);

// Admin routes
router.route('/').post(protect, admin, uploadProjectImages, createProject);
router.route('/:id').put(protect, admin, uploadProjectImages, updateProject);
router.route('/:id').delete(protect, admin, deleteProject);
router.route('/:id/gallery/:imageId').delete(protect, admin, removeGalleryImage);
router.route('/:id/gallery/:imageId').put(protect, admin, updateGalleryImage);

export default router;
