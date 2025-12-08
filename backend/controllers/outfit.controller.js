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
    console.log("OPENAI RESPONSE: ", responseText)
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