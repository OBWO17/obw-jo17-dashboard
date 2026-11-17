'use client';
import {useEffect,useState} from 'react';
import {summaryCatalog} from '../lib/summary-catalog';
import ShareSummary from './share-summary';
import {reportPreviews} from '../lib/match-reports-data';
import {Play,ArrowUpRight} from 'lucide-react';
const summaries=[
 {home:'OBW O17-1',away:"Blauw Geel ’55 O17-1",score:'2–2',date:'31 oktober 2026',detail:'Wedstrijdsamenvatting · wedstrijdklok',label:'Samenvatting',poster:'obw-blauw-geel',slug:'obw-blauw-geel-20261031',file:'libfile_1d68f4abdc6c81919637d2069d7aa640'},
 {home:'SKV O17-1',away:'OBW O17-1',score:'2–1',date:'24 oktober 2026',detail:'Alleen de eerste helft · gecorrigeerde versie 3',label:'Alleen eerste helft',poster:'skv-obw-20261024',slug:'skv-obw-eerste-helft-20261024',file:'libfile_f6fdb0285d0c819185c8ec921be30d41'}
];
const extraSummaries=summaryCatalog.map(s=>({...s,label:'Samenvatting',poster:s.slug,file:''}));
export const summaryEntries=[...summaries,...extraSummaries];
export function useSummaryAvailability(enabled=true){
 const [available,setAvailable]=useState<string[]|null>(null);
 useEffect(()=>{if(!enabled)return;let active=true;fetch('/api/summary-status',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>{if(active)setAvailable(Array.isArray(d?.slugs)?d.slugs:[])}).catch(()=>{if(active)setAvailable([])});return()=>{active=false}},[enabled]);
 return available;
}
export default function MatchSummaries({privatePlayback=false,limit,onViewAll}:{privatePlayback?:boolean;limit?:number;onViewAll?:()=>void}){
 const [filter,setFilter]=useState('alles');
 const available=useSummaryAvailability(privatePlayback);
 const phaseOf=(s:typeof summaryEntries[number])=>s.detail.startsWith('Oefenwedstrijd')?'oefen':(s.slug.match(/\d{8}$/)?.[0]||'')<'20261017'?'1':'2';
 const visible=summaryEntries.filter(s=>!privatePlayback||available?.includes(s.slug)).sort((a,b)=>(b.slug.match(/\d{8}/)?.[0]||'').localeCompare(a.slug.match(/\d{8}/)?.[0]||''));
 const displayed=limit?visible.slice(0,limit):visible.filter(s=>filter==='alles'||phaseOf(s)===filter);
 return <section className="match-summaries" aria-label="Wedstrijdsamenvattingen">
 {!limit&&<div className="section-heading"><div><span className="eyebrow">BELEEF DE WEDSTRIJD</span><p>De mooiste momenten van ons team, terug om te kijken.</p></div></div>}
 {!limit&&<div className="archive-filters" aria-label="Filter samenvattingen">{[['alles','Alle samenvattingen'],['1','Fase 1'],['2','Fase 2'],['oefen','Oefenwedstrijden']].map(([value,label])=><button type="button" key={value} aria-pressed={filter===value} className={filter===value?'selected':''} onClick={()=>setFilter(value)}>{label}</button>)}</div>}
 {privatePlayback&&available===null?<p role="status" className="summary-loading">Wedstrijdbeelden laden…</p>:<div className="summaries-grid">{displayed.map(s=>{
 const href=privatePlayback?`/watch/${s.slug}`:`https://chatgpt.com/library?file_id=${s.file}&account_id=personal`;
 const duration=s.detail.match(/\b\d{1,2}:\d{2}\b/)?.[0];
 const phase=phaseOf(s)==='oefen'?'Oefenwedstrijd':'Fase '+phaseOf(s);const rawDate=s.slug.match(/\d{8}$/)?.[0]||'';const report=reportPreviews.find(r=>r.date.replaceAll('-','')===rawDate);
 return <article className="summary-card" key={s.slug}>
 <a className="summary-visual" href={href} aria-label={`Bekijk ${s.home} – ${s.away}, ${s.score}`}><div className="summary-art summary-photo"><img src={extraSummaries.some(x=>x.slug===s.slug)?`/api/summary-posters/${s.slug}`:`/summary-posters/${s.poster}.jpg`} alt={`Wedstrijdbeeld: ${s.home} tegen ${s.away}`} width={960} height={540} loading="lazy"/><span className="summary-kind">{s.label==='Alleen eerste helft'?'Eerste helft':'Samenvatting'}</span><span className="summary-play" aria-hidden="true"><Play size={26}/></span>{duration&&<span className="summary-duration">{duration}</span>}</div></a>
 <div className="summary-caption"><div className="summary-result"><strong>{s.home}</strong><b>{s.score}</b><strong>{s.away}</strong></div><p className="summary-meta">{s.date}{phase&&` · ${phase}`} · {duration||'Speelduur bij afspelen'}</p>{report&&<a className="summary-report-link" href={`/verslag/${report.id}`}>Lees ook het verslag <ArrowUpRight size={14} aria-hidden="true"/></a>}<div className="summary-actions"><a className="summary-open" href={href}>Bekijk samenvatting <ArrowUpRight size={16}/></a>{privatePlayback&&<ShareSummary slug={s.slug} title={`${s.home} – ${s.away} (${s.score})`}/>}</div></div>
 </article>})}</div>}
 {available!==null&&visible.length>0&&displayed.length===0&&<p>Geen samenvattingen in deze selectie.</p>}
 {privatePlayback&&available?.length===0&&<p>Er zijn op dit moment geen samenvattingen beschikbaar. Probeer de pagina opnieuw te laden.</p>}
 {!limit&&<p className="summary-access">De samenvattingen zijn beschikbaar voor toegelaten ouders, spelers en begeleiding.</p>}
 </section>
}
