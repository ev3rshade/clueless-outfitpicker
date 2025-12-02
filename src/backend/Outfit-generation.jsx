/**
 * TODO
 * LINK TO FRONT END
 * ---input - when "return" is hit
 * ---input - when "search" is clicked
 * ---ui - display loading screen
 * ---output - diplay generated image
 * MONGO INTEGRATION
 * ---save image to mongo when "save" is clicked
 * 
 */


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
                { "name": "", "notes": "" }
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