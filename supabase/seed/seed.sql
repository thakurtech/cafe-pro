-- Local development seed only.
-- Replace placeholder values with deterministic fixtures as the schema stabilizes.

insert into public.tenants (name, slug, plan_code, subscription_status)
values ('Demo Cafe', 'demo-cafe', 'starter', 'trialing')
on conflict (slug) do nothing;

insert into public.outlets (tenant_id, name, slug)
select id, 'Demo Cafe Main Outlet', 'main'
from public.tenants
where slug = 'demo-cafe'
on conflict do nothing;
