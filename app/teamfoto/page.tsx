import {redirect} from 'next/navigation';
import {teamMember} from '../../lib/supabase/server';
import Link from 'next/link';
export const dynamic='force-dynamic';
export const metadata={title:'Teamfoto OBW JO17-1 | 2026–2027'};
export default async function TeamPhotoPage(){
 const member=await teamMember();if(!member)redirect('/login');
 return <main className="team-photo-page"><div className="team-photo-page-inner"><header className="team-photo-page-header"><div><span className="team-photo-page-eyebrow">SEIZOEN 2026–2027</span><h1>OBW JO17-1</h1><p>Onze teamfoto</p></div><Link href="/" className="team-photo-page-close" aria-label="Sluit de teamfoto en ga terug naar het dashboard" title="Sluiten">×</Link></header><figure className="team-photo-page-figure"><img src="/obw-jo17-team.webp" alt="Teamfoto OBW JO17-1 seizoen 2026–2027"/><figcaption className="team-photo-page-caption"><h2>Ons team · 2026–2027</h2><div className="team-photo-roster-rows"><div className="team-photo-roster-row"><h3>Achterste rij <span>van links naar rechts</span></h3><p>Rene · Jos · Koen · Dustin · Jip · Loek · Joep · Jurre · Finn · Ralph</p></div><div className="team-photo-roster-row"><h3>Voorste rij <span>van links naar rechts</span></h3><p>Luuk · Tim · Loek · Chris · Daan · Boaz · Collin · Jens</p></div></div></figcaption></figure><Link href="/" className="team-photo-page-back">Terug naar het dashboard</Link></div></main>
}
