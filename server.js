import express from "express";
import dotenv from "dotenv";
import { recommendEvents } from "./recommendEvents.js";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/recommend", async (req,res)=>{

 const { skills } = req.body;

 try{

   const events = await recommendEvents(skills);

   res.json(
     events.map(e => ({
       title: e.metadata.title,
       organization: e.metadata.organization,
       location: e.metadata.location,
       prize: e.metadata.prize,
       score: e.score
     }))
   );

 }catch(err){

   console.error(err);
   res.status(500).send("Error generating recommendations");

 }

});

app.listen(5000, ()=>{
 console.log("Server running on port 5000");
});