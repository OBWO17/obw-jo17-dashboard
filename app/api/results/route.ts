import {teamMember} from '../../../lib/supabase/server';
import {officialMatches} from '../../competition-data';
export const dynamic='force-dynamic';
const source='https://www.obw.nl/857/5276/competitie/uitslagen/';
const clean=(s:string)=>s.replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&#39;|&apos;/gi,"'").replace(/&quot;/gi,'"').replace(/\s+/g,' ').trim();
const normalize=(s:string)=>s.toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
function parse(html:string){
 const results:{date:string;score:string}[]=[];
 for(const tr of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)){
  const cells=[...tr[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(x=>clean(x[1]));
  if(cells.length<4)continue;
  const date=cells[0].match(/\b(\d{2})-(\d{2})-(2026|2027)\b/);
  if(!date)continue;
  const iso=`${date[3]}-${date[2]}-${date[1]}`;
  const match=officialMatches.find(m=>m.date===iso&&m.phase==='2');
  if(!match)continue;
  const home=match.venue==='Uit'?match.opponent:'OBW O17-1';
  const away=match.venue==='Uit'?'OBW O17-1':match.opponent;
  if(normalize(cells[1])!==normalize(home)||normalize(cells[2])!==normalize(away))continue;
  const score=cells[3].match(/^(\d{1,2})\s*[-–]\s*(\d{1,2})$/);
  if(!score)continue;
  const a=Number(score[1]),b=Number(score[2]);
  if(a>30||b>30)continue;
  results.push({date:iso,score:match.venue==='Uit'?`${b}-${a}`:`${a}-${b}`});
 }
 return results;
}
export async function GET(){
 if(!await teamMember())return Response.json({error:'Geen toegang'},{status:401});
 try{
  const r=await fetch(source,{cache:'no-store',signal:AbortSignal.timeout(12000)});
  if(!r.ok)throw Error('Bron niet bereikbaar');
  const results=parse(await r.text());
  if(!results.length)throw Error('Geen verifieerbare wedstrijduitslagen gevonden');
  return Response.json({results,source,checkedAt:new Date().toISOString()},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return Response.json({error:'Actuele uitslagen konden niet worden gecontroleerd'},{status:503,headers:{'Cache-Control':'no-store'}})}
}
