import mongoose from 'mongoose';



const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    enum: ['Rosalisca Group', 'PT John dan Ro', 'PT Gunung Sahid', 'PT Arimada Persada'],
    default: 'Rosalisca Group',
  },
  category: {
    type: String,
    required: true,
    enum: ['general-contractor', 'civil-engineering', 'supplier', 'microtunnelling', 'drainage-system', 'wastewater-pipeline'],
  },
  year: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL to the main image
    required: true,
  },
  gallery: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    required: true,
    enum: ['completed', 'ongoing', 'planned'],
    default: 'planned',
  },
  client: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },

}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
