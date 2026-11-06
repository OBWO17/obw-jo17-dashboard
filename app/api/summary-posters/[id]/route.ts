import {NextResponse} from 'next/server';
import {teamMember} from '../../../../lib/supabase/server';
import {summaryCatalog} from '../../../../lib/summary-catalog';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){const member=await teamMember();if(!member)return new NextResponse(null,{status:401});const {id}=await params;if(!summaryCatalog.some(s=>s.slug===id))return new NextResponse(null,{status:404});const {data:video}=await member.client.from('team_videos').select('slug').eq('slug',id).eq('published',true).maybeSingle();if(!video)return new NextResponse(null,{status:404});const {data,error}=await member.client.storage.from('team-posters').createSignedUrl(id+'.jpg',300);if(error||!data)return new NextResponse(null,{status:404});return NextResponse.redirect(data.signedUrl,{status:302,headers:{'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}})}
