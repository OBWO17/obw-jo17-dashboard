import {teamMember} from '../../../lib/supabase/server';
import {parseStandings,type StandingRow} from '../../stand-parser';
import {checkedOn,phases} from '../../competition-data';
export const dynamic='force-dynamic';
const source='https://www.obw.nl/857/5276/competitie/';
let lastGood:{rows:StandingRow[];checkedAt:string}|null=null;
export async function GET(){
 if(!await teamMember())return Response.json({error:'Geen toegang'},{status:401});
 const headers={'Cache-Control':'private, no-store'};
 try{
  const result=await fetch(source,{cache:'no-store',signal:AbortSignal.timeout(12000)});
  if(!result.ok)throw Error(`HTTP ${result.status}`);
  const rows=parseStandings(await result.text());lastGood={rows,checkedAt:new Date().toISOString()};
  return Response.json({...lastGood,source,sourceStatus:'live'},{headers});
 }catch{
  const notice='De officiële bron is tijdelijk niet bereikbaar voor automatische verversing. De laatst gecontroleerde stand blijft zichtbaar.';
  return Response.json({rows:lastGood?.rows||phases.find(p=>p.id==='2')!.rows,checkedAt:lastGood?.checkedAt||null,checkedOn,source,sourceStatus:lastGood?'cached':'snapshot',notice},{headers});
 }
}
