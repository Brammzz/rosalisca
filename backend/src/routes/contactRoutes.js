import express from 'express';
const router = express.Router();
import {
  getContacts,
  getContactById,
  createContact,
  updateContactStatus,
  updateContactPriority,
  replyToContact,
  addContactNote,
  updateContactTags,
  deleteContact,
  getContactStats,
  bulkUpdateContacts
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Public routes
router.route('/').post(createContact); // For contact form submission

// Admin routes
router.route('/').get(protect, admin, getContacts);
router.route('/stats').get(protect, admin, getContactStats);
router.route('/bulk-update').put(protect, admin, bulkUpdateContacts);
router.route('/:id').get(protect, admin, getContactById);
router.route('/:id').delete(protect, admin, deleteContact);
router.route('/:id/status').put(protect, admin, updateContactStatus);
router.route('/:id/priority').put(protect, admin, updateContactPriority);
router.route('/:id/reply').post(protect, admin, replyToContact);
router.route('/:id/notes').post(protect, admin, addContactNote);
router.route('/:id/tags').put(protect, admin, updateContactTags);

export default router;
