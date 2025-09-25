import Application from '../models/Application.js';
import Career from '../models/Career.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Public Controllers (untuk pelamar)
export const submitApplication = async (req, res) => {
  try {
    const { careerId } = req.params;

    // Destructure and parse application data from the request body
    let {
      'applicant.fullName': fullName,
      'applicant.email': email,
      'applicant.phone': phone,
      education: educationStr,
      skills: skillsStr,
      languages: languagesStr,
      experience: experienceStr,
      expectedSalary: expectedSalaryStr,
      ...otherData
    } = req.body;

    let education, skills, languages, experience, expectedSalary;

    try {
      education = JSON.parse(educationStr || '[]');
      skills = JSON.parse(skillsStr || '[]');
      languages = JSON.parse(languagesStr || '[]');
      experience = JSON.parse(experienceStr || '{}');
      expectedSalary = JSON.parse(expectedSalaryStr || '{}');
    } catch (e) {
      console.error('Error parsing application data:', e);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid data format for one of the form fields.' 
      });
    }

    // Reconstruct the application data object for validation and saving
    const applicationData = {
      ...otherData,
      applicant: { fullName, email, phone },
      education,
      skills,
      languages,
      experience,
      expectedSalary
    };

    // Validate career exists and is active
    const career = await Career.findOne({ _id: careerId, status: 'active' });
    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Lowongan tidak ditemukan atau sudah tidak aktif'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      career: careerId,
      'applicant.email': applicationData.applicant.email
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah melamar untuk posisi ini'
      });
    }

    // Process uploaded files
    const documents = {};
    if (req.files) {
      if (req.files.resume) {
        documents.resume = {
          filename: req.files.resume[0].filename,
          path: req.files.resume[0].path,
          mimetype: req.files.resume[0].mimetype,
          size: req.files.resume[0].size
        };
      }
      
      if (req.files.coverLetter) {
        documents.coverLetter = {
          filename: req.files.coverLetter[0].filename,
          path: req.files.coverLetter[0].path,
          mimetype: req.files.coverLetter[0].mimetype,
          size: req.files.coverLetter[0].size
        };
      }
      
      if (req.files.portfolio) {
        documents.portfolio = {
          filename: req.files.portfolio[0].filename,
          path: req.files.portfolio[0].path,
          mimetype: req.files.portfolio[0].mimetype,
          size: req.files.portfolio[0].size
        };
      }

      if (req.files.certificates) {
        documents.certificates = req.files.certificates.map(file => ({
          name: file.originalname,
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        }));
      }
    }

    const application = new Application({
      career: careerId,
      ...applicationData,
      documents,
      applicationDate: new Date()
    });

    await application.save();

    // Increment application count in career
    await Career.findByIdAndUpdate(careerId, { $inc: { applicationCount: 1 } });

    const populatedApplication = await Application.findById(application._id)
      .populate('career', 'title location');

    res.status(201).json({
      success: true,
      message: 'Lamaran berhasil dikirim',
      data: populatedApplication
    });
  } catch (error) {
    console.error('Error submitting application:', error);

    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Data lamaran tidak valid',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal mengirim lamaran',
      error: error.message
    });
  }
};

export const getApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { email } = req.query;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        success: false,
        message: 'ID aplikasi tidak valid'
      });
    }

    const application = await Application.findOne({
      _id: applicationId,
      'applicant.email': email
    }).populate('career', 'title department location');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Aplikasi tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: application._id,
        status: application.status,
        statusDisplay: application.statusDisplay,
        applicationDate: application.applicationDate,
        lastUpdated: application.lastUpdated,
        career: application.career,
        interviewSchedule: application.interviewSchedule
      }
    });
  } catch (error) {
    console.error('Error getting application status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil status aplikasi',
      error: error.message
    });
  }
};

