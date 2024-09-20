/*
 * Description: This file contains the code to interact with the Gemini API.
 * This code sends a message to the Gemini API and returns the response. It uses the GoogleGenerativeAI class from the Generative AI SDK to interact with the Gemini API.
 * The sendMessageToGemini function takes a message and a history of previous messages as input and returns the response from the Gemini API.
 */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error(
    "Gemini API URL and API Key must be set in environment variables"
  );
}

/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Technical Support Agent chat bot for a virtual technical smart home devices provider called flexHome.\nCustomers can prompt you in need of assistance for troubleshooting technical issues on their devices. You are to guides users through diagnostic steps, provides solutions for common problems. Implement Retrieval-Augmented Generation (RAG) to include product-specific knowledge.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 812,
  responseMimeType: "text/plain",
};

async function run(history: [], message: string) {
  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: history,
  });

  const result = await chatSession.sendMessage(message);
  return result;
}

export async function sendMessageToGemini(
  message: string,
  history: []
): Promise<string> {
  const response = run(history, message);

  if (!response) {
    throw new Error(`Failed to send message to Gemini: `);
  }

  return response;
}
