import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI();

export const callOpenAIJSON = async (prompt) => {
  
  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    return response.output_text;

  } catch (err) {
    console.error("❌ OpenAI JSON Error:", err.response?.data || err);
    throw new Error("OpenAI JSON generation failed");
  }
};

export const callOpenAIImage = async (prompt) => {
  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      size: "1024x1024",
      tools: [{type: "image_generation"}],
    });

    const imageData = response.output
      .filter((output) => output.type === "image_generation_call")
      .map((output) => output.result);

    if (imageData.length > 0) {
      const imageBase64 = imageData[0];
      return imageBase64;
    }
    
  } catch (err) {
    console.error("❌ OpenAI Image Error:", err.response?.data || err);
    throw new Error("OpenAI image generation failed");
  }
};

