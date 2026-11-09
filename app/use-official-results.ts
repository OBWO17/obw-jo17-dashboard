'use client';
import {useEffect,useState} from 'react';
type Result={date:string;score:string};
export function useOfficialResults(){
 const [results,setResults]=useState<Result[]>([]);
 useEffect(()=>{
  let active=true;
  const refresh=async()=>{try{const response=await fetch('/api/results',{cache:'no-store'});if(!response.ok)return;const data=await response.json();if(active&&Array.isArray(data.results))setResults(data.results.filter((r:Result)=>/^20\\d{2}-\\d{2}-\\d{2}$/.test(r.date)&&/^\\d{1,2}-\\d{1,2}$/.test(r.score)));}catch{}};
  void refresh();const timer=setInterval(()=>void refresh(),300000);
  return()=>{active=false;clearInterval(timer)};
 },[]);
 return results;
}
