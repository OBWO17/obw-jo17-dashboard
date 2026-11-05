begin;
create table public.app_members(user_id uuid primary key references auth.users(id) on delete cascade, role text not null default 'viewer' check(role in ('admin','viewer')),active boolean not null default true);
alter table public.app_members enable row level security;
revoke all on public.app_members from anon,authenticated;
grant select on public.app_members to authenticated;
create policy "Read own team membership" on public.app_members for select to authenticated using(user_id=(select auth.uid()));
create function public.has_team_access() returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.app_members where user_id=(select auth.uid()) and active=true)$$;
revoke all on function public.has_team_access() from public,anon;
grant execute on function public.has_team_access() to authenticated;
create table public.team_videos(slug text primary key check(slug ~ '^[a-z0-9-]{1,80}$'),title text not null,description text not null default '',storage_path text not null unique,published boolean not null default false);
alter table public.team_videos enable row level security;
revoke all on public.team_videos from anon,authenticated;
grant select on public.team_videos to authenticated;
create policy "Team members read published video metadata" on public.team_videos for select to authenticated using(published and (select public.has_team_access()));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('team-videos','team-videos',false,52428800,array['video/mp4']);
create policy "Team members read published videos" on storage.objects for select to authenticated using(bucket_id='team-videos' and (select public.has_team_access()) and exists(select 1 from public.team_videos where storage_path=name and published));
insert into public.team_videos(slug,title,description,storage_path,published) values
 ('obw-blauw-geel-20261031','OBW – Blauw Geel','31 oktober 2026 · wedstrijdsamenvatting','obw-blauw-geel-20261031.mp4',false),
 ('skv-obw-eerste-helft-20261024','SKV – OBW','24 oktober 2026 · alleen de eerste helft · gecorrigeerde versie 3','skv-obw-eerste-helft-20261024.mp4',false);
commit;
