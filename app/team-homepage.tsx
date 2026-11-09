'use client';
import {ArrowUpRight,BookOpen,Flag,Target,Trophy,Users,Video} from 'lucide-react';
import MatchHighlights from './match-highlights';
import MatchSummaries from './match-summaries';
import MatchReports from './match-reports';
import Sponsors from './sponsors';
import {phaseResults} from './phase-overview';
import {goalTotals,type Goal} from './goal-scorers';

export type HomeMatch={id:string;date:string;opponent:string;venue:string;score:string;scoreScope?:string;kind?:string;phase?:string;kickoff?:string;goals?:Goal[]};
export default function TeamHomepage({matches,onNavigate,onMatch,onReport}:{matches:HomeMatch[];onNavigate:(tab:string)=>void;onMatch:(match:HomeMatch)=>void;onReport:(id:string)=>void}){
 const ordered=[...matches].sort((a,b)=>b.date.localeCompare(a.date));
 const latest=ordered.find(m=>m.score);
 const next=[...ordered].reverse().find(m=>!m.score&&m.date>=new Date().toISOString().slice(0,10));
 const first=phaseResults(matches,'1'),second=phaseResults(matches,'2');
 const scorers=goalTotals(matches).slice(0,3);
 const cup=[...matches].filter(m=>m.kind==='Beker'&&!m.score).sort((a,b)=>a.date.localeCompare(b.date))[0];
 return <div className="team-homepage">
  <section className="team-home-hero" aria-label="OBW JO17-1 seizoen 2026-2027">
   <img src="/obw-jo17-team.webp" alt="Teamfoto OBW JO17-1" width={1440} height={960} fetchPriority="high"/>
   <div className="team-home-hero-copy"><span>ONS TEAM · SEIZOEN 2026–2027</span><h1>OBW JO17-1</h1><p>Samen groeien. Samen winnen.</p><button onClick={()=>onNavigate('Spelers')}>Ontmoet onze selectie <ArrowUpRight size={18}/></button></div>
  </section>
  <MatchHighlights latest={latest} next={next} onOpen={onMatch} onMatches={()=>onNavigate('Wedstrijden')}/>
  <section className="team-home-videos"><div className="team-home-section-heading"><div><span className="eyebrow">BELEEF DE WEDSTRIJD</span><h2>De laatste wedstrijdbeelden</h2></div><button onClick={()=>onNavigate('Samenvattingen')}>Alle video's <ArrowUpRight size={17}/></button></div><MatchSummaries privatePlayback limit={2} onViewAll={()=>onNavigate('Samenvattingen')}/></section>
  <div className="team-home-shortcuts" aria-label="Ontdek ons team">{([['Competitie','Stand en programma',Trophy],['Spelers','De selectie',Users],['Wedstrijdverslagen','Wedstrijdverhalen',BookOpen],['Topscorers','Doelpuntenmakers',Target]] as const).map(([name,desc,Icon])=><button key={name} onClick={()=>onNavigate(name)}><Icon size={23}/><span><strong>{name}</strong><small>{desc}</small></span><ArrowUpRight size={17}/></button>)}</div>
  <section className="team-home-season"><div className="team-home-section-heading"><div><span className="eyebrow">ONS SEIZOEN</span><h2>Van kampioen naar de hoofdklasse</h2></div><button onClick={()=>onNavigate('Competitie')}>Bekijk de competitie <ArrowUpRight size={17}/></button></div><div className="team-home-season-grid"><div className="team-home-season-card"><span className="season-symbol">🏆</span><small>FASE 1 · AFGEROND</small><strong>Kampioen!</strong><p>Ongeslagen · {first.points} punten uit {first.played} wedstrijden</p></div><div className="team-home-season-card"><span className="season-symbol">⚽</span><small>FASE 2 · HOOFDKLASSE</small><strong>{second.points} punten</strong><p>{second.played} gespeeld · {second.wins} gewonnen · {second.draws} gelijk</p></div><div className="team-home-season-card"><span className="season-symbol">🏆</span><small>ZWALUWEN JEUGDBEKER</small><strong>{cup?cup.opponent:'Beker'}</strong><p>{cup?new Date(cup.date+'T12:00:00').toLocaleDateString('nl-NL',{day:'numeric',month:'long'}):'Bekijk het bekerprogramma'}{cup?.kickoff?' · '+cup.kickoff+' uur':''}</p></div></div></section>
  <div className="team-home-lower"><section className="team-home-scorers"><div className="team-home-section-heading"><div><span className="eyebrow">DOELPUNTENMAKERS</span><h2>Top 3 van ons team</h2></div><button onClick={()=>onNavigate('Topscorers')}>Alle topscorers <ArrowUpRight size={16}/></button></div>{scorers.length?<ol>{scorers.map((p,i)=><li key={p.id}><span className="home-scorer-rank">{i+1}</span><strong>{p.name}</strong><b>{p.count} <small>{p.count===1?'goal':'goals'}</small></b></li>)}</ol>:<p>Doelpuntenmakers worden nog bijgewerkt.</p>}</section><section className="team-home-report"><div className="team-home-section-heading"><div><span className="eyebrow">HET VERHAAL ACHTER DE WEDSTRIJD</span><h2>Laatste wedstrijdverslag</h2></div><button onClick={()=>onNavigate('Wedstrijdverslagen')}>Alle verslagen <ArrowUpRight size={16}/></button></div><MatchReports limit={1} onViewAll={()=>onNavigate('Wedstrijdverslagen')} onOpenReport={onReport}/></section></div>
  <div className="team-home-footer"><Sponsors compact/><div className="team-home-links"><a href="https://app.veo.co/" target="_blank" rel="noopener noreferrer"><Video size={17}/> Veo <ArrowUpRight size={14}/></a><a href="https://www.voetbal.nl/" target="_blank" rel="noopener noreferrer"><Flag size={17}/> Voetbal.nl <ArrowUpRight size={14}/></a></div></div>
 </div>
}
