import Career from '../models/Career.js';
import Application from '../models/Application.js';
import mongoose from 'mongoose';

// Public Controllers (untuk website publik)
export const getPublicCareers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      experienceLevel,
      search,
      featured
    } = req.query;

    const filters = { status: 'active' };
    
    if (location) filters.location = new RegExp(location, 'i');
    if (experienceLevel) filters.experienceLevel = experienceLevel;
    if (featured === 'true') filters.featured = true;
    
    if (search) {
      filters.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { featured: -1, publishDate: -1 },
      populate: {
        path: 'createdBy',
        select: 'name email'
      }
    };

    const careers = await Career.find(filters)
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit)
      .populate(options.populate);

    const total = await Career.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: careers,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    console.error('Error getting public careers:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data lowongan',
      error: error.message
    });
  }
};

export const getPublicCareerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID lowongan tidak valid'
      });
    }

    const career = await Career.findOne({ 
      _id: id, 
      status: 'active' 
    }).populate('createdBy', 'name email');

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Lowongan tidak ditemukan'
      });
    }

    // Increment views
    career.views += 1;
    await career.save();

    res.status(200).json({
      success: true,
      data: career
    });
  } catch (error) {
    console.error('Error getting career by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail lowongan',
      error: error.message
    });
  }
};

export const getFeaturedCareers = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const careers = await Career.find({ 
      status: 'active', 
      featured: true 
    })
      .sort({ publishDate: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: careers
    });
  } catch (error) {
    console.error('Error getting featured careers:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil lowongan unggulan',
      error: error.message
    });
  }
};

export const getCareerFilters = async (req, res) => {
  try {
    const locations = await Career.distinct('location', { status: 'active' });
    const experienceLevels = await Career.distinct('experienceLevel', { status: 'active' });

    res.status(200).json({
      success: true,
      data: {
        locations,
        experienceLevels
      }
    });
  } catch (error) {
    console.error('Error getting career filters:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil filter lowongan',
      error: error.message
    });
  }
};

// Admin Controllers
export const getAllCareers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {};
    
    if (status) filters.status = status;
    
    if (search) {
      filters.$or = [
        { title: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const careers = await Career.find(filters)
      .sort(sortOptions)
      .limit(parseInt(limit) * parseInt(page))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('createdBy updatedBy', 'name email');

    const total = await Career.countDocuments(filters);

    // Get statistics
    const stats = await Career.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await Application.countDocuments({
      career: { $in: await Career.find(filters).distinct('_id') }
    });

    res.status(200).json({
      success: true,
      data: careers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      statistics: {
        statusBreakdown: stats,
        totalApplications
      }
    });
  } catch (error) {
    console.error('Error getting all careers:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data lowongan',
      error: error.message
    });
  }
};

export const getCareerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID lowongan tidak valid'
      });
    }

    const career = await Career.findById(id)
      .populate('createdBy updatedBy', 'name email');

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Lowongan tidak ditemukan'
      });
    }

    // Get applications for this career
    const applications = await Application.find({ career: id })
      .populate('applicant')
      .sort({ applicationDate: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...career.toObject(),
        applications
      }
    });
  } catch (error) {
    console.error('Error getting career by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail lowongan',
      error: error.message
    });
  }
};

export const createCareer = async (req, res) => {
  try {
    const careerData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Validate required fields
    const requiredFields = ['title', 'location', 'description', 'closeDate'];
    const missingFields = requiredFields.filter(field => !careerData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Field yang wajib diisi: ${missingFields.join(', ')}`
      });
    }

    const career = new Career(careerData);
    await career.save();

    const populatedCareer = await Career.findById(career._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Lowongan berhasil dibuat',
      data: populatedCareer
    });
  } catch (error) {
    console.error('Error creating career:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat lowongan',
      error: error.message
    });
  }
};

export const updateCareer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID lowongan tidak valid'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    const career = await Career.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy updatedBy', 'name email');

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Lowongan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lowongan berhasil diupdate',
      data: career
    });
  } catch (error) {
    console.error('Error updating career:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate lowongan',
      error: error.message
    });
  }
};

export const deleteCareer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID lowongan tidak valid'
      });
    }

    const career = await Career.findById(id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Lowongan tidak ditemukan'
      });
    }

    // The pre('deleteOne') middleware on the Career model will handle deleting associated applications.
    await career.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lowongan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting career:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus lowongan',
      error: error.message
    });
  }
};

export const updateCareerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID lowongan tidak valid'
      });
    }

    const validStatuses = ['draft', 'active', 'closed', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const career = await Career.findByIdAndUpdate(
      id,
      { 
        status,
        updatedBy: req.user.id,
        ...(status === 'active' && !career?.publishDate && { publishDate: new Date() })
      },
      { new: true }
    ).populate('createdBy updatedBy', 'name email');

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Lowongan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: `Status lowongan berhasil diubah menjadi ${status}`,
      data: career
    });
  } catch (error) {
    console.error('Error updating career status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengubah status lowongan',
      error: error.message
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalCareers = await Career.countDocuments();
    const activeCareers = await Career.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'submitted' });

    // Recent activities
    const recentCareers = await Career.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');

    const recentApplications = await Application.find()
      .sort({ applicationDate: -1 })
      .limit(5)
      .populate('career', 'title')
      .select('applicant career applicationDate status');

    // Application stats by status
    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Overview
    const overview = {
      totalCareers,
      activeCareers,
      totalApplications,
      pendingApplications
    };

    res.status(200).json({
      success: true,
      data: {
        overview,
        recent: {
          careers: recentCareers,
          applications: recentApplications
        },
        statistics: {
          applicationsByStatus: applicationStats
        }
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik dashboard',
      error: error.message
    });
  }
};
