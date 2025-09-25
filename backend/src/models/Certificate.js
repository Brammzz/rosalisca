import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Quality Management', 'Professional Competency', 'Safety Certification', 'Safety', 'Environmental', 'ISO Certification', 'Other'],
    default: 'Other',
  },
  image: {
    type: String, // URL to the certificate image
    required: true,
  },
  issuer: {
    type: String,
    trim: true,
  },
  issueDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  certificateNumber: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'suspended'],
    default: 'active',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  notes: {
    type: String,
  },
  subsidiary: {
    type: String,
    trim: true,
    enum: ['ROSALISCA GROUP', 'PT. ARIMADA PERSADA', 'PT. GUNUNG SAHID', 'PT. JOHN DAN RO'],
    default: 'ROSALISCA GROUP'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for status badge color
certificateSchema.virtual('statusBadgeColor').get(function() {
  switch (this.status) {
    case 'active': return 'default';
    case 'expired': return 'destructive';
    case 'suspended': return 'secondary';
    default: return 'default';
  }
});

// Index for search functionality
certificateSchema.index({ title: 'text', description: 'text', issuer: 'text' });
certificateSchema.index({ type: 1, status: 1 });
certificateSchema.index({ subsidiary: 1 });

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
