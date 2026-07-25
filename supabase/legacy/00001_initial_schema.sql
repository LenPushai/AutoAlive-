-- ============================================================================
-- AUTO ALIVE — Initial Database Schema
-- Multi-tenant: every table has dealer_id for future scaling
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────
-- DEALERS
-- ──────────────────────────────────────
CREATE TABLE dealers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL DEFAULT ''South Africa'',
  logo_url TEXT,
  operating_hours JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────
-- USERS (extends Supabase Auth)
-- ──────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dealer_id UUID NOT NULL REFERENCES dealers(id),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN (''owner'', ''manager'', ''salesperson'')),
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────
-- VEHICLES
-- ──────────────────────────────────────
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID NOT NULL REFERENCES dealers(id),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  year INTEGER NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  mileage INTEGER NOT NULL DEFAULT 0,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN (''petrol'', ''diesel'', ''hybrid'', ''electric'')),
  transmission TEXT NOT NULL CHECK (transmission IN (''manual'', ''automatic'')),
  colour TEXT NOT NULL,
  body_type TEXT,
  engine_size TEXT,
  vin TEXT,
  registration TEXT,
  status TEXT NOT NULL DEFAULT ''available'' CHECK (status IN (''available'', ''reserved'', ''sold'')),
  description TEXT,
  features TEXT[] DEFAULT ''{}'',
  images TEXT[] DEFAULT ''{}'',
  thumbnail TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_dealer ON vehicles(dealer_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);

-- ──────────────────────────────────────
-- LEADS
-- ──────────────────────────────────────
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID NOT NULL REFERENCES dealers(id),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN (''website'', ''whatsapp'', ''autotrader'', ''facebook'', ''walkin'', ''phone'', ''referral'')),
  status TEXT NOT NULL DEFAULT ''new'' CHECK (status IN (''new'', ''contacted'', ''qualified'', ''negotiating'', ''won'', ''lost'')),
  notes TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  lost_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_dealer ON leads(dealer_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_vehicle ON leads(vehicle_id);

-- ──────────────────────────────────────
-- LEAD TIMELINE
-- ──────────────────────────────────────
CREATE TABLE lead_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lead_timeline_lead ON lead_timeline(lead_id);

-- ──────────────────────────────────────
-- SALES
-- ──────────────────────────────────────
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID NOT NULL REFERENCES dealers(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  lead_id UUID NOT NULL REFERENCES leads(id),
  sale_price NUMERIC(12,2) NOT NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  salesperson_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sales_dealer ON sales(dealer_id);

-- ──────────────────────────────────────
-- SALE VERIFICATIONS (5-Layer System)
-- ──────────────────────────────────────
CREATE TABLE sale_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  dealer_id UUID NOT NULL REFERENCES dealers(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  lead_id UUID NOT NULL REFERENCES leads(id),

  -- Layer 1: Inventory
  inventory_marked BOOLEAN NOT NULL DEFAULT FALSE,
  inventory_marked_at TIMESTAMPTZ,
  inventory_marked_by UUID REFERENCES users(id),

  -- Layer 2: Marketplace
  marketplace_delisted BOOLEAN NOT NULL DEFAULT FALSE,
  marketplace_delisted_at TIMESTAMPTZ,

  -- Layer 3: CRM
  crm_closed BOOLEAN NOT NULL DEFAULT FALSE,
  crm_closed_at TIMESTAMPTZ,
  crm_closed_by UUID REFERENCES users(id),

  -- Layer 4: Delivery
  delivery_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  delivery_confirmed_at TIMESTAMPTZ,
  delivery_photo_url TEXT,
  delivery_checklist JSONB,

  -- Layer 5: Reconciliation
  reconciled BOOLEAN NOT NULL DEFAULT FALSE,
  reconciled_at TIMESTAMPTZ,
  reconciled_by UUID REFERENCES users(id),

  -- Billing & Anomalies
  anomaly_flags TEXT[] DEFAULT ''{}'',
  billing_amount NUMERIC(10,2) NOT NULL DEFAULT 1000.00,
  invoice_generated BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verifications_sale ON sale_verifications(sale_id);
CREATE INDEX idx_verifications_dealer ON sale_verifications(dealer_id);

-- ──────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ──────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sale_verifications_updated_at BEFORE UPDATE ON sale_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
