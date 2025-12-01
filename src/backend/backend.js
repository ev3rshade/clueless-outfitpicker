import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  age: Number,
  email: { type: String, unique: true },
  password: String,
  profilePic: String, // URL
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

const User = mongoose.model("User", userSchema);

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


const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

/* ---------------------------------------------------------
   ShopStyle API search
---------------------------------------------------------- */
async function getShopStyleLink(query) {
  const apiKey = process.env.SHOPSTYLE_API_KEY;

  try {
    const response = await axios.get("https://api.shopstyle.com/api/v2/products", {
      params: {
        pid: apiKey,
        fts: query,
        limit: 1
      }
    });

    if (response.data.products?.length > 0) {
      return response.data.products[0].clickUrl;
    }

    return null;
  } catch (err) {
    console.error("ShopStyle API error:", err);
    return null;
  }
}

// MAY UPDATE TO USING AXIOS INSTEAD LIKE WE HAVE IN CLASS
/* ---------------------------------------------------------
   POST /outfit - Outfit generation from a prompt
---------------------------------------------------------- */
app.post("/outfit", upload.array("images"), async (req, res) => {
  const { prompt } = req.body;
  const images = req.files || [];

  try {
    // Convert images to base64 for AI
    const imageInputs = images.map(file => ({
      type: "input_image",
      image: Buffer.from(file.buffer).toString("base64"),
    }));

    // TODO HOW DO WE DETERMINE IF AN ITEM IS OWNED??
    /* -----------------------------------------------------
       Generate outfit JSON description
    ------------------------------------------------------ */
    const textResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You analyze the user's wardrobe images + text.
            Identify what clothes they own.
            Create an outfit.

            Respond ONLY in JSON:
            {
              "items": [
                { "name": "", "owned": true/false, "notes": "" }
              ],
              "imagePrompt": "visual description for image generator"
            }
          `
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...imageInputs
          ]
        }
      ]
    });

    const outfit = JSON.parse(textResponse.choices[0].message.content);

    /* -----------------------------------------------------
       Add ShopStyle links for missing items
    ------------------------------------------------------ */
    for (let item of outfit.items) {
      if (!item.owned) {
        item.shoppingLink = await getShopStyleLink(item.name + " clothing");
      }
    }

    /* -----------------------------------------------------
       Generate the outfit IMAGE
    ------------------------------------------------------ */
    const img = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `
        Create a high-quality fashion editorial style image.
        The outfit includes:
        ${outfit.items.map(i => "- " + i.name).join("\n")}
        
        Additional description:
        ${outfit.imagePrompt}

        Requirements:
        - full-body outfit display
        - clean white background
        - hyperrealistic
      `,
      size: "1024x1024"
    });

    // OpenAI returns base64 image
    const outfitImageBase64 = img.data[0].b64_json;

    return res.json({
      success: true,
      outfit,
      outfitImage: outfitImageBase64
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate outfit." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));