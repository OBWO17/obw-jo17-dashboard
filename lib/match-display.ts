export function formatMatchDate(date:string){return new Date(date+'T12:00:00').toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric'})}
/** Upcoming fixtures first, nearest first; completed matches newest first. */
export function compareMatchDisplay(a:{date:string;score:string},b:{date:string;score:string}){const aPlayed=Boolean(a.score),bPlayed=Boolean(b.score);if(aPlayed!==bPlayed)return aPlayed?1:-1;return aPlayed?b.date.localeCompare(a.date):a.date.localeCompare(b.date)}
