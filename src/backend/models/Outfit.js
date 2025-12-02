const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  // Add other fields as needed
});

const Outfit = mongoose.model('Outfit', outfitSchema);

module.exports = Outfit;