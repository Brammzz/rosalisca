import Certificate from '../models/Certificate.js';
import asyncHandler from 'express-async-handler';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config for certificate images
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/certificates');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `certificate-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, WEBP) are allowed'));
    }
  }
});

// Middleware for single image upload
export const uploadCertificateImage = upload.single('image');

// Helper function to safely delete a file
const deleteFile = async (filePath) => {
  if (!filePath || !filePath.startsWith('/uploads')) return;

  // Construct the full path from the project root
  const fullPath = path.join(__dirname, '..', '..', filePath);

  try {
    await fs.unlink(fullPath);
  } catch (error) {
    // If the file doesn't exist, we don't need to throw an error
    if (error.code !== 'ENOENT') {
      console.error(`Error deleting file ${fullPath}:`, error);
    }
  }
};

// @desc    Get all certificates with filtering and search
// @route   GET /api/certificates
// @access  Public
const getCertificates = asyncHandler(async (req, res) => {
  const { type, search, status, subsidiary, page = 1, limit = 10 } = req.query;

  // Build filter object
  let filter = {};
  
  if (type && type !== 'all') {
    filter.type = type;
  }
  
  if (status && status !== 'all') {
    filter.status = status;
  }

  if (subsidiary && subsidiary !== 'all') {
    filter.subsidiary = subsidiary;
  }

  // Search functionality
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { issuer: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const certificates = await Certificate.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Certificate.countDocuments(filter);

  res.json({
    success: true,
    data: certificates,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Public
const getCertificateById = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  res.json({
    success: true,
    data: certificate
  });
});

// @desc    Create new certificate
// @route   POST /api/certificates
// @access  Private/Admin
const createCertificate = asyncHandler(async (req, res) => {
  const { title, description, type, issuer, issueDate, expiryDate, certificateNumber, status, tags, notes, subsidiary } = req.body;

  // Check if image was uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('Certificate image is required');
  }

  const certificate = await Certificate.create({
    title,
    description,
    type,
    image: `/uploads/certificates/${req.file.filename}`,
    issuer,
    issueDate: issueDate ? new Date(issueDate) : undefined,
    expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    certificateNumber,
    status: status || 'active',
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
    notes,
    subsidiary
  });

  res.status(201).json({
    success: true,
    data: certificate,
    message: 'Certificate created successfully'
  });
});

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private/Admin
const updateCertificate = asyncHandler(async (req, res) => {
  const { title, description, type, issuer, issueDate, expiryDate, certificateNumber, status, tags, notes, subsidiary } = req.body;

  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  // Handle image update
  let imagePath = certificate.image;
  if (req.file) {
    // Delete old image if it exists
    if (certificate.image) {
      await deleteFile(certificate.image);
    }
    imagePath = `/uploads/certificates/${req.file.filename}`;
  }

  // Update fields
  certificate.title = title || certificate.title;
  certificate.description = description || certificate.description;
  certificate.type = type || certificate.type;
  certificate.image = imagePath;
  certificate.issuer = issuer || certificate.issuer;
  certificate.issueDate = issueDate ? new Date(issueDate) : certificate.issueDate;
  certificate.expiryDate = expiryDate ? new Date(expiryDate) : certificate.expiryDate;
  certificate.certificateNumber = certificateNumber || certificate.certificateNumber;
  certificate.status = status || certificate.status;
  certificate.tags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : certificate.tags;
  certificate.notes = notes || certificate.notes;
  certificate.subsidiary = subsidiary || certificate.subsidiary;

  const updatedCertificate = await certificate.save();

  res.json({
    success: true,
    data: updatedCertificate,
    message: 'Certificate updated successfully'
  });
});

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
const deleteCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  // Delete image file from filesystem
  if (certificate.image) {
    await deleteFile(certificate.image);
  }

  await certificate.deleteOne();

  res.json({
    success: true,
    message: 'Certificate deleted successfully'
  });
});

// @desc    Get certificate statistics
// @route   GET /api/certificates/stats
// @access  Public
const getCertificateStats = asyncHandler(async (req, res) => {
  const { subsidiary } = req.query;
  
  // Build filter object
  let filter = {};
  if (subsidiary && subsidiary !== 'all') {
    filter.subsidiary = subsidiary;
  }
  
  const totalCertificates = await Certificate.countDocuments(filter);
  const activeCertificates = await Certificate.countDocuments({ ...filter, status: 'active' });
  const expiredCertificates = await Certificate.countDocuments({ ...filter, status: 'expired' });
  
  // Get certificates by type with filter
  const certificatesByType = await Certificate.aggregate([
    ...(Object.keys(filter).length > 0 ? [{ $match: filter }] : []),
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get recent certificates with filter
  const recentCertificates = await Certificate.find(filter)
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title type createdAt');

  res.json({
    success: true,
    data: {
      total: totalCertificates,
      active: activeCertificates,
      expired: expiredCertificates,
      suspended: totalCertificates - activeCertificates - expiredCertificates,
      expiringSoon: 0, // TODO: implement expiring soon logic
      byType: certificatesByType,
      recent: recentCertificates
    }
  });
});

export {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getCertificateStats
};
