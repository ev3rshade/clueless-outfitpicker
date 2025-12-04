import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePic: String,
  recentSearches: { type: [String], default: [] },
  savedOutfits: {
    type: [
      {
        name: String,
        image: String,
      },
    ],
    default: [],
  },
});

const User = mongoose.model("User", UserSchema);

export default User;