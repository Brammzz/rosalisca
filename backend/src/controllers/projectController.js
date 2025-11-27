import Project from '../models/Project.js';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running in production/Vercel
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

let storage;

if (isProduction) {
  // Use memory storage in production
  storage = multer.memoryStorage();
} else {
  // Use disk storage in development
  storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../../uploads/projects');
      try {
        // Only create directory in development
        if (!isProduction) {
          await fs.mkdir(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      } catch (error) {
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `project-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar (JPEG, JPG, PNG, GIF) yang diperbolehkan'));
    }
  }
});

// Middleware untuk upload gambar utama dan galeri
export const uploadProjectImages = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]);

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const filter = req.query.company ? { company: req.query.company } : {};
  const projects = await Project.find(filter).sort({ createdAt: -1 });
  res.json(projects);
});

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    category,
    year,
    location,
    description,
    status,
    client,
    duration
  } = req.body;

  let mainImageUrl = '';
  let galleryImages = [];

  // Handle main image upload
  if (req.files && req.files.mainImage) {
    if (isProduction) {
      // In production, use placeholder image
      mainImageUrl = generatePlaceholderImage('project');
    } else {
      mainImageUrl = `/uploads/projects/${req.files.mainImage[0].filename}`;
    }
  }

  // Handle gallery images upload
  if (req.files && req.files.galleryImages) {
    galleryImages = req.files.galleryImages.map((file, index) => ({
      url: isProduction ? generatePlaceholderImage('project') : `/uploads/projects/${file.filename}`,
      caption: req.body[`galleryCaption_${index}`] || '',
      isPrimary: false
    }));
  }

  const project = new Project({
    title,
    company: company || 'Rosalisca Group',
    category,
    year,
    location,
    description,
    image: mainImageUrl,
    gallery: galleryImages,
    status,
    client,
    duration,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    category,
    year,
    location,
    description,
    status,
    client,
    duration
  } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    // Handle main image upload
    if (req.files && req.files.mainImage) {
      project.image = `/uploads/projects/${req.files.mainImage[0].filename}`;
    }

    // Handle gallery images upload
    if (req.files && req.files.galleryImages) {
      const newGalleryImages = req.files.galleryImages.map((file, index) => ({
        url: `/uploads/projects/${file.filename}`,
        caption: req.body[`galleryCaption_${index}`] || '',
        isPrimary: false
      }));
      
      // Append new gallery images to existing ones
      project.gallery = [...(project.gallery || []), ...newGalleryImages];
    }

    project.title = title || project.title;
    project.company = company || project.company;
    project.category = category || project.category;
    project.year = year || project.year;
    project.location = location || project.location;
    project.description = description || project.description;
    project.status = status || project.status;
    project.client = client || project.client;
    project.duration = duration || project.duration;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Remove image from project gallery
// @route   DELETE /api/projects/:id/gallery/:imageId
// @access  Private/Admin
const removeGalleryImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;
  
  const project = await Project.findById(id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  
  // Remove image from gallery array
  project.gallery = project.gallery.filter(img => img._id.toString() !== imageId);
  
  await project.save();
  res.json({ message: 'Image removed from gallery', project });
});

// @desc    Update gallery image caption
// @route   PUT /api/projects/:id/gallery/:imageId
// @access  Private/Admin
const updateGalleryImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;
  const { caption, isPrimary } = req.body;
  
  const project = await Project.findById(id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  
  // Find and update the gallery image
  const imageIndex = project.gallery.findIndex(img => img._id.toString() === imageId);
  
  if (imageIndex === -1) {
    res.status(404);
    throw new Error('Image not found in gallery');
  }
  
  if (caption !== undefined) {
    project.gallery[imageIndex].caption = caption;
  }
  
  if (isPrimary !== undefined) {
    // If setting as primary, unset all other primary flags
    if (isPrimary) {
      project.gallery.forEach(img => img.isPrimary = false);
    }
    project.gallery[imageIndex].isPrimary = isPrimary;
  }
  
  await project.save();
  res.json({ message: 'Gallery image updated', project });
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne(); // Mongoose v6+
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  removeGalleryImage,
  updateGalleryImage,
};
