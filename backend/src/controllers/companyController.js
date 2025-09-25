import asyncHandler from 'express-async-handler';
import Company from '../models/Company.js';
import mongoose from 'mongoose';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getCompanies = asyncHandler(async (req, res) => {
  const { 
    type, 
    search, 
    page = 1, 
    limit = 10, 
    sortBy = 'sortOrder',
    sortOrder = 'asc',
    isActive = 'true'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (type && type !== 'all') {
    filter.type = type;
  }
  
  if (isActive !== 'all') {
    filter.isActive = isActive === 'true';
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  // Add secondary sort by name if not already sorting by name
  if (sortBy !== 'name') {
    sort.name = 1;
  }

  try {
    const companies = await Company.find(filter)
      .sort(sort)
      .limit(parseInt(limit) * parseInt(page))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('createdBy updatedBy', 'email');

    const total = await Company.countDocuments(filter);

    res.json({
      success: true,
      data: companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getting companies:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data perusahaan',
      error: error.message
    });
  }
});

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
export const getCompanyById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID perusahaan tidak valid'
      });
    }

    const company = await Company.findById(id)
      .populate('createdBy updatedBy', 'email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Perusahaan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error getting company by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data perusahaan',
      error: error.message
    });
  }
});

// @desc    Get company by slug
// @route   GET /api/companies/slug/:slug
// @access  Public
export const getCompanyBySlug = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;

    const company = await Company.getBySlug(slug);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Perusahaan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error getting company by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data perusahaan',
      error: error.message
    });
  }
});

// @desc    Get parent company
// @route   GET /api/companies/parent
// @access  Public
export const getParentCompany = asyncHandler(async (req, res) => {
  try {
    const parentCompany = await Company.getParentCompany();

    if (!parentCompany) {
      return res.status(404).json({
        success: false,
        message: 'Perusahaan induk tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: parentCompany
    });
  } catch (error) {
    console.error('Error getting parent company:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data perusahaan induk',
      error: error.message
    });
  }
});

// @desc    Get subsidiaries
// @route   GET /api/companies/subsidiaries
// @access  Public
export const getSubsidiaries = asyncHandler(async (req, res) => {
  try {
    const subsidiaries = await Company.getSubsidiaries();

    res.json({
      success: true,
      data: subsidiaries,
      count: subsidiaries.length
    });
  } catch (error) {
    console.error('Error getting subsidiaries:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data anak perusahaan',
      error: error.message
    });
  }
});

