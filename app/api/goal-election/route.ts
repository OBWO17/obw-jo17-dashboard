import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {createHash,randomUUID} from 'node:crypto';
import {teamMember} from '../../../lib/supabase/server';
import {uuidPattern} from '../../../lib/goal-election';
export const dynamic='force-dynamic';
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
async function voter(){const jar=await cookies();let token=jar.get('obw-goal-voter')?.value;if(!token||!uuidPattern.test(token)){token=randomUUID();jar.set('obw-goal-voter',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*400})}return createHash('sha256').update(token).digest('hex')}
export async function GET(){const m=await teamMember();if(!m)return json({error:'Log eerst in.'},401);const hash=await voter();const {data,error}=await m.client.rpc('goal_election_state',{p_hash:hash});if(error)return json({error:'De verkiezing kon niet worden geladen. Probeer opnieuw.'},503);return json({...data,candidates:data.candidates.map(({video_path:_,poster_path:__,...c}:Record<string,unknown>)=>c)})}
export async function POST(request:Request){const m=await teamMember();if(!m)return json({error:'Log eerst in.'},401);if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Ongeldige aanvraag.'},403);const b=await request.json().catch(()=>null);if(b?.action==='vote'){
 if(typeof b.id!=='string'||!uuidPattern.test(b.id)||!Number.isInteger(b.round))return json({error:'Ongeldige stem.'},400);
 const {error}=await m.client.rpc('goal_election_vote',{p_hash:await voter(),p_candidate:b.id,p_round:b.round});return error?json({error:error.message},409):json({success:true});
 }
 if(m.role!=='admin')return json({error:'Alleen de trainer kan de verkiezing beheren.'},403);
 if(b?.action==='prepare'){
  if(!Number.isInteger(b.size)||b.size<1||b.size>52428800||b.type!=='video/mp4')return json({error:'Kies een MP4 van maximaal 50 MB.'},400);
  const path='2026-2027/'+randomUUID();const [v,p]=await Promise.all([m.client.storage.from('goal-season').createSignedUploadUrl(path+'.mp4'),m.client.storage.from('goal-season').createSignedUploadUrl(path+'.jpg')]);
  if(v.error||p.error||!v.data||!p.data)return json({error:'Upload voorbereiden mislukt.'},503);
  return json({url:process.env.NEXT_PUBLIC_SUPABASE_URL,key:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,video:v.data,poster:p.data});
 }
 if(!['candidate','open','close','final'].includes(b?.action)||!Number.isInteger(b.revision))return json({error:'Onbekende actie.'},400);
 if(b.action==='candidate'){
  const d=b.data;if(!d||!Number.isInteger(d.slot)||d.slot<1||d.slot>6||typeof d.player!=='string'||!d.player.trim()||d.player.length>60||typeof d.opponent!=='string'||!d.opponent.trim()||d.opponent.length>100||!/^\d{4}-\d{2}-\d{2}$/.test(d.date)||typeof d.caption!=='string'||d.caption.length>180||typeof d.video_path!=='string'||!/^2026-2027\/[a-f0-9-]{36}\.mp4$/.test(d.video_path)||d.poster_path!==d.video_path.replace('.mp4','.jpg'))return json({error:'Controleer de naam, wedstrijd, datum en bestanden.'},400);
  const [v,p]=await Promise.all([m.client.storage.from('goal-season').info(d.video_path),m.client.storage.from('goal-season').info(d.poster_path)]);
  if(v.error||p.error||!v.data||!p.data||Number(v.data.size)<1||Number(v.data.size)>52428800||Number(p.data.size)<1||Number(p.data.size)>2097152)return json({error:'Upload is nog niet compleet.'},409);
 }
 const {error}=await m.client.rpc('goal_election_manage',{p_action:b.action,p_revision:b.revision,p_data:b.data||{}});return error?json({error:error.message},409):json({success:true});
}
