import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const callGeminiJSON = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    return response.text;
  } catch (err) {
    console.error("❌ Gemini JSON Error:", err.response?.data || err);
    throw new Error("Gemini JSON generation failed");
  }
};

export const callGeminiImage = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log(part.text);
        console.error("❌ Gemini Returned text");
        throw new Error("Gemini returned text instead of an image");
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        console.log("image received" + imageData);
        return imageData;
      }
    }
  } catch (err) {
    console.error("❌ Gemini Image Error:", err.response?.data || err);
    throw new Error("Gemini image generation failed");
  }
};

