import {NextResponse,type NextRequest} from 'next/server';
import {serverClient} from '../../../lib/supabase/server';
export async function POST(request:NextRequest){if(request.headers.get('origin')!==request.nextUrl.origin)return new Response('Niet toegestaan',{status:403});const client=await serverClient();if(client)await client.auth.signOut({scope:'local'});return NextResponse.redirect(new URL('/login',request.url),303)}
