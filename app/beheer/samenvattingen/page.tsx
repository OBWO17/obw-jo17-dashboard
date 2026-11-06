import {redirect} from 'next/navigation';
import {teamMember} from '../../../lib/supabase/server';
import SummaryUploader from './uploader';
export const dynamic='force-dynamic';
export default async function Page(){const member=await teamMember();if(!member)redirect('/login');if(member.role!=='admin')redirect('/');const {data}=await member.client.from('team_videos').select('slug').eq('published',true);return <SummaryUploader published={data?.map(s=>s.slug)??[]}/>}
