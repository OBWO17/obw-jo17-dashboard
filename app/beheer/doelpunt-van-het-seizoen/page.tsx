import {redirect} from 'next/navigation';
import {teamMember} from '../../../lib/supabase/server';
import GoalElection from '../../goal-election';
export const dynamic='force-dynamic';
export default async function Page(){const m=await teamMember();if(!m)redirect('/login');if(m.role!=='admin')redirect('/');return <main className="goal-election-admin-page"><a className="page-back-link" href="/">Terug naar overzicht</a><GoalElection manage/></main>}
