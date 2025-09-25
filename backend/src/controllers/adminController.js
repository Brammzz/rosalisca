import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import Client from '../models/Client.js';
import Contact from '../models/Contact.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import Career from '../models/Career.js';
import Company from '../models/Company.js';

// @desc    Get dashboard overview data
// @route   GET /api/admin/overview
// @access  Private/Admin
const getDashboardOverview = asyncHandler(async (req, res) => {
  const totalProjects = await Project.countDocuments({});
  const totalClients = await Client.countDocuments({});
  const totalContacts = await Contact.countDocuments({});
  const totalApplications = await Application.countDocuments({});
  const totalUsers = await User.countDocuments({});
  const totalCareers = await Career.countDocuments({});
  const totalCertificates = await Certificate.countDocuments({});
  const totalCompanies = await Company.countDocuments({});

  res.json({
    totalProjects,
    totalClients,
    totalContacts,
    totalApplications,
    totalUsers,
    totalCareers,
    totalCertificates,
    totalCompanies,
  });
});

export {
  getDashboardOverview,
};
