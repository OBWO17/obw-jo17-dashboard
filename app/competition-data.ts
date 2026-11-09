// Public OBW competition pages, checked 4 November 2026. This is a dated snapshot.
export const checkedOn='9 november 2026';
export const phases=[{id:'1',name:'1e klasse Zwaluwen Jeugd (1e fase) 07',url:'https://www.obw.nl/857/5039/competitie/',rows:[['OBW O17-1',5,4,1,0,13,14,7],["GSV '38 O17-1JM",5,3,0,2,9,20,12],["DVC '26 O17-1",5,2,2,1,8,10,5],['Concordia-W O17-1',5,2,1,2,7,10,9],['Angerlo Vooruit O17-1',5,2,0,3,6,16,14],['DCS O17-2',5,0,0,5,0,3,26]]},{id:'2',name:'Hoofdklasse (2e fase) D',url:'https://www.voetbal.nl/team/T47549040/stand',rows:[["AVW '66 O17-1",3,3,0,0,9,15,2],["De Bataven O17-1",3,2,0,1,6,8,8],["OBW O17-1",3,1,1,1,4,5,5],["Blauw Geel '55 O17-1",3,1,1,1,4,10,11],["Woezik O17-1",3,1,0,2,3,11,7],["SKV O17-1",3,1,0,2,3,5,7],["DCS O17-1",3,1,0,2,3,4,7],["Quick 1888 O17-1",3,1,0,2,3,5,16]]}];
type Fixture=[string,string,string,string,string,string];
// date, opponent, home/away, OBW score first, kickoff, phase
const fixtures:Fixture[]=[['2026-09-05','Concordia-W O17-1','Uit','3-0','','1'],['2026-09-12','DCS O17-2','Thuis','3-1','','1'],['2026-09-19',"GSV '38 O17-1JM",'Uit','4-3','','1'],['2026-09-26','Angerlo Vooruit O17-1','Uit','2-1','','1'],['2026-10-03',"DVC '26 O17-1",'Thuis','2-2','','1'],['2026-10-24','SKV O17-1','Uit','1-2','14:45','2'],['2026-10-31',"Blauw Geel '55 O17-1",'Thuis','2-2','','2'],['2026-11-07','DCS O17-1','Uit','2-1','12:00','2'],['2026-11-14','Woezik O17-1','Thuis','','17:15','2'],['2026-11-21','Quick 1888 O17-1','Uit','','13:45','2'],['2026-11-28','De Bataven O17-1','Uit','','13:30','2'],['2026-12-05',"AVW '66 O17-1",'Thuis','','15:45','2']];
// Goal allocations transcribed from the trainer's seven Voetbal.nl screenshots.
// Store the existing dashboard display names, without expanding player profiles.
const confirmedScorers:Record<string,[number,string][]>={
 '2026-09-05':[[7,'Luuk'],[16,'Dustin'],[3,'Koen']],
 '2026-09-12':[[9,'Finn'],[4,'Jip'],[10,'Jurre']],
 '2026-09-19':[[4,'Jip'],[9,'Finn'],[15,'Tim'],[11,'Chris']],
 '2026-09-26':[[10,'Jurre'],[9,'Finn']],
 '2026-10-03':[[15,'Tim'],[2,'Loek Prins']],
 '2026-10-24':[[7,'Luuk']],
 '2026-10-31':[[12,'Joep'],[15,'Tim']],
 '2026-11-07':[[15,'Tim']]
};
export function confirmedGoals(date:string){return confirmedScorers[date]?.map(([number,name])=>({playerId:`obw-player-${number}`,name,count:date==='2026-11-07'&&number===15?2:1}))}
export function applyConfirmedGoals<T extends {date:string;opponent:string;id:string}>(matches:T[]):T[]{return matches.map(m=>{const fixture=fixtures.find(f=>f[0]===m.date&&(m.id===`obw-official-${m.date}`||m.id==='obw-skv-20261024'||m.id==='obw-bg-20261031'||m.opponent.toLowerCase().split(' ')[0]===f[1].toLowerCase().split(' ')[0]));const goals=fixture?confirmedGoals(m.date):undefined;return goals?{...m,goals}:m})}
export const officialMatches=fixtures.map(([date,opponent,venue,score,kickoff,phase])=>({id:date==='2026-10-24'?'obw-skv-20261024':date==='2026-10-31'?'obw-bg-20261031':`obw-official-${date}`,date,opponent,venue,score,kickoff,phase,scoreScope:'Eindstand',notes:date==='2026-10-24'?'Alleen de eerste helft is gefilmd. Officiële eindstand: SKV 2–1 OBW.':'',veo:'',goals:confirmedGoals(date)||[],source:phases.find(p=>p.id===phase)!.url}));

export const friendlyMatches=[{id:'obw-friendly-20260825',date:'2026-08-25',opponent:'Angerlo O17-1',venue:'Uit',score:'1-3',scoreScope:'Eindstand',kickoff:'',notes:'Oefenwedstrijd. Doelpunt OBW: Daan. Aangeleverd door de trainer.',veo:'',kind:'Oefenwedstrijd',goals:[{playerId:'obw-player-8',name:'Daan',count:1}]},{id:'obw-friendly-20261017',date:'2026-10-17',opponent:'DOVO O17-3',venue:'Uit',score:'0-2',scoreScope:'Eindstand',kickoff:'',notes:'Oefenwedstrijd. Aangeleverd door de trainer.',veo:'',kind:'Oefenwedstrijd',goals:[]}];

// Cup fixture supplied by the trainer from Voetbal.nl; kickoff and field supplied by the trainer.
export const cupMatches=[{id:'obw-cup-20261212-sml',date:'2026-12-12',opponent:'SML O17-1',venue:'Thuis',score:'',scoreScope:'Eindstand',kickoff:'15:00',field:'Veld 1',notes:'Veld 1 bij OBW. Bekerwedstrijd. Geplaatst na het kampioenschap in fase 1. Datum en tegenstander aangeleverd door de trainer vanuit Voetbal.nl.',veo:'',kind:'Beker',goals:[]}];
