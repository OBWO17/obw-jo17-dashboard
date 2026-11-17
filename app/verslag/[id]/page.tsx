import {notFound} from 'next/navigation';
import MatchReports from '../../match-reports';
import {reportPreviews} from '../../../lib/match-reports-data';
export default async function ReportPage({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!reportPreviews.some(r=>r.id===id))notFound();return <main className="team-detail-page"><nav className="detail-breadcrumb"><a href="/">Overzicht</a><span>/</span><a href="/?tab=Wedstrijdverslagen">Wedstrijdverslagen</a></nav><MatchReports selectedId={id}/></main>}
