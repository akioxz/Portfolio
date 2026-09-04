create or replace function public.check_and_record_admin_login_attempt(
  p_ip_hash text,
  p_window_start timestamptz,
  p_max_attempts integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  attempt_count integer;
begin
  perform pg_advisory_xact_lock(hashtext(p_ip_hash));

  select count(*)::integer
  into attempt_count
  from public.contact_rate_limits
  where ip_hash = p_ip_hash
    and created_at >= p_window_start;

  if attempt_count >= p_max_attempts then
    return true;
  end if;

  insert into public.contact_rate_limits (ip_hash)
  values (p_ip_hash);

  return false;
end;
$$;

revoke all on function public.check_and_record_admin_login_attempt(text, timestamptz, integer) from public;
grant execute on function public.check_and_record_admin_login_attempt(text, timestamptz, integer) to service_role;
