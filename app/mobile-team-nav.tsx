'use client';
import {House,Trophy,CalendarDays,Target} from 'lucide-react';
const tabs=[['Overzicht',House],['Wedstrijden',CalendarDays],['Competitie',Trophy],['Topscorers',Target]] as const;
export default function MobileTeamNav({active,onNavigate}:{active:string;onNavigate:(tab:string)=>void}){return <nav className="obw-mobile-bottom-nav" aria-label="Snelle navigatie">{tabs.map(([tab,Icon])=><button type="button" key={tab} className={active===tab?'active':''} aria-current={active===tab?'page':undefined} onClick={()=>onNavigate(tab)}><Icon size={21} strokeWidth={active===tab?2.6:1.8}/><span>{tab}</span></button>)}</nav>}
