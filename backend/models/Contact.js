const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    lowercase: true,
    trim: true 
  },
  message: { 
    type: String, 
    required: [true, 'Message is required'], 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create index for faster querying if you ever build a dashboard
contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);