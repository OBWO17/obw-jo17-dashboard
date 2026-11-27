-- Central election data. No direct access to ballots, including through the Data API.
create schema goal_vote_private;
revoke all on schema goal_vote_private from public, anon;
grant usage on schema goal_vote_private to authenticated;
create table goal_vote_private.election (
 id text primary key check(id='2026-2027'), status text not null default 'draft' check(status in ('draft','open','closed')),
 stage text not null default 'selection' check(stage in ('selection','final')), round integer not null default 1,
 revision integer not null default 1, updated_at timestamptz not null default now()
);
insert into goal_vote_private.election(id) values('2026-2027');
create table goal_vote_private.candidates (
 id uuid primary key default gen_random_uuid(), slot integer not null check(slot between 1 and 6),
 player text not null check(length(player) between 1 and 60), opponent text not null check(length(opponent) between 1 and 100),
 match_date date not null, caption text not null default '' check(length(caption)<=180),
 video_path text not null unique, poster_path text not null unique, active boolean not null default true,
 created_at timestamptz not null default now()
);
create unique index goal_current_slots on goal_vote_private.candidates(slot) where active;
create table goal_vote_private.ballots (
 round integer not null, voter_hash text not null check(voter_hash ~ '^[a-f0-9]{64}$'),
 candidate_id uuid not null references goal_vote_private.candidates(id), updated_at timestamptz not null default now(),
 primary key(round,voter_hash)
);
create index goal_ballot_candidate on goal_vote_private.ballots(candidate_id,round);
alter table goal_vote_private.election enable row level security;
alter table goal_vote_private.candidates enable row level security;
alter table goal_vote_private.ballots enable row level security;
revoke all on all tables in schema goal_vote_private from public,anon,authenticated;

create function goal_vote_private.member_role() returns text language sql stable security definer set search_path='' as $$
 select role from public.app_members where user_id=(select auth.uid()) and active and role in ('admin','viewer')
$$;
create function goal_vote_private.state(p_hash text) returns jsonb language plpgsql security definer set search_path='' as $$
declare e goal_vote_private.election; r text; result jsonb; mine uuid;
begin
 r:=goal_vote_private.member_role(); if r is null then raise exception 'Geen toegang'; end if;
 select * into e from goal_vote_private.election for share;
 select b.candidate_id into mine from goal_vote_private.ballots b join goal_vote_private.candidates c on c.id=b.candidate_id and c.active where b.round=e.round and b.voter_hash=p_hash;
 select coalesce(jsonb_agg(jsonb_build_object('id',c.id,'slot',c.slot,'player',c.player,'opponent',c.opponent,'date',c.match_date,'caption',c.caption,'video_path',c.video_path,'poster_path',c.poster_path)||case when r='admin' or (e.status='closed' and e.stage='final') then jsonb_build_object('votes',(select count(*) from goal_vote_private.ballots b where b.round=e.round and b.candidate_id=c.id)) else '{}'::jsonb end order by c.slot),'[]') into result from goal_vote_private.candidates c where c.active and (e.status<>'draft' or r='admin');
 return jsonb_build_object('status',e.status,'stage',e.stage,'round',e.round,'revision',e.revision,'admin',r='admin','myVote',mine,'candidates',result);
end $$;
create function goal_vote_private.vote(p_hash text,p_candidate uuid,p_round integer) returns void language plpgsql security definer set search_path='' as $$
declare e goal_vote_private.election;
begin
 if goal_vote_private.member_role() is null then raise exception 'Geen toegang'; end if;
 if p_hash is null or p_hash !~ '^[a-f0-9]{64}$' then raise exception 'Ongeldige stem'; end if;
 select * into e from goal_vote_private.election for update;
 if e.status<>'open' or e.round<>p_round then raise exception 'De stemronde is gewijzigd of gesloten. Vernieuw de pagina.'; end if;
 if not exists(select 1 from goal_vote_private.candidates where id=p_candidate and active) then raise exception 'Dit doelpunt is vervangen. Kies opnieuw.'; end if;
 insert into goal_vote_private.ballots(round,voter_hash,candidate_id) values(e.round,p_hash,p_candidate) on conflict(round,voter_hash) do update set candidate_id=excluded.candidate_id,updated_at=now();
