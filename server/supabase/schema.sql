create extension if not exists pgcrypto;

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references admin_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists provider_accounts (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null unique default 'premku',
  api_key_encrypted text not null,
  username text,
  whatsapp text,
  saldo numeric,
  registered_at_provider timestamptz,
  last_profile_sync_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null default 'premku',
  provider_product_id integer not null unique,
  name text not null,
  description text,
  image_url text,
  provider_status text not null default 'unknown',
  stock integer,
  last_stock_sync_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_pricing (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references products(id) on delete cascade,
  base_price numeric not null default 0,
  margin_amount numeric not null default 0,
  sell_price numeric not null default 0,
  currency text not null default 'IDR',
  updated_by uuid references admin_users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null default 'premku',
  provider_invoice text not null unique,
  product_id uuid not null references products(id) on delete restrict,
  product_name_snapshot text not null,
  qty integer not null,
  customer_whatsapp text not null,
  payment_method text,
  provider_unit_price numeric not null default 0,
  sell_unit_price numeric not null default 0,
  subtotal numeric not null default 0,
  provider_status text not null default 'created',
  provider_balance_before numeric,
  provider_balance_after numeric,
  last_status_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_accounts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  username text not null,
  password text not null,
  created_at timestamptz not null default now()
);

create table if not exists order_status_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status text not null,
  raw_response jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists stock_checks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  stock integer not null default 0,
  raw_response jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists deposits (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null default 'premku',
  provider_invoice text not null unique,
  amount_req numeric not null,
  kode_unik numeric,
  total_bayar numeric not null,
  status text not null default 'pending',
  qr_image text,
  qr_raw text,
  expired_info text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists deposit_status_logs (
  id uuid primary key default gen_random_uuid(),
  deposit_id uuid not null references deposits(id) on delete cascade,
  status text not null,
  raw_response jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists provider_request_logs (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null,
  endpoint text not null,
  request_body_masked jsonb,
  response_body jsonb,
  http_status integer,
  success boolean not null default false,
  error_code text,
  created_at timestamptz not null default now()
);
