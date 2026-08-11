-- ========================================================
-- Julina Candles & Melts E-Commerce Production Database Schema
-- Compatible with Supabase / PostgreSQL
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. UPDATED_AT TRIGGER FUNCTION ───
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── 2. USERS TABLE ───
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  uid VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  photo_url TEXT,
  provider VARCHAR(50) DEFAULT 'email',
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  gender VARCHAR(50),
  dob DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Safely add columns if users table already existed
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS uid VARCHAR(255);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'email';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS dob DATE;

-- Ensure users trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─── 3. PRODUCTS TABLE ───
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  photo TEXT NOT NULL,
  photo_public_id VARCHAR(255),
  featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  variants JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

-- Safely add columns if products table already existed
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS photo TEXT DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS photo_public_id VARCHAR(255);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- Safely make legacy columns optional if they exist from an older template
DO $$
BEGIN
  ALTER TABLE public.products ALTER COLUMN event_id DROP NOT NULL;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.products ALTER COLUMN title DROP NOT NULL;
EXCEPTION WHEN others THEN NULL;
END $$;

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─── 4. COUPONS TABLE ───
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);

-- Safely add is_active column if coupons table already existed
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- ─── 5. ORDERS TABLE ───
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_uid VARCHAR(255),
  shipping_info JSONB NOT NULL,
  order_items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  shipping_charges NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_charges >= 0),
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);

-- Safely add columns if orders table already existed
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS short_id VARCHAR(50);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_uid VARCHAR(255);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tax NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_charges NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─── 6. PERFORMANCE INDEXES ───
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_uid ON public.users(uid);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ─── 7. ROW LEVEL SECURITY (RLS) POLICIES ───
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products
  FOR SELECT USING (true);

-- Allow public read access to coupons
DROP POLICY IF EXISTS "Public Read Coupons" ON public.coupons;
CREATE POLICY "Public Read Coupons" ON public.coupons
  FOR SELECT USING (true);

-- Allow public insert, select & update for orders (guest checkout & payment updates)
DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
CREATE POLICY "Public Insert Orders" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Select Orders" ON public.orders;
CREATE POLICY "Public Select Orders" ON public.orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;
CREATE POLICY "Public Update Orders" ON public.orders
  FOR UPDATE USING (true);

-- Allow public insert, select & update for users (guest user registration)
DROP POLICY IF EXISTS "Public Insert Users" ON public.users;
CREATE POLICY "Public Insert Users" ON public.users
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Select Users" ON public.users;
CREATE POLICY "Public Select Users" ON public.users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Update Users" ON public.users;
CREATE POLICY "Public Update Users" ON public.users
  FOR UPDATE USING (true);

-- ─── MIGRATION: Fix orders status constraint to include 'Pending' ───
-- Run this in Supabase SQL Editor if the orders table already exists
-- (the CREATE TABLE above only applies to fresh installs)
DO $$
BEGIN
  ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
  ALTER TABLE public.orders
    ADD CONSTRAINT orders_status_check
    CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'));
EXCEPTION WHEN others THEN
  NULL;
END $$;