end $$;
create function goal_vote_private.manage(p_action text,p_revision integer,p_data jsonb default '{}') returns void language plpgsql security definer set search_path='' as $$
declare e goal_vote_private.election; old goal_vote_private.candidates; n integer; minvotes bigint; v bigint;
begin
 if goal_vote_private.member_role() is distinct from 'admin' then raise exception 'Alleen de trainer kan de verkiezing beheren'; end if;
 select * into e from goal_vote_private.election for update;
 if e.revision<>p_revision then raise exception 'De verkiezing is gewijzigd. Vernieuw het overzicht.'; end if;
 if p_action='candidate' then
  if e.stage='final' then raise exception 'Tijdens de finale blijven de zes doelpunten gelijk'; end if;
  select * into old from goal_vote_private.candidates where slot=(p_data->>'slot')::integer and active;
  if old.id is not null then
   if old.id::text is distinct from p_data->>'expectedId' then raise exception 'Dit doelpunt is al vervangen'; end if;
   select count(*) into v from goal_vote_private.ballots where round=e.round and candidate_id=old.id;
   select min(t.total) into minvotes from (select count(b.candidate_id) total from goal_vote_private.candidates c left join goal_vote_private.ballots b on b.candidate_id=c.id and b.round=e.round where c.active group by c.id)t;
   if v>minvotes then raise exception 'Vervang een doelpunt met het laagste aantal stemmen'; end if;
  elsif nullif(p_data->>'expectedId','') is not null then raise exception 'De kandidaat is gewijzigd'; end if;
  if p_data->>'video_path' !~ '^2026-2027/[a-f0-9-]{36}\.mp4$' or p_data->>'poster_path' <> replace(p_data->>'video_path','.mp4','.jpg') then raise exception 'Ongeldige bestanden'; end if;
  if not exists(select 1 from storage.objects where bucket_id='goal-season' and name=p_data->>'video_path') or not exists(select 1 from storage.objects where bucket_id='goal-season' and name=p_data->>'poster_path') then raise exception 'De upload is nog niet compleet'; end if;
  if old.id is not null then update goal_vote_private.candidates set active=false where id=old.id; end if;
  insert into goal_vote_private.candidates(slot,player,opponent,match_date,caption,video_path,poster_path) values((p_data->>'slot')::integer,btrim(p_data->>'player'),btrim(p_data->>'opponent'),(p_data->>'date')::date,coalesce(p_data->>'caption',''),p_data->>'video_path',p_data->>'poster_path');
 elsif p_action='open' then
  select count(*) into n from goal_vote_private.candidates where active;
  if n<>6 then raise exception 'Kies eerst alle zes doelpunten'; end if;
  update goal_vote_private.election set status='open';
 elsif p_action='close' then update goal_vote_private.election set status='closed';
 elsif p_action='final' then
  if e.stage='final' then raise exception 'De finaleronde is al gestart'; end if;
  if (select count(*) from goal_vote_private.candidates where active)<>6 then raise exception 'Kies eerst alle zes doelpunten'; end if;
  update goal_vote_private.election set stage='final',status='open',round=round+1;
 else raise exception 'Onbekende actie'; end if;
 update goal_vote_private.election set revision=revision+1,updated_at=now();
end $$;
create function goal_vote_private.can_read_media(p_path text) returns boolean language sql stable security definer set search_path='' as $$
 select goal_vote_private.member_role()='admin' or (goal_vote_private.member_role() is not null and exists(select 1 from goal_vote_private.candidates c cross join goal_vote_private.election e where c.active and e.status<>'draft' and p_path in(c.video_path,c.poster_path)))
$$;
revoke all on all functions in schema goal_vote_private from public,anon,authenticated;
grant execute on function goal_vote_private.state(text),goal_vote_private.vote(text,uuid,integer),goal_vote_private.manage(text,integer,jsonb),goal_vote_private.can_read_media(text) to authenticated;
create function public.goal_election_state(p_hash text) returns jsonb language sql security invoker set search_path='' as $$select goal_vote_private.state(p_hash)$$;
create function public.goal_election_vote(p_hash text,p_candidate uuid,p_round integer) returns void language sql security invoker set search_path='' as $$select goal_vote_private.vote(p_hash,p_candidate,p_round)$$;
create function public.goal_election_manage(p_action text,p_revision integer,p_data jsonb default '{}') returns void language sql security invoker set search_path='' as $$select goal_vote_private.manage(p_action,p_revision,p_data)$$;
revoke all on function public.goal_election_state(text),public.goal_election_vote(text,uuid,integer),public.goal_election_manage(text,integer,jsonb) from public,anon;
grant execute on function public.goal_election_state(text),public.goal_election_vote(text,uuid,integer),public.goal_election_manage(text,integer,jsonb) to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('goal-season','goal-season',false,52428800,array['video/mp4','image/jpeg']);
create policy "Trainer uploads election clips" on storage.objects for insert to authenticated with check(bucket_id='goal-season' and name ~ '^2026-2027/[a-f0-9-]{36}\.(mp4|jpg)$' and exists(select 1 from public.app_members where user_id=(select auth.uid()) and active and role='admin'));
create policy "Members view election media" on storage.objects for select to authenticated using(bucket_id='goal-season' and goal_vote_private.can_read_media(name));
