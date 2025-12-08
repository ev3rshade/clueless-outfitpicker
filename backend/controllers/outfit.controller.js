import { callGeminiJSON, callGeminiImage } from "../services/gemini.service.js";

export const generateOutfit = async (req, res) => {
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
}