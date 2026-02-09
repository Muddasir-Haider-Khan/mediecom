const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  instagramLink: { type: String, required: false },
  addedBy: { type: String, required: true },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
