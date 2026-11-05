import {createServerClient} from '@supabase/ssr';
import {NextResponse,type NextRequest} from 'next/server';
import {authConfig} from './lib/supabase/config';
export async function proxy(request:NextRequest){
 const path=request.nextUrl.pathname;
 if(path==='/login'||path==='/auth/sign-in'||path==='/auth/sign-out'||path.startsWith('/_next/static/')||path==='/favicon.ico'||path.startsWith('/sponsors/'))return NextResponse.next();
 let response=NextResponse.next({request});
 const deny=()=>{const denied=path.startsWith('/api/')?NextResponse.json({error:'Inloggen met een toegelaten account is vereist.'},{status:401}):NextResponse.redirect(new URL('/login',request.url));for(const c of response.cookies.getAll())denied.cookies.set(c);denied.headers.set('Cache-Control','private, no-store');return denied};
 const config=authConfig();if(!config)return deny();
 try{const client=createServerClient(config.url,config.key,{cookies:{getAll:()=>request.cookies.getAll(),setAll:items=>{items.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});items.forEach(({name,value,options})=>response.cookies.set(name,value,{...options,httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/'}))}}});
 const {data:{user},error}=await client.auth.getUser();if(error||!user)return deny();
 const {data:member,error:memberError}=await client.from('app_members').select('role').eq('user_id',user.id).eq('active',true).maybeSingle();if(memberError||!member||!['admin','viewer'].includes(member.role))return deny();
 response.headers.set('Cache-Control','private, no-store');return response;
 }catch{return deny()}
}
export const config={matcher:['/((?!_next/static|favicon.ico).*)']};