// Admin Controllers
export const getAllApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      careerId,
      search,
      sortBy = 'applicationDate',
      sortOrder = 'desc'
    } = req.query;

    const filters = {};
    
    if (status) filters.status = status;
    if (careerId) filters.career = careerId;
    
    if (search) {
      filters.$or = [
        { 'applicant.fullName': new RegExp(search, 'i') },
        { 'applicant.email': new RegExp(search, 'i') }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const applications = await Application.find(filters)
      .sort(sortOptions)
      .limit(parseInt(limit) * parseInt(page))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('career', 'title department location')
      .populate('updatedBy', 'name email');

    const total = await Application.countDocuments(filters);

    // Get statistics
    const stats = await Application.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      statistics: stats
    });
  } catch (error) {
    console.error('Error getting all applications:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data aplikasi',
      error: error.message
    });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID aplikasi tidak valid'
      });
    }

    const application = await Application.findById(id)
      .populate('career', 'title department location requirements')
      .populate('updatedBy', 'name email')
      .populate('reviewNotes.reviewer', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Aplikasi tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error getting application by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail aplikasi',
      error: error.message
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID aplikasi tidak valid'
      });
    }

    const validStatuses = [
      'submitted', 'reviewing', 'shortlisted', 'interview', 
      'test', 'offered', 'accepted', 'rejected', 'withdrawn'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Aplikasi tidak ditemukan'
      });
    }

    // Update status and add review note
    application.status = status;
    application.lastUpdated = new Date();
    application.updatedBy = req.user.id;

    if (note || rating) {
      application.reviewNotes.push({
        reviewer: req.user.id,
        note,
        rating,
        date: new Date()
      });
    }

    await application.save();

    const updatedApplication = await Application.findById(id)
      .populate('career', 'title department')
      .populate('updatedBy', 'name email')
      .populate('reviewNotes.reviewer', 'name email');

    res.status(200).json({
      success: true,
      message: `Status aplikasi berhasil diubah menjadi ${status}`,
      data: updatedApplication
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengubah status aplikasi',
      error: error.message
    });
  }
};

export const scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, location, interviewer, type, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID aplikasi tidak valid'
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Aplikasi tidak ditemukan'
      });
    }

    const interviewSchedule = {
      date: new Date(date),
      time,
      location,
      interviewer,
      type,
      notes
    };

    await application.scheduleInterview(interviewSchedule);

    const updatedApplication = await Application.findById(id)
      .populate('career', 'title department')
      .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Interview berhasil dijadwalkan',
      data: updatedApplication
    });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menjadwalkan interview',
      error: error.message
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID aplikasi tidak valid'
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Aplikasi tidak ditemukan'
      });
    }

    // Delete uploaded files
    const deleteFile = (filePath) => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    };

    if (application.documents) {
      deleteFile(application.documents.resume?.path);
      deleteFile(application.documents.coverLetter?.path);
      deleteFile(application.documents.portfolio?.path);
      
      if (application.documents.certificates) {
        application.documents.certificates.forEach(cert => {
          deleteFile(cert.path);
        });
      }
    }

    // Decrement application count in career
    await Career.findByIdAndUpdate(
      application.career,
      { $inc: { applicationCount: -1 } }
    );

    await Application.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Aplikasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus aplikasi',
      error: error.message
    });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const { id, documentType } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID aplikasi tidak valid'
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Aplikasi tidak ditemukan'
      });
    }

    const document = application.documents[documentType];
    if (!document || !document.path) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan'
      });
    }

    const filePath = path.resolve(document.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan di server'
      });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${document.filename}"`);
    res.setHeader('Content-Type', document.mimetype);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengunduh dokumen',
      error: error.message
    });
  }
};

export const getApplicationStatistics = async (req, res) => {
  try {
    const { careerId, startDate, endDate } = req.query;
    
    const filters = {};
    if (careerId) filters.career = careerId;
    if (startDate || endDate) {
      filters.applicationDate = {};
      if (startDate) filters.applicationDate.$gte = new Date(startDate);
      if (endDate) filters.applicationDate.$lte = new Date(endDate);
    }

    // Applications by status
    const statusStats = await Application.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Applications by career
    const careerStats = await Application.aggregate([
      { $match: filters },
      {
        $lookup: {
          from: 'careers',
          localField: 'career',
          foreignField: '_id',
          as: 'careerInfo'
        }
      },
      { $unwind: '$careerInfo' },
      {
        $group: {
          _id: '$career',
          title: { $first: '$careerInfo.title' },
          department: { $first: '$careerInfo.department' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Applications timeline
    const timelineStats = await Application.aggregate([
      { $match: filters },
      {
        $group: {
          _id: {
            year: { $year: '$applicationDate' },
            month: { $month: '$applicationDate' },
            day: { $dayOfMonth: '$applicationDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusBreakdown: statusStats,
        careerBreakdown: careerStats,
        timeline: timelineStats
      }
    });
  } catch (error) {
    console.error('Error getting application statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik aplikasi',
      error: error.message
    });
  }
};
