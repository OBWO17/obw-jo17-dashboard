'use client';
import {Share2} from 'lucide-react';
export default function ShareSummary({slug,title}:{slug:string;title:string}){
 const url=`https://obw-jo17-dashboard.vercel.app/watch/${slug}`;
 return <a className="summary-share" href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Deel ${title} via WhatsApp`}><Share2 size={16} aria-hidden="true"/> Deel via WhatsApp</a>;
}
