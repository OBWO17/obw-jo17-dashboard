do $patch$
declare definition text;
begin
select pg_get_functiondef('goal_vote_private.manage(text,integer,jsonb)'::regprocedure) into definition;
if position('if old.id is not null then update goal_vote_private.candidates set active=false where id=old.id; end if;' in definition)=0 then raise exception 'Unexpected function'; end if;
definition:=replace(definition,'if old.id is not null then update goal_vote_private.candidates set active=false where id=old.id; end if;','if old.id is not null then
 update goal_vote_private.candidates set active=false where id=old.id;
 update goal_vote_private.election set round=round+1;
 end if;');
execute definition;
end $patch$;