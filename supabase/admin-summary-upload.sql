insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('team-posters','team-posters',false,2097152,array['image/jpeg']) on conflict(id) do nothing;
create policy "Admin reads summary uploads" on storage.objects for select to authenticated using (
 bucket_id in ('team-videos','team-posters') and exists(select 1 from public.app_members where user_id=(select auth.uid()) and active and role='admin')
);
create policy "Admin inserts approved summaries" on storage.objects for insert to authenticated with check (
 ((bucket_id='team-videos' and name in ('20260825-samenvatting-gecorrigeerd.mp4','20260926-samenvatting-gecorrigeerd.mp4','20261003-samenvatting-gecorrigeerd.mp4')) or
 (bucket_id='team-posters' and name in ('angerlo-obw-20260825.jpg','angerlo-obw-20260926.jpg','obw-dvc-20261003.jpg')))
 and exists(select 1 from public.app_members where user_id=(select auth.uid()) and active and role='admin')
);
create policy "Admin retries approved summaries" on storage.objects for update to authenticated using (
 ((bucket_id='team-videos' and name in ('20260825-samenvatting-gecorrigeerd.mp4','20260926-samenvatting-gecorrigeerd.mp4','20261003-samenvatting-gecorrigeerd.mp4')) or
 (bucket_id='team-posters' and name in ('angerlo-obw-20260825.jpg','angerlo-obw-20260926.jpg','obw-dvc-20261003.jpg')))
 and exists(select 1 from public.app_members where user_id=(select auth.uid()) and active and role='admin')
) with check (
 ((bucket_id='team-videos' and name in ('20260825-samenvatting-gecorrigeerd.mp4','20260926-samenvatting-gecorrigeerd.mp4','20261003-samenvatting-gecorrigeerd.mp4')) or
 (bucket_id='team-posters' and name in ('angerlo-obw-20260825.jpg','angerlo-obw-20260926.jpg','obw-dvc-20261003.jpg')))
 and exists(select 1 from public.app_members where user_id=(select auth.uid()) and active and role='admin')
);
create policy "Members read published summary posters" on storage.objects for select to authenticated using (
 bucket_id='team-posters' and (select public.has_team_access()) and exists(select 1 from public.team_videos where published and slug||'.jpg'=storage.objects.name)
);
create policy "Admin reads unpublished summaries" on public.team_videos for select to authenticated using (exists(select 1 from public.app_members where user_id=(select auth.uid()) and active and role='admin'));
grant update(published) on public.team_videos to authenticated;
create policy "Admin publishes approved summaries" on public.team_videos for update to authenticated using (
 slug in ('angerlo-obw-20260825','angerlo-obw-20260926','obw-dvc-20261003') and exists(select 1 from public.app_members where user_id=(select auth.uid()) and active and role='admin')
) with check (
 slug in ('angerlo-obw-20260825','angerlo-obw-20260926','obw-dvc-20261003') and exists(select 1 from public.app_members where user_id=(select auth.uid()) and active and role='admin')
);
insert into public.team_videos(slug,title,description,storage_path,published) values
('angerlo-obw-20260825','Angerlo Vooruit O17-1 – OBW O17-1','25 augustus 2026 · 3–1 · Oefenwedstrijd','20260825-samenvatting-gecorrigeerd.mp4',false),
('angerlo-obw-20260926','Angerlo Vooruit O17-1 – OBW O17-1','26 september 2026 · 1–2 · Competitiefase 1','20260926-samenvatting-gecorrigeerd.mp4',false),
('obw-dvc-20261003','OBW O17-1 – DVC ’26 O17-1','3 oktober 2026 · 2–2 · Competitiefase 1','20261003-samenvatting-gecorrigeerd.mp4',false)
on conflict(slug) do nothing;
