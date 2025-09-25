import Contact from '../models/Contact.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all contacts with filtering and search
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
  const { 
    status, 
    priority, 
    projectType,
    assignedTo,
    search, 
    page = 1, 
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  let filter = {};
  
  if (status && status !== 'all') {
    filter.status = status;
  }
  
  if (priority && priority !== 'all') {
    filter.priority = priority;
  }

  if (projectType && projectType !== 'all') {
    filter.projectType = projectType;
  }

  if (assignedTo && assignedTo !== 'all') {
    filter.assignedTo = assignedTo;
  }

  // Search functionality
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const contacts = await Contact.find(filter)
    .populate('assignedTo', 'email')
    .populate('readBy', 'email')
    .populate('reply.sentBy', 'email')
    .populate('notes.createdBy', 'email')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Contact.countDocuments(filter);

  // Get statistics
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const priorityStats = await Contact.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  const statisticsObj = {
    total: await Contact.countDocuments(),
    unread: stats.find(s => s._id === 'unread')?.count || 0,
    read: stats.find(s => s._id === 'read')?.count || 0,
    replied: stats.find(s => s._id === 'replied')?.count || 0,
    archived: stats.find(s => s._id === 'archived')?.count || 0,
    spam: stats.find(s => s._id === 'spam')?.count || 0,
    priority: {
      low: priorityStats.find(s => s._id === 'low')?.count || 0,
      medium: priorityStats.find(s => s._id === 'medium')?.count || 0,
      high: priorityStats.find(s => s._id === 'high')?.count || 0,
      urgent: priorityStats.find(s => s._id === 'urgent')?.count || 0
    }
  };

  res.json({
    success: true,
    data: contacts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    },
    statistics: statisticsObj
  });
});

// @desc    Get a single contact by ID
// @route   GET /api/contacts/:id
// @access  Private/Admin
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
    .populate('assignedTo', 'email')
    .populate('readBy', 'email')
    .populate('reply.sentBy', 'email')
    .populate('notes.createdBy', 'email');

  if (contact) {
    res.json({
      success: true,
      data: contact
    });
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

// @desc    Create a new contact (Public endpoint for contact form)
// @route   POST /api/contacts
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    subject,
    message,
    projectType
  } = req.body;

  // Get client info
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');

  const contact = new Contact({
    firstName,
    lastName,
    email,
    phone,
    company,
    subject,
    message,
    projectType: projectType || 'lainnya',
    ipAddress,
    userAgent,
    source: 'website-contact'
  });

  const createdContact = await contact.save();

  res.status(201).json({
    success: true,
    data: createdContact,
    message: 'Pesan berhasil dikirim. Tim kami akan menghubungi Anda segera.'
  });
});

// @desc    Update contact status
// @route   PUT /api/contacts/:id/status
// @access  Private/Admin
const updateContactStatus = asyncHandler(async (req, res) => {
  const { status, assignedTo, followUpDate } = req.body;
  
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    contact.status = status || contact.status;
    
    if (assignedTo) {
      contact.assignedTo = assignedTo;
    }
    
    if (followUpDate) {
      contact.followUpDate = new Date(followUpDate);
    }

    // Set readBy if status is changing to read
    if (status === 'read' && contact.status !== 'read') {
      contact.readBy = req.user.id;
      contact.readAt = new Date();
    }

    const updatedContact = await contact.save();

    res.json({
      success: true,
      data: updatedContact,
      message: 'Status contact berhasil diperbarui'
    });
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

// @desc    Update contact priority
// @route   PUT /api/contacts/:id/priority
// @access  Private/Admin
const updateContactPriority = asyncHandler(async (req, res) => {
  const { priority } = req.body;
  
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    contact.priority = priority;
    const updatedContact = await contact.save();

    res.json({
      success: true,
      data: updatedContact,
      message: 'Prioritas contact berhasil diperbarui'
    });
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

// @desc    Add reply to contact
// @route   POST /api/contacts/:id/reply
// @access  Private/Admin
const replyToContact = asyncHandler(async (req, res) => {
  const { message } = req.body;
  
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    contact.reply = {
      message,
      sentAt: new Date(),
      sentBy: req.user.id
    };
    
    // Update status to replied
    contact.status = 'replied';

    const updatedContact = await contact.save();

    res.json({
      success: true,
      data: updatedContact,
      message: 'Balasan berhasil dikirim'
    });
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

// @desc    Add note to contact
// @route   POST /api/contacts/:id/notes
// @access  Private/Admin
const addContactNote = asyncHandler(async (req, res) => {
  const { message } = req.body;
  
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    contact.notes.push({
      message,
      createdBy: req.user.id,
      createdAt: new Date()
    });

    const updatedContact = await contact.save();

    res.json({
      success: true,
      data: updatedContact,
      message: 'Catatan berhasil ditambahkan'
    });
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

// @desc    Update contact tags
// @route   PUT /api/contacts/:id/tags
// @access  Private/Admin
const updateContactTags = asyncHandler(async (req, res) => {
  const { tags } = req.body;
  
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    contact.tags = tags || [];
    const updatedContact = await contact.save();

    res.json({
      success: true,
      data: updatedContact,
      message: 'Tags berhasil diperbarui'
    });
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    await contact.deleteOne();
    res.json({
      success: true,
      message: 'Contact berhasil dihapus'
    });
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

// @desc    Get contact statistics
// @route   GET /api/contacts/stats
// @access  Private/Admin
const getContactStats = asyncHandler(async (req, res) => {
  const totalContacts = await Contact.countDocuments();
  
  const statusStats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const priorityStats = await Contact.aggregate([
    {
      $group: {
        _id: '$priority', 
        count: { $sum: 1 }
      }
    }
  ]);

  const projectTypeStats = await Contact.aggregate([
    {
      $group: {
        _id: '$projectType',
        count: { $sum: 1 }
      }
    }
  ]);

  const recentContacts = await Contact.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('firstName lastName email subject status createdAt');

  const pendingFollowUps = await Contact.find({
    isFollowUpRequired: true,
    followUpDate: { $lte: new Date() },
    status: { $nin: ['replied', 'archived'] }
  }).countDocuments();

  res.json({
    success: true,
    data: {
      total: totalContacts,
      byStatus: statusStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      byPriority: priorityStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      byProjectType: projectTypeStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      recent: recentContacts,
      pendingFollowUps
    }
  });
});

// @desc    Bulk update contacts status
// @route   PUT /api/contacts/bulk-update
// @access  Private/Admin
const bulkUpdateContacts = asyncHandler(async (req, res) => {
  const { contactIds, status, priority, assignedTo } = req.body;
  
  if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
    res.status(400);
    throw new Error('Contact IDs are required');
  }

  const updateData = {};
  if (status) updateData.status = status;
  if (priority) updateData.priority = priority;  
  if (assignedTo) updateData.assignedTo = assignedTo;

  const result = await Contact.updateMany(
    { _id: { $in: contactIds } },
    updateData
  );

  res.json({
    success: true,
    message: `${result.modifiedCount} contacts berhasil diperbarui`,
    data: {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    }
  });
});

export {
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
};
