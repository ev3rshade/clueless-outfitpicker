import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import multer from "multer";
import axios from "axios";
import User from "./models/User.js";
import Outfit from "./models/Outfit.js";
import Cloth from "./models/Cloth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_KEY = process.env.GEMINI_API_KEY;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const upload = multer({ storage: multer.memoryStorage() });


function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.post("/signup", async (req, res) => {
  try {
    const { email, username, name, age, password } = req.body;

    if (!email || !username || !name || !age || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) return res.status(400).json({ error: "Email already in use" });
    if (existingUsername) return res.status(400).json({ error: "Username already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      username,
      name,
      age,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({ message: "Signup successful!" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Email not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        email: user.email,
        username: user.username,
        name: user.name,
        age: user.age,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/account", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });

  } catch (err) {
    console.error("Account error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/outfit", async (req, res) => {
  try {
    const { prompt, requirements } = req.body;

    const geminiPrompt = `
      You analyze a text prompt and a list of requirements.
      Identify clothing pieces the user owns based on the images.
      Recommend a full outfit.

      Respond ONLY in clean JSON, like this:

      {
        "items": [
          { "name": "", "pieces": [], "notes": "" }
        ],
        "imagePrompt": "describe the outfit visually"
      }
    `;

    const responseText = await callGeminiJSON(geminiPrompt + "\n" + prompt, requirements);
    const outfit = JSON.parse(responseText);


    const imagePrompt = `
      Create a hyperrealistic full-body outfit image.

      Outfit items:
      ${outfit.items.map((i) => "- " + i.name).join("\n")}

      Additional style direction:
      ${outfit.imagePrompt}

      Requirements:
      - white background
      - fashion editorial lighting
      - extremely high detail
    `;

    const base64Image = await callGeminiImage(imagePrompt);

    res.json({
      success: true,
      outfit,
      outfitImage: base64Image,
    });

  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Could not generate outfit." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
