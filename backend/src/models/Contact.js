import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Nama depan harus diisi'],
    trim: true,
    maxlength: [50, 'Nama depan maksimal 50 karakter']
  },
  lastName: {
    type: String,
    required: [true, 'Nama belakang harus diisi'],
    trim: true,
    maxlength: [50, 'Nama belakang maksimal 50 karakter']
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Format email tidak valid'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Nomor telepon harus diisi'],
    trim: true
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Nama perusahaan maksimal 100 karakter']
  },
  subject: {
    type: String,
    required: [true, 'Subjek harus diisi'],
    trim: true,
    maxlength: [200, 'Subjek maksimal 200 karakter']
  },
  message: {
    type: String,
    required: [true, 'Pesan harus diisi'],
    trim: true,
    maxlength: [2000, 'Pesan maksimal 2000 karakter']
  },
  projectType: {
    type: String,
    enum: [
      'konstruksi-umum', 
      'microtunnelling', 
      'pile-foundation', 
      'piling-work', 
      'dewatering', 
      'konsultasi', 
      'lainnya'
    ],
    default: 'lainnya'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied', 'archived', 'spam'],
    default: 'unread'
  },
  source: {
    type: String,
    enum: ['website-contact', 'website-career', 'phone', 'email', 'social-media', 'referral'],
    default: 'website-contact'
  },
  isFollowUpRequired: {
    type: Boolean,
    default: true
  },
  followUpDate: {
    type: Date
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reply: {
    message: String,
    sentAt: Date,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  notes: [{
    message: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  ipAddress: String,
  userAgent: String,
  readAt: Date,
  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual untuk nama lengkap
contactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual untuk kategori prioritas
contactSchema.virtual('priorityLabel').get(function() {
  const labels = {
    low: 'Rendah',
    medium: 'Sedang', 
    high: 'Tinggi',
    urgent: 'Mendesak'
  };
  return labels[this.priority] || 'Sedang';
});

// Virtual untuk label status
contactSchema.virtual('statusLabel').get(function() {
  const labels = {
    unread: 'Belum Dibaca',
    read: 'Sudah Dibaca',
    replied: 'Sudah Dibalas',
    archived: 'Diarsipkan',
    spam: 'Spam'
  };
  return labels[this.status] || 'Belum Dibaca';
});

// Index untuk pencarian
contactSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text', 
  subject: 'text', 
  message: 'text',
  company: 'text'
});

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ assignedTo: 1 });

// Middleware untuk set readAt ketika status berubah menjadi read
contactSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'read' && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
