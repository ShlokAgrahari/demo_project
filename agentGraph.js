import { StateGraph } from "@langchain/langgraph";
import { recommendEvents } from "./recommendEvents.js";
import { explainRecommendation } from "./explainRecommendation.js";

async function retrieveEvents(state){

 const results = await recommendEvents(state.query);

 return {
  ...state,
  events: results
 };

}

async function explainEvents(state){

 const explanations = [];

 for(const event of state.events){

  const reason = await explainRecommendation(
   state.query,
   event.metadata
  );

  explanations.push({
   title: event.metadata.title,
   score: event.score,
   reason
  });

 }

 return {
  ...state,
  result: explanations
 };

}

const graph = new StateGraph({

 channels: {
  query: null,
  events: null,
  result: null
 }

});

graph.addNode("retrieveEvents", retrieveEvents);
graph.addNode("explainEvents", explainEvents);

graph.setEntryPoint("retrieveEvents");

graph.addEdge("retrieveEvents", "explainEvents");

export const agentWorkflow = graph.compile();