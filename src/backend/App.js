require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const GEMINI_KEY = process.env.GEMINI_API_KEY;

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

app.listen(3000, () => console.log("Server running on port 3000"));
