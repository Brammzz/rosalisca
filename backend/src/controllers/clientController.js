import Client from '../models/Client.js';
import asyncHandler from 'express-async-handler';
import path from 'path';
import fs from 'fs';

// Helper function to delete old logo file
const deleteOldLogo = (logoPath) => {
  if (logoPath && logoPath !== '') {
    const fullPath = path.join(process.cwd(), 'uploads', path.basename(logoPath));
    fs.unlink(fullPath, (err) => {
      if (err) console.error('Error deleting old logo:', err);
    });
  }
};

// @desc    Get all clients with filtering and search
// @route   GET /api/clients
// @access  Public
const getClients = asyncHandler(async (req, res) => {
  try {
    const { category, search, status, limit } = req.query;

    // Build filter object
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Client query filter:', filter);
    console.log('Client query limit:', limit);

    let query = Client.find(filter).sort({ createdAt: -1 });
    
    // Apply limit if provided
    if (limit && !isNaN(parseInt(limit))) {
      query = query.limit(parseInt(limit));
    }

    const clients = await query;
    console.log('Found clients:', clients.length);

    const total = await Client.countDocuments(filter);

    // Get statistics
    const stats = await Client.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalProjects: { $sum: '$projectCount' }
        }
      }
    ]);

    const statisticsObj = {
      total: await Client.countDocuments({ status: 'active' }),
    government: stats.find(s => s._id === 'government')?.count || 0,
    private: stats.find(s => s._id === 'private')?.count || 0,
    bumn: stats.find(s => s._id === 'state-owned')?.count || 0,
    international: stats.find(s => s._id === 'international')?.count || 0,
    totalProjects: stats.reduce((acc, s) => acc + s.totalProjects, 0)
  };

  res.json({
    success: true,
    data: clients,
    pagination: {
      page: 1,
      limit: clients.length,
      total,
      pages: 1
    },
    statistics: statisticsObj
  });

  } catch (error) {
    console.error('Error in getClients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: error.message
    });
  }
});

// @desc    Get a single client by ID
// @route   GET /api/clients/:id
// @access  Public
const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (client) {
    res.json({
      success: true,
      data: client
    });
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private/Admin
const createClient = asyncHandler(async (req, res) => {
  console.log('Creating client - req.body:', req.body);
  console.log('Creating client - req.file:', req.file);
  
  let {
    name,
    description,
    category,
    logo,
    website,
    contactInfo,
    industry,
    establishedYear,
    revenue,
    employeeCount,
    tags,
    notes
  } = req.body;

  // Parse JSON strings if they exist (from FormData)
  if (typeof contactInfo === 'string') {
    try {
      contactInfo = JSON.parse(contactInfo);
    } catch (e) {
      contactInfo = {};
    }
  }

  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (e) {
      tags = [];
    }
  }

  // Check if client with same name already exists
  const clientExists = await Client.findOne({ 
    name: { $regex: new RegExp(name, 'i') } 
  });

  if (clientExists) {
    res.status(400);
    throw new Error('Client with this name already exists');
  }

  // Handle file upload
  let logoPath = logo || '';
  if (req.file) {
    logoPath = `/uploads/${req.file.filename}`;
  }

  const client = new Client({
    name,
    description,
    category: category || 'government', 
    logo: logoPath,
    website,
    contactInfo: contactInfo || {},
    industry,
    establishedYear: establishedYear ? parseInt(establishedYear) : undefined,
    revenue,
    employeeCount,
    tags: tags || [],
    notes
  });

  const createdClient = await client.save();

  res.status(201).json({
    success: true,
    data: createdClient,
    message: 'Client created successfully'
  });
});

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private/Admin
const updateClient = asyncHandler(async (req, res) => {
  let {
    name,
    description,
    category,
    logo,
    website,
    contactInfo,
    industry,
    establishedYear,
    revenue,
    employeeCount,
    tags,
    notes,
    status,
    satisfaction
  } = req.body;

  // Parse JSON strings if they exist (from FormData)
  if (typeof contactInfo === 'string') {
    try {
      contactInfo = JSON.parse(contactInfo);
    } catch (e) {
      contactInfo = {};
    }
  }

  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (e) {
      tags = [];
    }
  }

  if (typeof satisfaction === 'string') {
    try {
      satisfaction = JSON.parse(satisfaction);
    } catch (e) {
      satisfaction = {};
    }
  }

  const client = await Client.findById(req.params.id);

  if (client) {
    // Check if name is being changed and if it conflicts with existing client
    if (name && name !== client.name) {
      const nameExists = await Client.findOne({ 
        name: { $regex: new RegExp(name, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (nameExists) {
        res.status(400);
        throw new Error('Client with this name already exists');
      }
    }

    // Handle file upload and old logo deletion
    if (req.file) {
      // Delete old logo if it exists and is different
      if (client.logo && client.logo !== `/uploads/${req.file.filename}`) {
        deleteOldLogo(client.logo);
      }
      client.logo = `/uploads/${req.file.filename}`;
    }

    client.name = name || client.name;
    client.description = description || client.description;
    client.category = category || client.category;
    client.website = website || client.website;
    client.contactInfo = contactInfo || client.contactInfo;
    client.industry = industry || client.industry;
    client.establishedYear = establishedYear ? parseInt(establishedYear) : client.establishedYear;
    client.revenue = revenue || client.revenue;
    client.employeeCount = employeeCount || client.employeeCount;
    client.tags = tags !== undefined ? tags : client.tags;
    client.notes = notes || client.notes;
    client.status = status || client.status;
    client.satisfaction = satisfaction || client.satisfaction;

    const updatedClient = await client.save();

    res.json({
      success: true,
      data: updatedClient,
      message: 'Client updated successfully'
    });
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (client) {
    // Delete associated logo file
    if (client.logo) {
      deleteOldLogo(client.logo);
    }
    
    await client.deleteOne();
    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

// @desc    Update client project count
// @route   PUT /api/clients/:id/project-count
// @access  Private/Admin
const updateClientProjectCount = asyncHandler(async (req, res) => {
  const { increment = true } = req.body;
  
  const client = await Client.findById(req.params.id);

  if (client) {
    if (increment) {
      client.projectCount += 1;
      client.lastProjectDate = new Date();
    } else if (client.projectCount > 0) {
      client.projectCount -= 1;
    }

    const updatedClient = await client.save();

    res.json({
      success: true,
      data: updatedClient,
      message: 'Client project count updated successfully'
    });
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

// @desc    Get client statistics
// @route   GET /api/clients/stats
// @access  Private/Admin
const getClientStats = asyncHandler(async (req, res) => {
  const totalClients = await Client.countDocuments({ status: 'active' });
  
  const categoryStats = await Client.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalProjects: { $sum: '$projectCount' },
        avgSatisfaction: { $avg: '$satisfaction.rating' }
      }
    }
  ]);

  const recentClients = await Client.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name category createdAt projectCount');

  const topClients = await Client.find({ status: 'active' })
    .sort({ projectCount: -1 })
    .limit(10)
    .select('name category projectCount satisfaction.rating');

  res.json({
    success: true,
    data: {
      total: totalClients,
      byCategory: categoryStats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          totalProjects: stat.totalProjects,
          avgSatisfaction: stat.avgSatisfaction || 0
        };
        return acc;
      }, {}),
      recent: recentClients,
      topClients: topClients
    }
  });
});

export {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  updateClientProjectCount,
  getClientStats,
};
