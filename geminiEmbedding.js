import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function generateEmbedding(text) {

  const res = await genAI.models.embedContent({
    model: "gemini-embedding-001",
    contents: text
  });

  const embedding = res.embeddings[0].values;

  console.log("Embedding length:", embedding.length);

  return embedding;
}