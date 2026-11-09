/** Scores are stored OBW-first, regardless of home/away. */
export function matchOutcome(score:string,scope?:string):'win'|'draw'|'loss'|null{
 if(!score||scope==='Ruststand')return null;
 const parts=score.trim().match(/^(\d+)\s*[-:]\s*(\d+)$/);
 if(!parts)return null;
 const own=Number(parts[1]),against=Number(parts[2]);
 return own>against?'win':own<against?'loss':'draw';
}
