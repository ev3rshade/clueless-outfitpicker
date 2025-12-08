import mongoose from "mongoose";

const outfitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imagePrompt: { type: String, required: true },
  outfitImage: { type: String, required: true },
  items: { type: Array, required: true },
});

const Outfit = mongoose.model('Outfit', outfitSchema);

export default Outfit;