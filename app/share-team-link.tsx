'use client';
export default function ShareTeamLink({path,title}:{path:string;title:string}){return <a className="summary-share" href={`https://wa.me/?text=${encodeURIComponent(title+' '+ 'https://obw-jo17-dashboard.vercel.app'+path)}`} target="_blank" rel="noopener noreferrer">Deel via WhatsApp ↗</a>}
