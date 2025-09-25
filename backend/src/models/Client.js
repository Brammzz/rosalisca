import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['government', 'private', 'bumn', 'international', 'state-owned'],
    default: 'government',
  },
  logo: {
    type: String, // URL to the logo image
    required: true,
  },
  website: {
    type: String,
    trim: true,
  },
  projectCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
  },
  industry: {
    type: String,
    trim: true,
  },
  establishedYear: {
    type: Number,
  },
  revenue: {
    type: String,
  },
  employeeCount: {
    type: String,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  notes: {
    type: String,
  },
  lastProjectDate: {
    type: Date,
  },
  satisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: String,
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted project count
clientSchema.virtual('formattedProjectCount').get(function() {
  if (this.projectCount === 0) return 'Belum ada proyek';
  if (this.projectCount === 1) return '1 proyek';
  return `${this.projectCount} proyek`;
});

// Index for search functionality
clientSchema.index({ name: 'text', description: 'text' });
clientSchema.index({ category: 1, status: 1 });

const Client = mongoose.model('Client', clientSchema);

export default Client;
