import {NextResponse} from 'next/server';
import {teamMember} from '../../../../../lib/supabase/server';
import {uuidPattern} from '../../../../../lib/goal-election';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const m=await teamMember();if(!m)return new NextResponse('Geen toegang',{status:401});const {id}=await params;if(!uuidPattern.test(id))return new NextResponse('Niet gevonden',{status:404});
 const {data,error}=await m.client.rpc('goal_election_state',{p_hash:''});if(error)return new NextResponse('Ophalen mislukt',{status:503});
 const c=data.candidates.find((v:{id:string})=>v.id===id);if(!c)return new NextResponse('Niet beschikbaar',{status:404});
 const poster=new URL(request.url).searchParams.get('poster')==='1';const {data:signed,error:signError}=await m.client.storage.from('goal-season').createSignedUrl(poster?c.poster_path:c.video_path,300);if(signError||!signed)return new NextResponse('Openen mislukt',{status:503});return NextResponse.redirect(signed.signedUrl,{status:302,headers:{'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}});
}
