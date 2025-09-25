import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama perusahaan harus diisi'],
    trim: true,
    maxlength: [100, 'Nama perusahaan maksimal 100 karakter']
  },
  type: {
    type: String,
    required: [true, 'Jenis perusahaan harus diisi'],
    enum: {
      values: ['parent', 'subsidiary'],
      message: 'Jenis perusahaan harus parent atau subsidiary'
    }
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Deskripsi perusahaan harus diisi'],
    trim: true,
    maxlength: [1000, 'Deskripsi maksimal 1000 karakter']
  },
  address: {
    type: String,
    required: [true, 'Alamat perusahaan harus diisi'],
    trim: true,
    maxlength: [200, 'Alamat maksimal 200 karakter']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Nomor telepon maksimal 20 karakter']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Format email tidak valid'
    ]
  },
  website: {
    type: String,
    trim: true
  },
  establishedYear: {
    type: String,
    trim: true,
    match: [/^\d{4}$/, 'Tahun berdiri harus berformat YYYY']
  },
  director: {
    type: String,
    trim: true,
    maxlength: [100, 'Nama direktur maksimal 100 karakter']
  },
  specialization: {
    type: String,
    trim: true,
    maxlength: [100, 'Spesialisasi maksimal 100 karakter']
  },
  certifications: [{
    type: String,
    trim: true
  }],
  logo: {
    type: String,
    trim: true
  },
  
  // Content fields for About Us and Company Profile
  vision: {
    type: String,
    trim: true,
    maxlength: [500, 'Visi maksimal 500 karakter']
  },
  mission: {
    type: String,
    trim: true,
    maxlength: [1000, 'Misi maksimal 1000 karakter']
  },
  values: [{
    type: String,
    trim: true,
    maxlength: [100, 'Setiap nilai maksimal 100 karakter']
  }],
  history: {
    type: String,
    trim: true,
    maxlength: [2000, 'Sejarah maksimal 2000 karakter']
  },
  achievements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Setiap pencapaian maksimal 200 karakter']
  }],
  services: [{
    type: String,
    trim: true,
    maxlength: [100, 'Setiap layanan maksimal 100 karakter']
  }],
  
  // Fields specific to subsidiaries
  projectTypes: [{
    type: String,
    trim: true,
    maxlength: [100, 'Setiap jenis proyek maksimal 100 karakter']
  }],
  clientTypes: [{
    type: String,
    trim: true,
    maxlength: [100, 'Setiap jenis klien maksimal 100 karakter']
  }],
  expertise: [{
    type: String,
    trim: true,
    maxlength: [100, 'Setiap keahlian maksimal 100 karakter']
  }],
  companySize: {
    type: String,
    trim: true,
    maxlength: [50, 'Ukuran perusahaan maksimal 50 karakter']
  },
  yearlyRevenue: {
    type: String,
    trim: true,
    maxlength: [50, 'Pendapatan tahunan maksimal 50 karakter']
  },
  
  // Status and metadata
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
companySchema.index({ name: 'text', description: 'text', specialization: 'text' });
companySchema.index({ type: 1, isActive: 1 });
companySchema.index({ sortOrder: 1 });

// Virtual for formatted established year
companySchema.virtual('establishedYearFormatted').get(function() {
  return this.establishedYear ? `Sejak ${this.establishedYear}` : '';
});

// Virtual for company type label
companySchema.virtual('typeLabel').get(function() {
  return this.type === 'parent' ? 'Perusahaan Induk' : 'Anak Perusahaan';
});

// Pre-save middleware to generate slug
companySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  }
  next();
});

// Static method to get parent company
companySchema.statics.getParentCompany = function() {
  return this.findOne({ type: 'parent', isActive: true });
};

// Static method to get subsidiaries
companySchema.statics.getSubsidiaries = function() {
  return this.find({ type: 'subsidiary', isActive: true }).sort({ sortOrder: 1, name: 1 });
};

// Static method to get company by slug
companySchema.statics.getBySlug = function(slug) {
  return this.findOne({ slug: slug, isActive: true });
};

// Instance method to update sort order
companySchema.methods.updateSortOrder = function(newOrder) {
  this.sortOrder = newOrder;
  return this.save();
};

const Company = mongoose.model('Company', companySchema);

export default Company;
