import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function explainRecommendation(query, event){

 const prompt = `
A student is looking for hackathons.

User interest:
${query}

Hackathon:
Title: ${event.title}
Organization: ${event.organization}
Skills: ${(event.skills || []).join(", ")}

Explain briefly why this hackathon is relevant.
`;

 const response = await genAI.models.generateContent({
   model: "gemini-2.0-flash",
   contents: prompt
 });

 return response.text;
}