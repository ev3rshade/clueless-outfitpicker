import Outfit from "../models/Outfit.js";
import User from "../models/User.js";
import { callOpenAIJSON, callOpenAIImage } from "../services/openAI.service.js";


export const generateOutfit = async (req, res) => {
  try {
    const { prompt, requirements } = req.body;

    const openAIPrompt = `
      RESPOND ONLY IN VALID JSON WITH NO OTHER TEXT
      You analyze a text prompt and a list of requirements.
      Recommend a full outfit.

      Outfit details:
      ${requirements.join("\n")}
      
      REQUIRED RESPONSE FORMAT IS BELOW
      {
        "items": [
          { "name": "", "pieces": [], "notes": "" }
        ],
        "imagePrompt": "describe the outfit visually"
      }
    `;

    const responseText = await callOpenAIJSON(openAIPrompt + "\n" + prompt, requirements);
    console.log("OPENAI RESPONSED WITH: ", responseText)
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

    const base64Image = await callOpenAIImage(imagePrompt);
    console.log("OPENAI RESPONSED WITH: ", base64Image);

    res.json({
      success: true,
      outfit,
      outfitImage: base64Image,
    });

    
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Could not generate outfit." });
  }
}


export const saveOutfit = async (req, res) => {
  try {
    const { imagePrompt, outfitImage, items } = req.body;

    if (!items || !outfitImage) {
      return res.status(400).json({ error: "Missing outfit data" });
    }

    const imageData = `data:image/png;base64,${outfitImage}`;

    const saved = await Outfit.create({
      userId: req.user.id,
      imagePrompt,
      outfitImage: imageData,
      items
    });

    // save to user saved outfits
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.savedOutfits.includes(saved._id)) {
      user.savedOutfits.push(saved._id);
      await user.save(); // persists to DB
    }

    res.status(201).json({
      success: true,
      outfit: saved
    });

  } catch (err) {
    console.error("Outfit save error:", err);
    res.status(500).json({ error: "Could not save outfit" });
  }
};

export const deleteOutfit = async (req, res) => {
  try {
    const { id } = req.params;

    const outfit = await Outfit.findOne({ _id: id, userId: req.user.id });
    if (!outfit) {
      return res.status(404).json({ error: "Outfit not found" });
    }

    await Outfit.findByIdAndDelete(id);

    res.json({ success: true, message: "Outfit deleted successfully" });

  } catch (err) {
    console.error("Delete Outfit Error:", err);
    res.status(500).json({ error: "Could not delete outfit" });
  }
};

export async function getOutfit(req, res) {
  try {
    const { outfitId } = req.params; // Assuming the ID comes from the URL

    if (!outfitId) {
      return res.status(400).json({ error: "Missing outfit ID" });
    }

    // Find outfit by ID
    const outfit = await Outfit.findById(outfitId);

    if (!outfit) {
      return res.status(404).json({ error: "Outfit not found" });
    }

    res.json({ success: true, outfit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}