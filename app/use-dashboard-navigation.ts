'use client';
import {useCallback,useEffect,useState} from 'react';

/** Keep dashboard tabs in browser history, so mobile Back returns to the previous tab. */
export function useDashboardNavigation(validTabs:readonly string[]){
 const [tab,setTab]=useState('Overzicht');
 useEffect(()=>{
  const read=()=>{const name=new URLSearchParams(window.location.search).get('tab');return name&&validTabs.includes(name)?name:'Overzicht'};
  setTab(read());
  const onPop=()=>{setTab(read());window.scrollTo({top:0,behavior:'instant'})};
  window.addEventListener('popstate',onPop);
  return()=>window.removeEventListener('popstate',onPop);
 },[validTabs]);
 const navigate=useCallback((name:string)=>{
  if(!validTabs.includes(name))return;
  const url=new URL(window.location.href);
  if(name==='Overzicht')url.searchParams.delete('tab');else url.searchParams.set('tab',name);
  if(url.href!==window.location.href)window.history.pushState({obwTab:name},'',url.pathname+url.search+url.hash);
  setTab(name);
  window.scrollTo({top:0,behavior:'smooth'});
 },[validTabs]);
 return [tab,navigate] as const;
}
