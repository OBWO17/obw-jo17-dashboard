import {NextResponse} from 'next/server';
import {teamMember} from '../../../lib/supabase/server';
export const dynamic='force-dynamic';
export async function GET(){const member=await teamMember();if(!member)return NextResponse.json({error:'Geen toegang'},{status:401});const {data,error}=await member.client.from('team_videos').select('slug').eq('published',true);return NextResponse.json({slugs:error?[]:data?.map(x=>x.slug)??[]},{status:error?503:200,headers:{'Cache-Control':'private, no-store'}})}
