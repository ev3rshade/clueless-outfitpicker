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
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors(
  
));
app.use(express.json());

// gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ----------------- MONGO CONNECTION -----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const upload = multer({ storage: multer.memoryStorage() });

// ----------------- AUTH -----------------
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ----------------- GEMINI HELPERS -----------------

async function callGeminiJSON(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    return response.text;

  } catch (err) {
    console.error("❌ Gemini JSON Error:", err.response?.data || err);
    throw new Error("Gemini JSON generation failed");
  }
}

async function callGeminiImage(prompt) {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: prompt,
      }
    );

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log(part.text);
        console.error("❌ Gemini Returned text");
        throw new Error("Gemini returned text instead of an image");
      
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        console.log("image received" + imageData);
        return imageData;

      }
    }

  } catch (err) {
    console.error("❌ Gemini Image Error:", err.response?.data || err);
    throw new Error("Gemini image generation failed");
  }
}

// ----------------- SIGNUP -----------------
app.post("/signup", async (req, res) => {
  try {
    const { email, name, age, password } = req.body;

    if (!email || !name || !age || !password)
      return res.status(400).json({ error: "All fields required" });

    const existingEmail = await User.findOne({ email });
    //const existingUsername = await User.findOne({ username });

    if (existingEmail) return res.status(400).json({ error: "Email already in use" });
    //if (existingUsername) return res.status(400).json({ error: "Username already in use" });

    const user = new User({
      email,
      name,
      age,
      password: await bcrypt.hash(password, 10),
    });

    await user.save();
    res.status(201).json({ message: "Signup successful!" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- LOGIN -----------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        email: user.email,
        name: user.name,
        age: user.age,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- ACCOUNT -----------------
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

// ----------------- OUTFIT GENERATION -----------------
app.post("/outfit", async (req, res) => {
  try {
    const { prompt, requirements } = req.body;

    const geminiPrompt = `
      You analyze a text prompt and a list of requirements.
      Recommend a full outfit.
      Respond ONLY in valid JSON:
      Outfit details:
      ${requirements.join("\n")}
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

// ----------------- WARDROBE -----------------
app.get("/wardrobe", authMiddleware, async (req, res) => {
  try {
    const items = await Cloth.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json({ items });
  } catch (err) {
    console.error("Wardrobe fetch error:", err);
    res.status(500).json({ error: "Could not fetch wardrobe items" });
  }
});

app.post("/wardrobe", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { category, color, occasion, weather, description } = req.body;
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    // Check file size (16MB = 16 * 1024 * 1024 bytes)
    const maxSize = 16 * 1024 * 1024; // 16MB in bytes
    if (req.file.size > maxSize) {
      return res.status(400).json({ error: "Image size must be less than 16MB" });
    }

    const base64 = req.file.buffer.toString("base64");
    const imageData = `data:${req.file.mimetype};base64,${base64}`;

    const cloth = await Cloth.create({
      userId: req.user.id,
      imageData,
      category,
      color,
      occasion,
      weather,
      description,
    });

    res.status(201).json({ cloth });
  } catch (err) {
    console.error("Wardrobe upload error:", err);
    res.status(500).json({ error: "Could not upload wardrobe item" });
  }
});

app.put("/wardrobe/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, color, occasion, weather, description } = req.body;

    // Validate that the item exists and belongs to the user
    const cloth = await Cloth.findOne({ _id: id, userId: req.user.id });
    if (!cloth) {
      return res.status(404).json({ error: "Wardrobe item not found" });
    }

    // Update the item with new tags
    const updatedCloth = await Cloth.findByIdAndUpdate(
      id,
      {
        category: category?.toLowerCase(),
        color: color?.toLowerCase(),
        occasion: occasion?.toLowerCase(),
        weather: weather?.toLowerCase(),
        description,
      },
      { new: true } 
    );

    res.json({ 
      message: "Wardrobe item updated successfully",
      cloth: updatedCloth 
    });
  } catch (err) {
    console.error("Wardrobe edit error:", err);
    res.status(500).json({ error: "Could not update wardrobe item" });
  }
});

app.delete("/wardrobe/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that the item exists and belongs to the user
    const cloth = await Cloth.findOne({ _id: id, userId: req.user.id });
    if (!cloth) {
      return res.status(404).json({ error: "Wardrobe item not found" });
    }

    // Delete the item
    await Cloth.findByIdAndDelete(id);

    res.json({ message: "Wardrobe item deleted successfully" });
  } catch (err) {
    console.error("Wardrobe delete error:", err);
    res.status(500).json({ error: "Could not delete wardrobe item" });
  }
});


// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);