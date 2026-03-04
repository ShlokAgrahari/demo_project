import { agentWorkflow } from "./agentGraph.js";

async function test(){

 const response = await agentWorkflow.invoke({

  query: "AI machine learning hackathons"

 });

 console.log("Final Result:\n");

 console.log(JSON.stringify(response.result, null, 2));

}

test();