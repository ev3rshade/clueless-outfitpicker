const mongoose = require('mongoose'); 

const clothSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // tags is a list of strings describing the cloth like color, type, pattern etc.
  tags: { type: [String], required: true },
  image: { type: String, required: true },
  // Add other fields as needed
});

const Cloth = mongoose.model('Cloth', clothSchema);

module.exports = Cloth;