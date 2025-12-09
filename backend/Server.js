import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/Mongo.database.js";
import corsConfig from "./config/cors.config.js";
import authRoutes from "./routes/Auth.routes.js";
import wardrobeRoutes from "./routes/wardrobe.routes.js";
import outfitRoutes from "./routes/outfit.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(corsConfig); // corsConfig is already a middleware function
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Database connection
connectDB();

// Routes
app.use("/", authRoutes);
app.use("/", wardrobeRoutes);
app.use("/", outfitRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});