import {notFound,redirect} from 'next/navigation';
import {teamMember} from '../../../lib/supabase/server';
import {officialMatches,friendlyMatches,cupMatches} from '../../competition-data';
import MatchDetail from '../../match-detail';
import type {HomeMatch} from '../../team-homepage';
export const dynamic='force-dynamic';
export default async function MatchPage({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!/^[a-zA-Z0-9-]{1,120}$/.test(id))notFound();const member=await teamMember();if(!member)redirect('/login');const bundled=[...officialMatches,...friendlyMatches,...cupMatches];const date=id.startsWith('datum-')?id.slice(6):null;const fallback=bundled.find(m=>date?m.date===date:m.id===id);const {data,error}=await member.client.from('team_matches').select('payload');const live=error?undefined:data?.map(r=>r.payload as HomeMatch).find(m=>date?m.date===date:m.id===id);const match=live?{...fallback,...live}:fallback;if(!match)notFound();return <main className="team-detail-page"><nav className="detail-breadcrumb"><a href="/">Overzicht</a><span>/</span><a href="/?tab=Wedstrijden">Alle wedstrijden</a></nav><MatchDetail match={match}/></main>}
