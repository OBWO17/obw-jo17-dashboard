const staff=[
 {name:'Jos Boonman',role:'Trainer / coach',image:'jos',description:'Verzorgt de trainingen en bepaalt de opstelling. Bereidt het team voor met de wedstrijdbespreking en coacht de jongens tijdens de wedstrijden.'},
 {name:'Ralph Wolters',role:'Assistent-trainer',image:'ralph',description:'Assisteert bij de trainingen en coaching, met extra aandacht voor individuele spelers. Helpt bij het losmaken van spieren en denkt bij pijnklachten mee over wat een speler op dat moment nodig heeft.'},
 {name:'René Zweers',role:'Assistent-trainer',image:'rene',description:'Assisteert bij de trainingen en verzorgt de loop- en conditietraining. Schiet de keeper voor de wedstrijden in en ondersteunt het team met allerlei praktische hand- en spandiensten.'}
];
export default function TeamStaff({standalone=false}:{standalone?:boolean}){return <section className="obw-staff-page">
 <header className="obw-staff-hero"><div className="obw-staff-kicker">DE MENSEN ACHTER HET TEAM · SEIZOEN 2026–2027</div>{standalone?<h1>Onze staf</h1>:<h2>Onze staf</h2>}<p>Samen werken aan ontwikkeling, plezier en prestaties.</p></header>
 <div className="obw-staff-grid">{staff.map(p=><article key={p.image} className="obw-staff-card"><div className="obw-staff-portrait"><img src={`/portraits/staff-${p.image}.webp`} alt={`Foto van ${p.name}`} width={480} height={720}/></div><div className="obw-staff-caption"><span>{p.role}</span><h3>{p.name}</h3><p className="obw-staff-description">{p.description}</p></div></article>)}</div>
 <footer className="obw-staff-footer"><span className="obw-staff-footer-icon" aria-hidden="true">⚽</span><div><h3>Samen voor OBW O17-1</h3><p>Met aandacht voor iedere speler bouwen we samen aan een hecht team, ontwikkeling en voetbalplezier.</p></div></footer>
 </section>}