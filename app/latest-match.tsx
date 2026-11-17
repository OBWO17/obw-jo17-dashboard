'use client';
import {ArrowUpRight,BookOpen,Play} from 'lucide-react';
import type {HomeMatch} from './team-homepage';
import {reportPreviews} from './match-reports';
import {summaryEntries,useSummaryAvailability} from './match-summaries';
import ShareSummary from './share-summary';
export default function LatestMatch({match,onMatch,onReport}:{match:HomeMatch;onMatch:(m:HomeMatch)=>void;onReport:(id:string)=>void}){
 const available=useSummaryAvailability();
 const report=reportPreviews.find(r=>r.date===match.date);
 const summary=summaryEntries.find(s=>s.slug.endsWith(match.date.replaceAll('-',''))&&available?.includes(s.slug));
 const away=match.venue==='Uit';
 const homeName=away?match.opponent:'OBW O17-1',awayName=away?'OBW O17-1':match.opponent;
 const score=match.score.split(/\s*[-–:]\s*/);if(away)score.reverse();
 const isCatalog=summary&&'filename' in summary;
 return <section className="latest-match" aria-label="Laatste wedstrijd">
 <div className="latest-match-copy"><div className="latest-match-top"><span className="eyebrow">DE LAATSTE WEDSTRIJD</span><span className="latest-match-tag">{match.kind==='Beker'?'Beker':match.kind==='Oefenwedstrijd'?'Oefenwedstrijd':`Competitie${match.phase?' · fase '+match.phase:''}`}</span></div>
 <p className="latest-match-date">{new Date(match.date+'T12:00:00').toLocaleDateString('nl-NL',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · {away?'Uitwedstrijd':'Thuiswedstrijd'}</p>
 <div className="latest-match-fixture"><strong>{homeName}</strong><div><b>{score.join('–')}</b><small>{match.scoreScope||'Eindstand'}</small></div><strong>{awayName}</strong></div>
 {report&&<h2 className="latest-match-story">{report.subtitle}</h2>}
 <div className="latest-match-actions">{summary&&<a className="latest-match-primary" href={`/watch/${summary.slug}`}><Play size={17}/> Bekijk samenvatting</a>}{report&&<button className="latest-match-secondary" onClick={()=>onReport(report.id)}><BookOpen size={17}/> Lees verslag</button>}<a className="latest-match-details" href={`/wedstrijd/${match.id}`}>Wedstrijddetails <ArrowUpRight size={15}/></a></div>
 </div>
 {summary&&<a className="latest-match-video" href={`/watch/${summary.slug}`} aria-label={`Bekijk de samenvatting van ${homeName} tegen ${awayName}`}><img src={isCatalog?`/api/summary-posters/${summary.slug}`:`/summary-posters/${summary.poster}.jpg`} alt={`Wedstrijdbeeld van ${homeName} tegen ${awayName}`} width={960} height={540}/><span className="latest-match-play"><Play size={28}/></span><span className="latest-match-video-caption">Bekijk de hoogtepunten{summary.detail.match(/\b\d{1,2}:\d{2}\b/)?.[0]&&` · ${summary.detail.match(/\b\d{1,2}:\d{2}\b/)?.[0]}`}</span></a>}
 {summary&&<div className="latest-match-sharing"><span>Deel de wedstrijd met het team</span><ShareSummary slug={summary.slug} title={`${homeName} – ${awayName} (${score.join('–')})`}/></div>}
 </section>;
}
