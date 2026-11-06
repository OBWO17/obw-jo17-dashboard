import {NextResponse} from 'next/server';
import {teamMember} from '../../../lib/supabase/server';
import {summaryCatalog} from '../../../lib/summary-catalog';
export const dynamic='force-dynamic';
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function POST(request:Request){
 const member=await teamMember();if(!member)return json({error:'Log eerst in.'},401);if(member.role!=='admin')return json({error:'Alleen de beheerder kan uploaden.'},403);
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Ongeldige aanvraag.'},403);
 const body=await request.json().catch(()=>null);const item=summaryCatalog.find(s=>s.slug===body?.slug);if(!item)return json({error:'Onbekende samenvatting.'},400);
 const videoPath=item.filename,posterPath=item.slug+'.jpg';
 if(body.action==='prepare'){
  if(body.size!==item.size||body.sha256!==item.sha256)return json({error:'Kies de goedgekeurde, gecorrigeerde versie van dit filmpje.'},400);
  const video=await member.client.storage.from('team-videos').createSignedUploadUrl(videoPath,{upsert:true});
  const poster=await member.client.storage.from('team-posters').createSignedUploadUrl(posterPath,{upsert:true});
  if(video.error||poster.error||!video.data||!poster.data)return json({error:'Upload voorbereiden mislukt. Probeer opnieuw.'},503);
  return json({url:process.env.NEXT_PUBLIC_SUPABASE_URL,key:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,video:video.data,poster:poster.data});
 }
 if(body.action==='publish'){
  const video=await member.client.storage.from('team-videos').info(videoPath);const poster=await member.client.storage.from('team-posters').info(posterPath);
  if(video.error||poster.error||Number(video.data?.size)!==item.size||!poster.data||Number(poster.data.size)<1||Number(poster.data.size)>2097152)return json({error:'De upload is nog niet compleet. Probeer opnieuw.'},409);
  const {data,error}=await member.client.from('team_videos').update({published:true}).eq('slug',item.slug).eq('storage_path',videoPath).select('slug');
  if(error||!data?.length)return json({error:'Publiceren mislukt.'},503);return json({published:true});
 }
 return json({error:'Onbekende actie.'},400);
}