// @desc    Create new company
// @route   POST /api/companies
// @access  Private/Admin
export const createCompany = asyncHandler(async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Parse JSON strings to arrays for array fields
    const arrayFields = ['achievements', 'certifications', 'projectTypes', 'clientTypes', 'expertise'];
    
    arrayFields.forEach(field => {
      if (companyData[field] && typeof companyData[field] === 'string') {
        try {
          companyData[field] = JSON.parse(companyData[field]);
        } catch (error) {
          console.log(`Failed to parse ${field}:`, companyData[field]);
          // If parsing fails, set to empty array
          companyData[field] = [];
        }
      }
    });

    // Check if company name already exists
    const existingCompany = await Company.findOne({ 
      name: { $regex: new RegExp(companyData.name, 'i') } 
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Perusahaan dengan nama tersebut sudah ada'
      });
    }

    // For parent company, ensure only one exists
    if (companyData.type === 'parent') {
      const existingParent = await Company.findOne({ type: 'parent' });
      if (existingParent) {
        return res.status(400).json({
          success: false,
          message: 'Perusahaan induk sudah ada, hanya boleh ada satu perusahaan induk'
        });
      }
    }

    const company = new Company(companyData);
    await company.save();

    const populatedCompany = await Company.findById(company._id)
      .populate('createdBy', 'email');

    res.status(201).json({
      success: true,
      message: 'Perusahaan berhasil ditambahkan',
      data: populatedCompany
    });
  } catch (error) {
    console.error('Error creating company:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Data tidak valid',
        errors: validationErrors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Slug perusahaan sudah ada, silakan gunakan nama yang berbeda'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan perusahaan',
      error: error.message
    });
  }
});

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private/Admin
export const updateCompany = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('=== UPDATE COMPANY DEBUG ===');
    console.log('ID:', id);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request file:', req.file);
    console.log('=== END DEBUG ===');

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID perusahaan tidak valid'
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Perusahaan tidak ditemukan'
      });
    }

    // Check if name is being changed and if it conflicts
    if (req.body.name && req.body.name !== company.name) {
      const existingCompany = await Company.findOne({ 
        name: { $regex: new RegExp(req.body.name, 'i') },
        _id: { $ne: id }
      });

      if (existingCompany) {
        return res.status(400).json({
          success: false,
          message: 'Perusahaan dengan nama tersebut sudah ada'
        });
      }
    }

    // Update company data
    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    // Parse JSON strings to arrays for array fields
    const arrayFields = ['achievements', 'certifications', 'projectTypes', 'clientTypes', 'expertise'];
    
    arrayFields.forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (error) {
          console.log(`Failed to parse ${field}:`, updateData[field]);
          // If parsing fails, keep as is or set to empty array
          updateData[field] = [];
        }
      }
    });

    console.log('Processed update data:', updateData);

    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy updatedBy', 'email');

    res.json({
      success: true,
      message: 'Perusahaan berhasil diperbarui',
      data: updatedCompany
    });
  } catch (error) {
    console.error('Error updating company:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Data tidak valid',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui perusahaan',
      error: error.message
    });
  }
});

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private/Admin
export const deleteCompany = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID perusahaan tidak valid'
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Perusahaan tidak ditemukan'
      });
    }

    // Prevent deletion of parent company if subsidiaries exist
    if (company.type === 'parent') {
      const subsidiariesCount = await Company.countDocuments({ type: 'subsidiary' });
      if (subsidiariesCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Tidak dapat menghapus perusahaan induk karena masih ada anak perusahaan'
        });
      }
    }

    await Company.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Perusahaan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus perusahaan',
      error: error.message
    });
  }
});

// @desc    Update company status
// @route   PATCH /api/companies/:id/status
// @access  Private/Admin
export const updateCompanyStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID perusahaan tidak valid'
      });
    }

    const company = await Company.findByIdAndUpdate(
      id,
      { 
        isActive,
        updatedBy: req.user.id
      },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Perusahaan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: `Status perusahaan berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
      data: company
    });
  } catch (error) {
    console.error('Error updating company status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status perusahaan',
      error: error.message
    });
  }
});

// @desc    Update companies sort order
// @route   PATCH /api/companies/sort-order
// @access  Private/Admin
export const updateSortOrder = asyncHandler(async (req, res) => {
  try {
    const { companies } = req.body; // Array of { id, sortOrder }

    if (!Array.isArray(companies)) {
      return res.status(400).json({
        success: false,
        message: 'Data perusahaan harus berupa array'
      });
    }

    // Update sort order for each company
    const updatePromises = companies.map(({ id, sortOrder }) => 
      Company.findByIdAndUpdate(
        id,
        { 
          sortOrder,
          updatedBy: req.user.id
        },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Urutan perusahaan berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating sort order:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui urutan perusahaan',
      error: error.message
    });
  }
});

// @desc    Get company statistics
// @route   GET /api/companies/stats
// @access  Private/Admin
export const getCompanyStats = asyncHandler(async (req, res) => {
  try {
    const totalCompanies = await Company.countDocuments({});
    const activeCompanies = await Company.countDocuments({ isActive: true });
    const parentCompanies = await Company.countDocuments({ type: 'parent' });
    const subsidiaries = await Company.countDocuments({ type: 'subsidiary' });

    // Get companies by type
    const companiesByType = await Company.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalCompanies,
        activeCompanies,
        inactiveCompanies: totalCompanies - activeCompanies,
        parentCompanies,
        subsidiaries,
        companiesByType
      }
    });
  } catch (error) {
    console.error('Error getting company stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik perusahaan',
      error: error.message
    });
  }
});
