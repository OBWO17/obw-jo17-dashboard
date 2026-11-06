import {NextResponse,type NextRequest} from 'next/server';
import {teamMember} from '../../../lib/supabase/server';
export const dynamic='force-dynamic';
export async function POST(request:NextRequest){
 const member=await teamMember();if(!member)return new Response('Inloggen vereist',{status:401});if(member.role!=='admin')return new Response('Geen beheerrechten',{status:403});
 if(request.headers.get('origin')!==request.nextUrl.origin)return new Response('Niet toegestaan',{status:403});
 const go=(status:string)=>NextResponse.redirect(new URL('/beheer/bezoekers?status='+status,request.url),303);
 const form=await request.formData();const password=String(form.get('password')||'');if(password.length<12||password.length>128||password!==String(form.get('confirm')||''))return go('invalid');
 const {data,error}=await member.client.functions.invoke('configure-shared-viewer',{body:{password}});
 if(error||!data?.success)return go('failed');return go('success');
}
