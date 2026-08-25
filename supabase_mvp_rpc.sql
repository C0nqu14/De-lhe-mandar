-- De Lhe Mandar MVP: atomic mission mutations.
-- Run in Supabase SQL Editor with the existing schema loaded.

create or replace function public.accept_mission(p_mission_id uuid)
returns public.missions
language plpgsql
security invoker
set search_path = public
as $$
declare
  result public.missions;
  actor_role text;
begin
  select role into actor_role from public.profiles where id = auth.uid();
  if actor_role <> 'EXECUTOR' then raise exception 'Only an executor can accept missions'; end if;

  update public.missions
  set executor_id = auth.uid(), accepted_at = now(), status = 'ACCEPTED', updated_at = now()
  where id = p_mission_id and status = 'AVAILABLE' and executor_id is null
  returning * into result;
  if not found then raise exception 'Mission is no longer available'; end if;

  insert into public.mission_checkpoints (mission_id, status, description)
  values (p_mission_id, 'MISSION_ACCEPTED', 'Um Nengue foi atribuído à missão.');
  insert into public.notifications (user_id, type, title, message)
  values (result.client_id, 'MISSION_ACCEPTED', 'Missão aceite', 'Um Nengue aceitou a sua missão.');
  return result;
end;
$$;

create or replace function public.advance_mission(p_mission_id uuid, p_action text)
returns public.missions
language plpgsql
security invoker
set search_path = public
as $$
declare
  result public.missions;
  actor_role text;
  next_status text;
  checkpoint_type text;
  checkpoint_message text;
  notification_message text;
begin
  select role into actor_role from public.profiles where id = auth.uid();
  if actor_role <> 'EXECUTOR' then raise exception 'Only an executor can advance missions'; end if;

  select * into result from public.missions where id = p_mission_id for update;
  if not found or result.executor_id <> auth.uid() then raise exception 'Executor is not assigned to this mission'; end if;

  if p_action = 'ON_THE_WAY' and result.status = 'ACCEPTED' then
    next_status := 'ACCEPTED'; checkpoint_type := 'EXECUTOR_ON_THE_WAY'; checkpoint_message := 'O Nengue está a caminho.'; notification_message := 'O Nengue está a caminho.';
  elsif p_action = 'ARRIVED' and result.status = 'ACCEPTED' then
    next_status := 'ACCEPTED'; checkpoint_type := 'EXECUTOR_ARRIVED'; checkpoint_message := 'O Nengue chegou ao local.'; notification_message := 'O Nengue chegou ao local.';
  elsif p_action = 'START' and result.status = 'ACCEPTED' then
    next_status := 'IN_PROGRESS'; checkpoint_type := 'MISSION_STARTED'; checkpoint_message := 'O Nengue iniciou a missão.'; notification_message := 'A missão foi iniciada.';
  else
    raise exception 'Invalid mission transition';
  end if;

  update public.missions set status = next_status, started_at = case when p_action = 'START' then now() else started_at end, updated_at = now() where id = p_mission_id returning * into result;
  insert into public.mission_checkpoints (mission_id, status, description) values (p_mission_id, checkpoint_type, checkpoint_message);
  insert into public.notifications (user_id, type, title, message) values (result.client_id, checkpoint_type, 'Atualização da missão', notification_message);
  return result;
end;
$$;

