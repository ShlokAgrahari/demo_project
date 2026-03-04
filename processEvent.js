import { generateEmbedding } from "./geminiEmbedding.js";
import { index } from "./pineconeClient.js";

export async function processEvent(event){

const text = `
Hackathon: ${event.title}
Organization: ${event.organization || ""}
Location: ${event.location || ""}
Mode: ${event.mode || ""}
Skills Required: ${(event.skills || []).join(", ")}
Prize Pool: ${event.prize || ""}
`;

 const embedding = await generateEmbedding(text);

 // make safe vector id
 const safeId = event.title
  .normalize("NFKD")
  .replace(/[^\x00-\x7F]/g, "")
  .replace(/\s+/g, "_")
  .replace(/[^a-zA-Z0-9_-]/g, "");

 // clean metadata (remove null/undefined)
 const cleanMetadata = {
  title: event.title || "",
  organization: event.organization || "",
  location: event.location || "",
  mode: event.mode || "",
  prize: event.prize || 0,
  teamSize: event.teamSize || "",
  deadline: event.deadline || "",
  url: event.url || "",
  skills: event.skills || []
 };

 await index.upsert({
  records: [
    {
      id: safeId,
      values: embedding,
      metadata: cleanMetadata
    }
  ]
 });

 console.log("Stored:", safeId);
}