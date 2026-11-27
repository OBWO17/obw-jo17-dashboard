export const electionSeason='2026-2027';
export type GoalCandidate={id:string;slot:number;player:string;opponent:string;date:string;caption:string;votes?:number};
export type Election={status:'draft'|'open'|'closed';stage:'selection'|'final';round:number;revision:number;admin:boolean;myVote:string|null;candidates:GoalCandidate[]};
export const uuidPattern=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
