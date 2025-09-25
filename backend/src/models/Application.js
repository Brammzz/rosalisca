import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  career: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    required: true
  },
  applicant: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: {
        type: String,
        default: 'Indonesia'
      }
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'prefer-not-to-say'],
      default: 'prefer-not-to-say'
    }
  },
  documents: {
    resume: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    },
    coverLetter: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    },
    portfolio: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    },
    certificates: [{
      name: String,
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }]
  },
  experience: {
    totalYears: {
      type: Number,
      default: 0
    },
    currentPosition: String,
    currentCompany: String,
    previousPositions: [{
      position: String,
      company: String,
      duration: String,
      description: String,
      startDate: Date,
      endDate: Date,
      isCurrent: {
        type: Boolean,
        default: false
      }
    }]
  },
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    major: String,
    graduationYear: Number,
    gpa: Number,
    maxGpa: Number
  }],
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    }
  }],
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced', 'native'],
      default: 'intermediate'
    }
  }],
  motivation: {
    type: String,
    maxlength: 1000
  },
  expectedSalary: {
    amount: Number,
    currency: {
      type: String,
      default: 'IDR'
    },
    negotiable: {
      type: Boolean,
      default: true
    }
  },
  availabilityDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: [
      'submitted',      // Baru dikirim
      'reviewing',      // Sedang direview
      'shortlisted',    // Masuk shortlist
      'interview',      // Tahap interview
      'test',          // Tahap tes
      'offered',       // Ditawarkan posisi
      'accepted',      // Diterima
      'rejected',      // Ditolak
      'withdrawn'      // Pelamar mengundurkan diri
    ],
    default: 'submitted'
  },
  reviewNotes: [{
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    note: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  interviewSchedule: {
    date: Date,
    time: String,
    location: String,
    interviewer: String,
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person'],
      default: 'in-person'
    },
    notes: String
  },
  source: {
    type: String,
    enum: ['website', 'email', 'referral', 'job-portal', 'social-media'],
    default: 'website'
  },
  referredBy: {
    type: String
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index untuk optimasi
applicationSchema.index({ career: 1, status: 1 });
applicationSchema.index({ 'applicant.email': 1 });
applicationSchema.index({ applicationDate: -1 });
applicationSchema.index({ status: 1, applicationDate: -1 });

// Virtual untuk status display
applicationSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'submitted': 'Dikirim',
    'reviewing': 'Direview',
    'shortlisted': 'Shortlist',
    'interview': 'Interview',
    'test': 'Tes',
    'offered': 'Ditawarkan',
    'accepted': 'Diterima',
    'rejected': 'Ditolak',
    'withdrawn': 'Dibatalkan'
  };
  return statusMap[this.status] || this.status;
});

// Methods
applicationSchema.methods.updateStatus = function(newStatus, reviewer, note) {
  this.status = newStatus;
  this.lastUpdated = new Date();
  this.updatedBy = reviewer;
  
  if (note) {
    this.reviewNotes.push({
      reviewer,
      note,
      date: new Date()
    });
  }
  
  return this.save();
};

applicationSchema.methods.scheduleInterview = function(schedule) {
  this.interviewSchedule = schedule;
  this.status = 'interview';
  this.lastUpdated = new Date();
  return this.save();
};

// Static methods
applicationSchema.statics.getApplicationStats = function(careerId) {
  return this.aggregate([
    { $match: { career: mongoose.Types.ObjectId(careerId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

applicationSchema.statics.getRecentApplications = function(limit = 10) {
  return this.find()
    .populate('career', 'title department')
    .sort({ applicationDate: -1 })
    .limit(limit);
};

// Pre-save middleware
applicationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Post-save middleware untuk update application count di Career
applicationSchema.post('save', async function(doc) {
  if (this.isNew) {
    await mongoose.model('Career').findByIdAndUpdate(
      doc.career,
      { $inc: { applicationCount: 1 } }
    );
  }
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
