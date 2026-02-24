with target_roles as (
  select
    p.id as user_id,
    case
      when lower(p.display_name) = 'babameca' then 'user'::public.roles
      when lower(p.display_name) = 'villa_admin' then 'admin'::public.roles
    end as role
  from public.profiles p
  where lower(p.display_name) in ('babameca', 'villa_admin')
)
insert into public.user_roles (user_id, role)
select tr.user_id, tr.role
from target_roles tr
where tr.role is not null
on conflict (user_id)
do update set role = excluded.role;
