'use client';
import {ArrowUpRight,BookOpen,Play,CalendarDays} from 'lucide-react';
import {matchOutcome} from './match-outcome';
import type {HomeMatch} from './team-homepage';
import {reportPreviews} from './match-reports';
import {summaryEntries,useSummaryAvailability} from './match-summaries';
import ShareSummary from './share-summary';
import SummaryDuration from './summary-duration';
function LatestClub({name}:{name:string}){const initials=name.replace(/\s+(JO|O)17.*$/i,'').split(/\s+/).filter(w=>/[a-z]/i.test(w)).slice(0,2).map(w=>w[0]).join('').toUpperCase();return <div className="latest-match-team"><span className="latest-match-clubmark" aria-hidden="true">{name==='OBW O17-1'?<img src="/clubs/obw.png" alt="" width={48} height={48}/>:initials}</span><strong>{name}</strong></div>}
export default function LatestMatch({match,onMatch,onReport}:{match:HomeMatch;onMatch:(m:HomeMatch)=>void;onReport:(id:string)=>void}){
 const available=useSummaryAvailability();
 const report=reportPreviews.find(r=>r.date===match.date);
 const summary=summaryEntries.find(s=>s.slug.endsWith(match.date.replaceAll('-',''))&&available?.includes(s.slug));
 const away=match.venue==='Uit';
 const homeName=away?match.opponent:'OBW O17-1',awayName=away?'OBW O17-1':match.opponent;
 const score=match.score.split(/\s*[-–:]\s*/);if(away)score.reverse();
 const isCatalog=summary&&'filename' in summary;
 const outcome=matchOutcome(match.score,match.scoreScope);
 return <section className={`latest-match ${summary?'latest-match-with-video':'latest-match-result-only'}${outcome?' latest-result-'+outcome:''}`} aria-label="Laatste wedstrijd">
 <div className="latest-match-copy"><div className="latest-match-top"><span className="eyebrow">DE LAATSTE WEDSTRIJD</span><span className="latest-match-tag">{match.kind==='Beker'?'Beker':match.kind==='Oefenwedstrijd'?'Oefenwedstrijd':`Competitie${match.phase?' · fase '+match.phase:''}`}</span></div>
 <p className="latest-match-date"><CalendarDays size={16} aria-hidden="true"/><span>{new Date(match.date+'T12:00:00').toLocaleDateString('nl-NL',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · {away?'Uitwedstrijd':'Thuiswedstrijd'}</span></p>
 <div className="latest-match-layout"><div className="latest-match-scoreboard"><span className="latest-match-outcome">{outcome==='win'?'Gewonnen':outcome==='draw'?'Gelijkspel':outcome==='loss'?'Verloren':match.scoreScope||'Eindstand'}</span><div className="latest-match-fixture"><LatestClub name={homeName}/><div className="latest-match-score"><b>{score.join('–')}</b><small>{match.scoreScope||'Eindstand'}</small></div><LatestClub name={awayName}/></div></div>
 <div className="latest-match-story-panel">{report&&<><span className="latest-match-story-label">HET VERHAAL VAN DE WEDSTRIJD</span><h2 className="latest-match-story">{report.subtitle}</h2></>}
 <div className="latest-match-actions">{summary&&<a className="latest-match-primary" href={`/watch/${summary.slug}`}><Play size={17}/> Bekijk samenvatting</a>}{report&&<button className="latest-match-secondary" onClick={()=>onReport(report.id)}><BookOpen size={17}/> Lees verslag</button>}<a className="latest-match-details" href={`/wedstrijd/${match.id}`}>Wedstrijddetails <ArrowUpRight size={15}/></a></div>
 </div></div></div>
 {summary&&<a className="latest-match-video" href={`/watch/${summary.slug}`} aria-label={`Bekijk de samenvatting van ${homeName} tegen ${awayName}`}><img src={isCatalog?`/api/summary-posters/${summary.slug}`:`/summary-posters/${summary.poster}.jpg`} alt={`Wedstrijdbeeld van ${homeName} tegen ${awayName}`} width={960} height={540}/><span className="latest-match-play"><Play size={28}/></span><span className="latest-match-video-caption">Bekijk de hoogtepunten · <SummaryDuration slug={summary.slug} known={summary.detail.match(/\b\d{1,2}:\d{2}\b/)?.[0]}/></span></a>}
 {summary&&<div className="latest-match-sharing"><span>Deel de wedstrijd met het team</span><ShareSummary slug={summary.slug} title={`${homeName} – ${awayName} (${score.join('–')})`}/></div>}
 </section>;
}
