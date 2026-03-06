import { StateGraph } from "@langchain/langgraph";
import { recommendEvents } from "./recommendEvents.js";
import { explainRecommendation } from "./explainRecommendation.js";

async function retrieveEvents(state){

 const results = await recommendEvents(state.query);

 const formatted = results.map(e => ({
  title: e.metadata.title,
  score: e.score
 }));

 return {
  ...state,
  events: results,
  result: formatted
 };

}

async function planQuery(state){

 console.log("Planning query...");

 return {
  ...state,
  task: "retrieveEvents"
 };

}

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
 apiKey: process.env.GEMINI_API_KEY
});



async function filterEvents(state){

 const now = new Date();

 const filtered = state.events.filter(e => {

 if(!e.metadata.deadline) return true;

 const deadline = new Date(e.metadata.deadline);

 return !isNaN(deadline) && deadline > now;

});

 return {
  ...state,
  events: filtered
 };

}

async function rankEvents(state){

 const queryWords = state.query.toLowerCase().split(" ");

 const ranked = state.events.map(e => {

  const skills = (e.metadata.skills || []).join(" ").toLowerCase();

  let extraScore = 0;

  queryWords.forEach(word => {
   if(skills.includes(word)){
    extraScore += 1;
   }
  });

  return {
   title: e.metadata.title,
   score: e.score + extraScore
  };

 });

 ranked.sort((a,b)=> b.score - a.score);

 return {
  ...state,
  result: ranked
 };

}

const graph = new StateGraph({

 channels: {
  query: null,
  events: null,
  result: null
 }

});

graph.addNode("planQuery", planQuery);
graph.addNode("retrieveEvents", retrieveEvents);
graph.addNode("filterEvents", filterEvents);
graph.addNode("rankEvents", rankEvents);

graph.setEntryPoint("planQuery");

graph.addEdge("planQuery", "retrieveEvents");
graph.addEdge("retrieveEvents", "filterEvents");
graph.addEdge("filterEvents", "rankEvents");
graph.addEdge("rankEvents", "__end__");

export const agentWorkflow = graph.compile();