-- Restaurant OS foundation schema.
-- This is the starting migration only. Expand domain-by-domain through reviewed migrations.

create extension if not exists pgcrypto;

create type public.member_role as enum (
  'OWNER',
  'MANAGER',
  'CASHIER',
  'KITCHEN',
  'STAFF',
  'PLATFORM_ADMIN'
);

create type public.order_channel as enum (
  'POS',
  'QR',
  'WEBSITE',
  'SWIGGY',
  'ZOMATO',
  'PHONE',
  'OTHER'
);

create type public.order_status as enum (
  'DRAFT',
  'PLACED',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'SERVED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
  'PARTIALLY_REFUNDED'
);

create type public.payment_method as enum (
  'UPI',
  'CASH',
  'CARD',
  'GATEWAY',
  'OTHER'
);

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  legal_name text,
  phone text,
  email text,
  timezone text not null default 'Asia/Kolkata',
  currency text not null default 'INR',
  plan_code text not null default 'starter',
  subscription_status text not null default 'trialing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.outlets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  slug text not null,
  address jsonb not null default '{}'::jsonb,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug)
);

create table public.tenant_members (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null,
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  phone text,
  name text,
  email text,
  marketing_consent boolean not null default false,
  loyalty_opt_in boolean not null default false,
  first_order_at timestamptz,
  last_order_at timestamptz,
  total_orders integer not null default 0,
  total_spend numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, phone)
);

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  category_id uuid references public.menu_categories(id) on delete set null,
  name text not null,
  description text,
  sku text,
  selling_price numeric(14,2) not null,
  tax_rate numeric(6,3) not null default 0,
  is_active boolean not null default true,
  is_sold_out boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tables (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  table_number text not null,
  capacity integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (outlet_id, table_number)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  table_id uuid references public.tables(id) on delete set null,
  channel public.order_channel not null,
  status public.order_status not null default 'DRAFT',
  subtotal numeric(14,2) not null default 0,
  discount_total numeric(14,2) not null default 0,
  tax_total numeric(14,2) not null default 0,
  service_charge numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  notes text,
  client_order_id text,
  placed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (outlet_id, client_order_id)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name_snapshot text not null,
  unit_price numeric(14,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(14,2) not null,
  modifiers jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  method public.payment_method not null,
  amount numeric(14,2) not null check (amount >= 0),
  provider text,
  provider_reference text,
  status text not null default 'PENDING',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.loyalty_accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  balance bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, customer_id)
);

create table public.loyalty_ledger (
  id uuid primary key default gen_random_uuid(),
  loyalty_account_id uuid not null references public.loyalty_accounts(id) on delete cascade,
  delta bigint not null,
  reason text not null,
  reference_type text,
  reference_id uuid,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  slug text not null,
  game_type text not null,
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug)
);

create table public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  score integer,
  reward jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  table_id uuid references public.tables(id) on delete cascade,
  code text not null unique,
  destination text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index outlets_tenant_idx on public.outlets(tenant_id);
create index members_user_idx on public.tenant_members(user_id);
create index customers_tenant_idx on public.customers(tenant_id);
create index products_outlet_idx on public.products(outlet_id);
create index orders_outlet_created_idx on public.orders(outlet_id, created_at desc);
create index orders_customer_created_idx on public.orders(customer_id, created_at desc);
create index order_items_order_idx on public.order_items(order_id);
create index payments_order_idx on public.payments(order_id);
create index loyalty_ledger_account_created_idx on public.loyalty_ledger(loyalty_account_id, created_at desc);

create or replace function public.is_tenant_member(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = target_tenant_id
      and tm.user_id = auth.uid()
  );
$$;

alter table public.tenants enable row level security;
alter table public.outlets enable row level security;
alter table public.tenant_members enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.menu_categories enable row level security;
alter table public.products enable row level security;
alter table public.tables enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.loyalty_accounts enable row level security;
alter table public.loyalty_ledger enable row level security;
alter table public.games enable row level security;
alter table public.game_sessions enable row level security;
alter table public.qr_codes enable row level security;

create policy tenant_member_select on public.tenants
for select using (public.is_tenant_member(id));

create policy tenant_member_outlet_select on public.outlets
for select using (public.is_tenant_member(tenant_id));

create policy tenant_member_customers_all on public.customers
for all using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));

create policy tenant_member_menu_categories_all on public.menu_categories
for all using (exists (select 1 from public.outlets o where o.id = outlet_id and public.is_tenant_member(o.tenant_id)))
with check (exists (select 1 from public.outlets o where o.id = outlet_id and public.is_tenant_member(o.tenant_id)));

create policy tenant_member_products_all on public.products
for all using (exists (select 1 from public.outlets o where o.id = outlet_id and public.is_tenant_member(o.tenant_id)))
with check (exists (select 1 from public.outlets o where o.id = outlet_id and public.is_tenant_member(o.tenant_id)));

create policy tenant_member_tables_all on public.tables
for all using (exists (select 1 from public.outlets o where o.id = outlet_id and public.is_tenant_member(o.tenant_id)))
with check (exists (select 1 from public.outlets o where o.id = outlet_id and public.is_tenant_member(o.tenant_id)));

create policy tenant_member_orders_all on public.orders
for all using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));

create policy tenant_member_order_items_all on public.order_items
for all using (exists (select 1 from public.orders o where o.id = order_id and public.is_tenant_member(o.tenant_id)))
with check (exists (select 1 from public.orders o where o.id = order_id and public.is_tenant_member(o.tenant_id)));

create policy tenant_member_payments_all on public.payments
for all using (exists (select 1 from public.orders o where o.id = order_id and public.is_tenant_member(o.tenant_id)))
with check (exists (select 1 from public.orders o where o.id = order_id and public.is_tenant_member(o.tenant_id)));

create policy tenant_member_loyalty_all on public.loyalty_accounts
for all using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));

create policy tenant_member_loyalty_ledger_all on public.loyalty_ledger
for all using (exists (select 1 from public.loyalty_accounts la where la.id = loyalty_account_id and public.is_tenant_member(la.tenant_id)))
with check (exists (select 1 from public.loyalty_accounts la where la.id = loyalty_account_id and public.is_tenant_member(la.tenant_id)));

create policy tenant_member_games_all on public.games
for all using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));

create policy tenant_member_game_sessions_all on public.game_sessions
for all using (exists (select 1 from public.games g where g.id = game_id and public.is_tenant_member(g.tenant_id)))
with check (exists (select 1 from public.games g where g.id = game_id and public.is_tenant_member(g.tenant_id)));

create policy tenant_member_qr_all on public.qr_codes
for all using (exists (select 1 from public.outlets o where o.id = outlet_id and public.is_tenant_member(o.tenant_id)))
with check (exists (select 1 from public.outlets o where o.id = outlet_id and public.is_tenant_member(o.tenant_id)));

create policy user_profile_select on public.profiles
for select using (user_id = auth.uid());

create policy user_profile_insert on public.profiles
for insert with check (user_id = auth.uid());

create policy user_profile_update on public.profiles
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Customer-facing RLS policies must be added deliberately after the anonymous/guest order model is finalized.
-- Do NOT grant broad anon access to orders, payments, loyalty ledgers or merchant data.
