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
const User = require("./models/User");

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