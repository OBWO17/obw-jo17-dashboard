import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {authConfig} from './config';
export async function serverClient(){
 const config=authConfig();if(!config)return null;
 const jar=await cookies();
 return createServerClient(config.url,config.key,{cookies:{
  getAll:()=>jar.getAll(),
  setAll:items=>{
   try{for(const {name,value,options} of items)jar.set(name,value,{...options,httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/'});}
   catch{/* Proxy refreshes cookies when rendering Server Components. */}
  }
 }});
}
export async function teamMember(){
 const client=await serverClient();if(!client)return null;
 const {data:{user},error}=await client.auth.getUser();if(error||!user)return null;
 const {data:member,error:memberError}=await client.from('app_members').select('role,active').eq('user_id',user.id).eq('active',true).maybeSingle();
 if(memberError||!member||!['admin','viewer'].includes(member.role))return null;
 return {client,user,role:member.role as 'admin'|'viewer'};
}
