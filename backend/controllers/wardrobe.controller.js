import Cloth from "../models/Cloth.js";

export const getWardrobe = async (req, res) => {
  try {
    const items = await Cloth.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json({ items });
  } catch (err) {
    console.error("Wardrobe fetch error:", err);
    res.status(500).json({ error: "Could not fetch wardrobe items" });
  }
};

export const addWardrobeItem = async (req, res) => {
  try {
    const { category, color, occasion, weather, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Check file size (16MB = 16 * 1024 * 1024 bytes)
    const maxSize = 16 * 1024 * 1024;
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
};

export const updateWardrobeItem = async (req, res) => {
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
};

export const deleteWardrobeItem = async (req, res) => {
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
};

