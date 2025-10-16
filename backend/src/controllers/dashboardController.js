import Project from '../models/Project.js';
import Client from '../models/Client.js';
import Contact from '../models/Contact.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import Career from '../models/Career.js';
import Certificate from '../models/Certificate.js';
import mongoose from 'mongoose';

// Get dashboard overview statistics
export const getDashboardOverview = async (req, res) => {
  try {
    // Get basic counts
    const [
      totalProjects,
      totalClients,
      totalContacts,
      totalApplications,
      totalUsers,
      totalCareers,
      totalCertificates
    ] = await Promise.all([
      Project.countDocuments(),
      Client.countDocuments(),
      Contact.countDocuments(),
      Application.countDocuments(),
      User.countDocuments(),
      Career.countDocuments(),
      Certificate.countDocuments()
    ]);

    res.json({
      totalProjects,
      totalClients,
      totalContacts,
      totalApplications,
      totalUsers,
      totalCareers,
      totalCertificates
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

// Get projects statistics for charts
export const getProjectsStats = async (req, res) => {
  try {
    // Projects by status
    const projectsByStatus = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Projects by category
    const projectsByCategory = await Project.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Projects by company
    const projectsByCompany = await Project.aggregate([
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          company: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Projects by year (last 5 years)
    const currentYear = new Date().getFullYear();
    const projectsByYear = await Project.aggregate([
      {
        $match: {
          year: {
            $gte: (currentYear - 4).toString(),
            $lte: currentYear.toString()
          }
        }
      },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          year: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { year: 1 }
      }
    ]);

    res.json({
      projectsByStatus,
      projectsByCategory,
      projectsByCompany,
      projectsByYear
    });
  } catch (error) {
    console.error('Error fetching projects statistics:', error);
    res.status(500).json({ message: 'Error fetching projects statistics', error: error.message });
  }
};

// Get contacts statistics
export const getContactsStats = async (req, res) => {
  try {
    // Contacts by month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const contactsByMonth = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          month: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: 1
            }
          },
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { month: 1 }
      }
    ]);

    res.json({
      contactsByMonth
    });
  } catch (error) {
    console.error('Error fetching contacts statistics:', error);
    res.status(500).json({ message: 'Error fetching contacts statistics', error: error.message });
  }
};

// Get applications statistics
export const getApplicationsStats = async (req, res) => {
  try {
    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Applications by month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const applicationsByMonth = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          month: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: 1
            }
          },
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { month: 1 }
      }
    ]);

    res.json({
      applicationsByStatus,
      applicationsByMonth
    });
  } catch (error) {
    console.error('Error fetching applications statistics:', error);
    res.status(500).json({ message: 'Error fetching applications statistics', error: error.message });
  }
};

// Get certificates statistics
export const getCertificatesStats = async (req, res) => {
  try {
    // Certificates by company
    const certificatesByCompany = await Certificate.aggregate([
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          company: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Certificates by year
    const certificatesByYear = await Certificate.aggregate([
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          year: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { year: 1 }
      }
    ]);

    res.json({
      certificatesByCompany,
      certificatesByYear
    });
  } catch (error) {
    console.error('Error fetching certificates statistics:', error);
    res.status(500).json({ message: 'Error fetching certificates statistics', error: error.message });
  }
};

// Get recent activities
export const getRecentActivities = async (req, res) => {
  try {
    // Get recent projects (last 5)
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title company createdAt');

    // Get recent contacts (last 5)
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name subject createdAt');

    // Get recent applications (last 5)
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name position status createdAt');

    res.json({
      recentProjects,
      recentContacts,
      recentApplications
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Error fetching recent activities', error: error.message });
  }
};
