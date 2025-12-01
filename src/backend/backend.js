require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const { OpenAI } = require("openai");

const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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