export function formatMatchDate(date:string){return new Date(date+'T12:00:00').toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric'})}
/** One consistent timeline: latest date first, including planned fixtures. */
export function compareMatchDisplay(a:{date:string},b:{date:string}){return b.date.localeCompare(a.date)}
