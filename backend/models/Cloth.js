import mongoose from "mongoose";

const clothSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // store image as base64 string
    imageData: { type: String, required: true }, // e.g. "data:image/png;base64,...."

    category: {
      type: String,
      enum: ["tops", "bottoms", "one-piece", "outerwear", "accessories", "shoes"],
      required: true,
    },
    color: {
      type: String,
      enum: ["red", "orange", "yellow", "green", "blue", "purple", "pink", "black", "white", "grey", "mixed"],
      required: true,
    },
    occasion: {
      type: String,
      enum: ["business casual", "formal", "black tie", "casual", "ethnic", "leisure"],
      required: true,
    },
    weather: {
      type: String,
      enum: ["summer", "winter", "fall", "spring"],
      required: true,
    },
    description: String,
  },
  { timestamps: true }
);

const Cloth = mongoose.model("Cloth", clothSchema);
export default Cloth;