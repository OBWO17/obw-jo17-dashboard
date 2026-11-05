import {redirect} from 'next/navigation';
import Home from './dashboard';
import ViewerDashboard from './viewer-dashboard';
import {teamMember} from '../lib/supabase/server';
export const dynamic='force-dynamic';
export default async function Page(){const member=await teamMember();if(!member)redirect('/login');return member.role==='admin'?<Home userId={member.user.id} role={member.role}/>:<ViewerDashboard/>}
