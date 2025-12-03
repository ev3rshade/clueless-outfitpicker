const axios = require("axios");

async function callGeminiJSON(promptText, requirements, apiKey) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
    apiKey;

  const parts = [
    { text: promptText },
    { array: requirements}
  ];


  const body = {
    contents: [
      {
        role: "user",
        parts,
      },
    ],
  };

  const response = await axios.post(url, body);
  return response.data.candidates[0].content.parts[0].text;
}


async function callGeminiImage(prompt) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-vision:generateImage?key=" +
    GEMINI_KEY;

  const body = {
    prompt: {
      text: prompt,
      requirements: notes,
    },
    image: {
      size: "1024x1024",
    },
  };

  const response = await axios.post(url, body);

  // Gemini returns base64 here:
  return response.data.image.base64;
}