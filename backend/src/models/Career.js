import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  location: {
    type: String,
    required: true
  },

  experienceLevel: {
    type: String,
    required: true,
    enum: ['Lulus SMA', 'Fresh Graduate', '1-2 tahun', '3-5 tahun', '5+ tahun', '10+ tahun']
  },
  salaryRange: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'IDR'
    }
  },
  description: {
    type: String,
    required: true
  },


  qualifications: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  skills: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'archived'],
    default: 'draft'
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  closeDate: {
    type: Date,
    required: true
  },
  applicationDeadline: {
    type: Date
  },
  contactEmail: {
    type: String,
    default: 'hr@rosalisca.com'
  },
  contactPhone: {
    type: String
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  remoteWork: {
    type: Boolean,
    default: false
  },
  urgentHiring: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index untuk optimasi pencarian
careerSchema.index({ title: 'text', description: 'text' });
careerSchema.index({ status: 1, publishDate: -1 });
careerSchema.index({ department: 1, location: 1 });

// Middleware untuk update applicationCount
careerSchema.methods.incrementApplicationCount = function() {
  this.applicationCount += 1;
  return this.save();
};

careerSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Virtual untuk status yang user-friendly
careerSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'draft': 'Draft',
    'active': 'Aktif',
    'closed': 'Tutup',
    'archived': 'Arsip'
  };
  return statusMap[this.status] || this.status;
});

// Virtual untuk format salary
careerSchema.virtual('salaryDisplay').get(function() {
  if (this.salaryRange.min === 0 && this.salaryRange.max === 0) {
    return 'Negosiasi';
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: this.salaryRange.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (this.salaryRange.min === this.salaryRange.max) {
    return formatCurrency(this.salaryRange.min);
  }
  
  return `${formatCurrency(this.salaryRange.min)} - ${formatCurrency(this.salaryRange.max)}`;
});

// Static method untuk pencarian
careerSchema.statics.findPublicJobs = function(filters = {}) {
  const query = { status: 'active' };
  
  if (filters.department) {
    query.department = filters.department;
  }
  
  if (filters.location) {
    query.location = new RegExp(filters.location, 'i');
  }
  
  if (filters.jobType) {
    query.jobType = filters.jobType;
  }
  
  if (filters.experienceLevel) {
    query.experienceLevel = filters.experienceLevel;
  }
  
  if (filters.search) {
    query.$or = [
      { title: new RegExp(filters.search, 'i') },
      { description: new RegExp(filters.search, 'i') },
      { requirements: { $in: [new RegExp(filters.search, 'i')] } }
    ];
  }
  
  return this.find(query)
    .sort({ featured: -1, publishDate: -1 })
    .populate('createdBy', 'name email');
};

// Pre-save middleware
careerSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'active' && !this.publishDate) {
    this.publishDate = new Date();
  }
  next();
});

// Middleware to delete associated applications when a career is deleted
careerSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    console.log(`Deleting applications for career: ${this._id}`);
    // 'this' refers to the document being removed
    await mongoose.model('Application').deleteMany({ career: this._id });
    console.log(`Successfully deleted applications for career: ${this._id}`);
    next();
  } catch (error) {
    console.error(`Error deleting applications for career ${this._id}:`, error);
    next(error);
  }
});

const Career = mongoose.model('Career', careerSchema);

export default Career;