create or replace function public.request_mission_confirmation(p_mission_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  mission_row public.missions;
  confirmation_id uuid;
  actor_role text;
begin
  select role into actor_role from public.profiles where id = auth.uid();
  if actor_role <> 'EXECUTOR' then raise exception 'Only an executor can request confirmation'; end if;
  select * into mission_row from public.missions where id = p_mission_id for update;
  if not found or mission_row.executor_id <> auth.uid() or mission_row.status <> 'IN_PROGRESS' then raise exception 'Mission cannot request confirmation'; end if;

  update public.mission_confirmations set used = true where mission_id = p_mission_id and used = false;
  insert into public.mission_confirmations (mission_id, confirmation_token, otp, expires_at, used)
  values (p_mission_id, encode(gen_random_bytes(24), 'hex'), lpad((floor(random() * 1000000))::text, 6, '0'), now() + interval '15 minutes', false)
  returning id into confirmation_id;
  update public.missions set status = 'AWAITING_CONFIRMATION', updated_at = now() where id = p_mission_id;
  insert into public.mission_checkpoints (mission_id, status, description) values (p_mission_id, 'COMPLETION_REQUESTED', 'Aguarda o código de confirmação da Cota.');
  insert into public.notifications (user_id, type, title, message) values (mission_row.client_id, 'COMPLETION_REQUESTED', 'Conclusão solicitada', 'O Nengue solicitou a confirmação da missão.');
  return;
end;
$$;

create or replace function public.confirm_mission(p_mission_id uuid, p_value text)
returns public.missions
language plpgsql
security invoker
set search_path = public
as $$
declare
  mission_row public.missions;
  confirmation_row public.mission_confirmations;
  result public.missions;
  actor_role text;
begin
  select role into actor_role from public.profiles where id = auth.uid();
  select * into mission_row from public.missions where id = p_mission_id for update;
  if not found or mission_row.status <> 'AWAITING_CONFIRMATION' then raise exception 'Mission cannot be confirmed'; end if;

  select * into confirmation_row from public.mission_confirmations
  where mission_id = p_mission_id and used = false and expires_at > now()
    and (otp = p_value or confirmation_token = p_value)
  for update;
  if not found then raise exception 'Invalid or expired confirmation'; end if;
  if actor_role = 'CLIENT' and mission_row.client_id <> auth.uid() then raise exception 'Only the mission client can confirm it'; end if;
  if actor_role = 'EXECUTOR' and (mission_row.executor_id is null or mission_row.executor_id <> auth.uid() or confirmation_row.confirmation_token <> p_value) then raise exception 'Only the assigned executor can validate this QR'; end if;
  if actor_role not in ('CLIENT', 'EXECUTOR') then raise exception 'Invalid profile role'; end if;

  update public.mission_confirmations set used = true, confirmed_at = now() where id = confirmation_row.id;
  update public.missions set status = 'COMPLETED', completed_at = now(), updated_at = now() where id = p_mission_id returning * into result;
  insert into public.mission_checkpoints (mission_id, status, description) values (p_mission_id, 'MISSION_CONFIRMED', 'A Cota confirmou a conclusão.');
  insert into public.notifications (user_id, type, title, message) values (mission_row.executor_id, 'MISSION_CONFIRMED', 'Missão concluída', 'A Cota confirmou a conclusão da missão.');
  return result;
end;
$$;

create or replace function public.cancel_mission(p_mission_id uuid)
returns public.missions
language plpgsql
security invoker
set search_path = public
as $$
declare
  mission_row public.missions;
  result public.missions;
  actor_role text;
  recipient uuid;
begin
  select role into actor_role from public.profiles where id = auth.uid();
  select * into mission_row from public.missions where id = p_mission_id for update;
  if not found or (mission_row.client_id <> auth.uid() and mission_row.executor_id <> auth.uid()) then raise exception 'Not allowed to cancel this mission'; end if;
  if mission_row.status in ('COMPLETED', 'CANCELLED', 'DISPUTED') then raise exception 'Mission cannot be cancelled'; end if;

  update public.missions set status = 'CANCELLED', cancelled_at = now(), updated_at = now() where id = p_mission_id returning * into result;
  insert into public.mission_checkpoints (mission_id, status, description) values (p_mission_id, 'MISSION_CANCELLED', 'A missão foi cancelada.');
  recipient := case when auth.uid() = mission_row.client_id then mission_row.executor_id else mission_row.client_id end;
  if recipient is not null then insert into public.notifications (user_id, type, title, message) values (recipient, 'MISSION_CANCELLED', 'Missão cancelada', 'A missão foi cancelada.'); end if;
  return result;
end;
$$;

revoke all on function public.accept_mission(uuid) from public;
revoke all on function public.advance_mission(uuid, text) from public;
revoke all on function public.request_mission_confirmation(uuid) from public;
revoke all on function public.confirm_mission(uuid, text) from public;
revoke all on function public.cancel_mission(uuid) from public;
grant execute on function public.accept_mission(uuid) to authenticated;
grant execute on function public.advance_mission(uuid, text) to authenticated;
grant execute on function public.request_mission_confirmation(uuid) to authenticated;
grant execute on function public.confirm_mission(uuid, text) to authenticated;
grant execute on function public.cancel_mission(uuid) to authenticated;
