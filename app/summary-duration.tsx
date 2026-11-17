'use client';
import {useEffect,useRef,useState} from 'react';
const cachedDurations=new Map<string,string>();
export default function SummaryDuration({slug,known}:{slug:string;known?:string}){
 const [duration,setDuration]=useState(known||cachedDurations.get(slug)||'');const [failed,setFailed]=useState(false);const [near,setNear]=useState(false);const ref=useRef<HTMLSpanElement>(null);
 useEffect(()=>{if(duration||!ref.current)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setNear(true);observer.disconnect()}},{rootMargin:'200px'});observer.observe(ref.current);return()=>observer.disconnect()},[duration]);
 return <span ref={ref} className="summary-runtime">{duration|| (failed?'Speelduur niet beschikbaar':'Speelduur laden…')}{!duration&&near&&!failed&&<video hidden aria-hidden="true" preload="metadata" src={`/api/videos/${slug}`} onLoadedMetadata={e=>{const seconds=e.currentTarget.duration;if(Number.isFinite(seconds)&&seconds>0){const total=Math.round(seconds);const value=`${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;cachedDurations.set(slug,value);setDuration(value)}else setFailed(true);e.currentTarget.removeAttribute('src');e.currentTarget.load()}} onError={()=>setFailed(true)}/>}</span>
}
