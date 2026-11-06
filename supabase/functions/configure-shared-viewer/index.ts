// @ts-nocheck — Deployed in the Supabase Deno runtime.
import {createClient} from 'npm:@supabase/supabase-js@2.119.0';
const EMAIL='ouders-spelers@obw-o17.invalid';
Deno.serve(async(req:Request)=>{
 const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
 if(req.method!=='POST')return json({error:'Niet toegestaan'},405);
 const authorization=req.headers.get('Authorization')||'';
 const url=Deno.env.get('SUPABASE_URL')||'';
 const caller=createClient(url,Deno.env.get('SUPABASE_ANON_KEY')||'',{global:{headers:{Authorization:authorization}},auth:{persistSession:false}});
 const {data:{user},error}=await caller.auth.getUser(authorization.replace(/^Bearer /,''));
 if(error||!user)return json({error:'Geen toegang'},401);
 const {data:member}=await caller.from('app_members').select('role,active').eq('user_id',user.id).eq('active',true).maybeSingle();
 if(member?.role!=='admin')return json({error:'Alleen voor de beheerder'},403);
 const body=await req.json().catch(()=>null);
 if(typeof body?.password!=='string'||body.password.length<12||body.password.length>128)return json({error:'Kies een wachtwoord van 12 tot 128 tekens.'},400);
 const admin=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'',{auth:{persistSession:false,autoRefreshToken:false}});
 const listed=await admin.auth.admin.listUsers({page:1,perPage:1000});
 if(listed.error)return json({error:'Account controleren mislukt.'},503);
 const existing=listed.data.users.find(u=>u.email===EMAIL);
 if(existing){
  const {data:m}=await admin.from('app_members').select('role,active').eq('user_id',existing.id).maybeSingle();
  if(m?.role==='admin'||m?.active)return json({error:'De bezoekersinlog bestaat al. Gebruik het eerder ingestelde wachtwoord.'},409);
 }
 const result=existing?await admin.auth.admin.updateUserById(existing.id,{password:body.password,email_confirm:true}):await admin.auth.admin.createUser({email:EMAIL,password:body.password,email_confirm:true});
 if(result.error||!result.data.user)return json({error:'Account aanmaken mislukt. Kies een ander sterk wachtwoord en probeer opnieuw.'},400);
 const saved=await admin.from('app_members').upsert({user_id:result.data.user.id,role:'viewer',active:true});
 if(saved.error)return json({error:'Kijkrechten instellen mislukt. Probeer opnieuw.'},503);
 return json({success:true});
});
