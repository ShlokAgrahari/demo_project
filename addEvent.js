import { index } from "./pineconeClient.js";
import { generateEmbedding } from "./geminiEmbedding.js";

async function addEvents(){

  const events = [
    {
      id: "event1",
      text: "AI Hackathon build machine learning healthcare tools",
      title: "AI Hackathon"
    },
    {
      id: "event2",
      text: "Web3 Blockchain Hackathon build decentralized applications",
      title: "Web3 Hackathon"
    },
    {
      id: "event3",
      text: "Cybersecurity Capture The Flag competition ethical hacking",
      title: "Cybersecurity CTF"
    },
    {
      id: "event4",
      text: "Data Science Challenge analyze datasets and build ML models",
      title: "Data Science Challenge"
    }
  ];

  const records = [];

  for (const event of events) {

    const embedding = await generateEmbedding(event.text);

    console.log(event.title, "embedding length:", embedding.length);

    records.push({
      id: event.id,
      values: embedding,
      metadata: {
        title: event.title,
        description: event.text
      }
    });
  }

  await index.upsert({
    records: records
  });

  console.log("Events stored in Pinecone");

}

addEvents();