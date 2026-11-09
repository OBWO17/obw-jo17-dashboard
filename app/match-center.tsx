'use client';
import {matchOutcome} from './match-outcome';
type Match={score:string;scoreScope?:string;date:string;opponent:string;venue:string;kind?:string;phase?:string;kickoff?:string};
export default function MatchCenter({matches}:{matches:Match[]}){
 const played=matches.filter(m=>matchOutcome(m.score,m.scoreScope));
 const wins=played.filter(m=>matchOutcome(m.score,m.scoreScope)==='win').length;
 const draws=played.filter(m=>matchOutcome(m.score,m.scoreScope)==='draw').length;
 const losses=played.filter(m=>matchOutcome(m.score,m.scoreScope)==='loss').length;
 const latest=[...played].sort((a,b)=>b.date.localeCompare(a.date))[0];
 const next=[...matches].filter(m=>!m.score).sort((a,b)=>a.date.localeCompare(b.date))[0];
 const date=(s:string)=>new Date(s+'T12:00:00').toLocaleDateString('nl-NL',{day:'numeric',month:'long'});
 return <div className="obw-match-center">
  <div className="obw-center-intro"><span className="obw-section-kicker">SEIZOEN 2026–2027</span><h2>Ons wedstrijdcentrum</h2><p>Alle uitslagen, het programma en onze prestaties op één plek.</p></div>
  <div className="obw-match-metrics"><div className="obw-metric-played"><div className="obw-metric-icon">⚽</div><small>GESPEELD</small><strong>{played.length}</strong><span>wedstrijden</span></div><div className="obw-metric-win"><div className="obw-metric-icon">🏆</div><small>GEWONNEN</small><strong>{wins}</strong><span>overwinningen</span></div><div className="obw-metric-draw"><div className="obw-metric-icon">🤝</div><small>GELIJK</small><strong>{draws}</strong><span>gelijke spelen</span></div><div className="obw-metric-loss"><div className="obw-metric-icon">⚑</div><small>VERLOREN</small><strong>{losses}</strong><span>nederlagen</span></div></div>
  <div className="obw-match-highlights">
   {latest&&<div className="obw-match-highlight obw-match-featured"><small>LAATSTE UITSLAG · {date(latest.date)}</small><div className="obw-match-highlight-score"><span><img src="/clubs/obw.png" alt="" />OBW JO17-1</span><strong>{latest.score.replace('-', ' – ')}</strong><span>{latest.opponent}</span></div><div className={'obw-result-tag obw-tag-'+matchOutcome(latest.score,latest.scoreScope)}>{matchOutcome(latest.score,latest.scoreScope)==='win'?'Gewonnen':matchOutcome(latest.score,latest.scoreScope)==='draw'?'Gelijkspel':'Verloren'} · {latest.venue==='Uit'?'Uitwedstrijd':'Thuiswedstrijd'}</div></div>}
   {next&&<div className="obw-match-highlight obw-match-next"><small>VOLGENDE WEDSTRIJD · {date(next.date)}</small><div className="obw-match-highlight-score"><span><img src="/clubs/obw.png" alt="" />OBW JO17-1</span><strong>VS</strong><span>{next.opponent}</span></div><div className="obw-result-tag obw-tag-next">{next.venue==='Uit'?'Uit':'Thuis'}{next.kickoff?' · '+next.kickoff+' uur':''}</div></div>}
  </div>
 </div>;
}
