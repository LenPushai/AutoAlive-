-- ============================================================================
-- AUTO ALIVE — Row Level Security Policies
-- ============================================================================

ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_verifications ENABLE ROW LEVEL SECURITY;

-- ── Public: Anyone can view available vehicles ──
CREATE POLICY "Public can view available vehicles"
  ON vehicles FOR SELECT
  USING (status = ''available'');

-- ── Authenticated: Users see their dealer''s data ──
CREATE POLICY "Users see own dealer vehicles"
  ON vehicles FOR ALL
  USING (dealer_id = (SELECT dealer_id FROM users WHERE id = auth.uid()))
  WITH CHECK (dealer_id = (SELECT dealer_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users see own dealer leads"
  ON leads FOR ALL
  USING (dealer_id = (SELECT dealer_id FROM users WHERE id = auth.uid()))
  WITH CHECK (dealer_id = (SELECT dealer_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users see own dealer sales"
  ON sales FOR ALL
  USING (dealer_id = (SELECT dealer_id FROM users WHERE id = auth.uid()))
  WITH CHECK (dealer_id = (SELECT dealer_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users see own dealer verifications"
  ON sale_verifications FOR ALL
  USING (dealer_id = (SELECT dealer_id FROM users WHERE id = auth.uid()))
  WITH CHECK (dealer_id = (SELECT dealer_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users see own profile"
  ON users FOR SELECT
  USING (id = auth.uid() OR dealer_id = (SELECT dealer_id FROM users WHERE id = auth.uid()));

-- ── Public: Anyone can insert leads (website enquiries) ──
CREATE POLICY "Public can submit enquiries"
  ON leads FOR INSERT
  WITH CHECK (source = ''website'');
