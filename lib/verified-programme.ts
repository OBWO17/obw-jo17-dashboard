/** Latest programme corrections verified on Voetbal.nl, 17 November 2026. */
export function applyVerifiedProgramme<T extends {date:string;opponent:string}>(matches:T[]):T[]{
 return matches.map(m=>m.date==='2026-12-05'&&/^AVW\b/i.test(m.opponent)?{...m,kickoff:'12:00',field:'Hoofdveld-OBW',location:'Sportpark Hengelder',address:'Marconistraat 16, 6902 PC Zevenaar'}:m);
}
export const programmeCheckedOn='17 november 2026';
