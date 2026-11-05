"""Check fail-closed routing without a configured Auth backend; no real users."""
import os,subprocess,time,urllib.request,urllib.error,json,socket
with socket.socket() as probe:
 probe.bind(("127.0.0.1",0));port=str(probe.getsockname()[1])
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args):return None
env=os.environ.copy()
for key in ('NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'):env.pop(key,None)
server=subprocess.Popen(['node','node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',port],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
opener=urllib.request.build_opener(NoRedirect)
try:
 for _ in range(100):
  try:opener.open('http://127.0.0.1:'+port+'/login',timeout=1);break
  except (urllib.error.URLError,TimeoutError):time.sleep(.1)
 else:raise RuntimeError('Test server did not start')
 checks=[]
 for path,expected in [('/',307),('/portraits/player-1.webp',307),('/obw-jo17-team.webp',307),('/api/stand',401),('/api/videos/skv-obw-eerste-helft-20261024',401),('/watch/skv-obw-eerste-helft-20261024',307),('/login',200)]:
  try:r=opener.open('http://127.0.0.1:'+port+''+path,timeout=15)
  except urllib.error.HTTPError as e:r=e
  body=r.read().decode(errors='replace')
  assert r.code==expected,(path,r.code)
  if path=='/login':assert 'De besloten omgeving wordt ingericht' in body and 'Foto van Jos' not in body
  checks.append({'path':path,'status':r.code})
 req=urllib.request.Request('http://127.0.0.1:'+port+'/auth/sign-in',data=b'email=test%40example.invalid&password=test',headers={'Origin':'https://other.example','Content-Type':'application/x-www-form-urlencoded'})
 try:r=opener.open(req,timeout=15)
 except urllib.error.HTTPError as e:r=e
 assert r.code==403
 print(json.dumps({'missing_configuration_checks':checks,'cross_origin_login':403}))
finally:
 server.terminate()
 try:server.wait(timeout=5)
 except subprocess.TimeoutExpired:server.kill()

