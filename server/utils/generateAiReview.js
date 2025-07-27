// server/utils/generateAiReview.js
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

async function generateAIReview(code) {
  // build your prompt however you like
  const prompt = `
You are an expert code reviewer.
Review the following code and provide feedback on its correctness, efficiency, and style.
Also give suggestions for improvement if necessary. keep it concise but informative.

\`\`\`
${code}
\`\`\`
`;

  // directly call ai.models.generateContent
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",   // or your preferred model
    contents: prompt
  });

  // the generated text is on `response.text` (no .response or .text())
  const review = response.text;
  console.log("AI review:", review);
  return review;
}

module.exports = { generateAIReview };
