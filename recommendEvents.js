import { index } from "./pineconeClient.js";
import { generateEmbedding } from "./geminiEmbedding.js";

export async function recommendEvents(userSkills){

 const embedding = await generateEmbedding(userSkills);

 const results = await index.query({
   vector: embedding,
   topK: 5,
   includeMetadata: true
 });

 return results.matches;
}