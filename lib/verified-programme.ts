/** Latest programme corrections verified on Voetbal.nl, 23 November 2026. */
export function applyVerifiedProgramme<T extends {date:string;opponent:string}>(matches:T[]):T[]{
 return matches.map(m=>(m.date==='2026-11-28'||m.date==='2026-11-30')&&/^De Bataven\b/i.test(m.opponent)?{...m,date:'2026-11-30',kickoff:'20:00',field:'veld 1',location:'Sportpark Walburgen',address:'Nijmeegsestraat 65 B, 6691 CM Gendt'}:m.date==='2026-12-05'&&/^AVW\b/i.test(m.opponent)?{...m,kickoff:'12:00',field:'Hoofdveld-OBW',location:'Sportpark Hengelder',address:'Marconistraat 16, 6902 PC Zevenaar'}:m);
}
export const programmeCheckedOn='23 november 2026';
