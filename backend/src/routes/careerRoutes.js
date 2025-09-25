import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  // Public routes
  getPublicCareers,
  getPublicCareerById,
  getFeaturedCareers,
  getCareerFilters,
  
  // Admin routes
  getAllCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
  updateCareerStatus,
  getDashboardStats
} from '../controllers/careerController.js';

import {
  // Public routes
  submitApplication,
  getApplicationStatus,
  
  // Admin routes
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  scheduleInterview,
  deleteApplication,
  downloadDocument,
  getApplicationStatistics
} from '../controllers/applicationController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'applications');
    createUploadDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    'resume': ['.pdf', '.doc', '.docx'],
    'coverLetter': ['.pdf', '.doc', '.docx'],
    'portfolio': ['.pdf', '.doc', '.docx', '.zip', '.rar'],
    'certificates': ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
  };

  const extension = path.extname(file.originalname).toLowerCase();
  const fieldAllowedTypes = allowedTypes[file.fieldname] || [];

  if (fieldAllowedTypes.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${extension} tidak diizinkan untuk ${file.fieldname}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10 // Maximum 10 files
  }
});

// ======================
// PUBLIC ROUTES
// ======================

// Career public routes
router.get('/public/careers', getPublicCareers);
router.get('/public/careers/featured', getFeaturedCareers);
router.get('/public/careers/filters', getCareerFilters);
router.get('/public/careers/:id', getPublicCareerById);

// Application public routes
router.post('/public/careers/:careerId/apply', 
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 },
    { name: 'portfolio', maxCount: 1 },
    { name: 'certificates', maxCount: 5 }
  ]),
  submitApplication
);

router.get('/public/applications/:applicationId/status', getApplicationStatus);

// ======================
// ADMIN ROUTES (Protected)
// ======================

// Apply authentication middleware to all admin routes
router.use('/admin', protect);

// Dashboard and statistics
router.get('/admin/dashboard/stats', getDashboardStats);
router.get('/admin/applications/statistics', getApplicationStatistics);

// Career management routes
router.route('/admin/careers')
  .get(getAllCareers)
  .post(authorize('admin', 'hr'), createCareer);

router.route('/admin/careers/:id')
  .get(getCareerById)
  .put(authorize('admin', 'hr'), updateCareer)
  .delete(authorize('admin'), deleteCareer);

router.patch('/admin/careers/:id/status', 
  authorize('admin', 'hr'), 
  updateCareerStatus
);

// Application management routes
router.route('/admin/applications')
  .get(getAllApplications);

router.route('/admin/applications/:id')
  .get(getApplicationById)
  .delete(authorize('admin'), deleteApplication);

router.patch('/admin/applications/:id/status', 
  authorize('admin', 'hr'), 
  updateApplicationStatus
);

router.post('/admin/applications/:id/schedule-interview',
  authorize('admin', 'hr'),
  scheduleInterview
);

router.get('/admin/applications/:id/documents/:documentType',
  downloadDocument
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File terlalu besar. Maksimal 10MB per file.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Terlalu banyak file. Maksimal 10 file.'
      });
    }
  }
  
  if (error.message.includes('tidak diizinkan')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
});

export default router;
