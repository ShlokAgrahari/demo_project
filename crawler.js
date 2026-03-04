import axios from "axios";
import { processEvent } from "./processEvent.js";

async function crawlHackathons(){

 try{

 const url =
 "https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&page=1&per_page=10";

 const res = await axios.get(url);

 const hackathons = res.data.data.data.map(h => ({
   title: h.title,
   organization: h.organisation?.name,
   location: h.address_with_country_logo?.city,
   mode: h.region,
   prize: h.prizes?.[0]?.cash || 0,
   teamSize: `${h.regnRequirements?.min_team_size}-${h.regnRequirements?.max_team_size}`,
   deadline: h.regnRequirements?.end_regn_dt,
   url: h.seo_url,
   skills: (h.required_skills || []).map(s => s.skill)
 }));

 for(const event of hackathons){
   await processEvent(event);
 }

 console.log("Crawling complete");

 }catch(err){

  console.error("Crawler error:", err);

 }

}

crawlHackathons();