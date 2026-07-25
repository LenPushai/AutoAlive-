-- ============================================================================
-- AUTO ALIVE — Seed Data (Development)
-- ============================================================================

-- Insert Auto Alive dealer
INSERT INTO dealers (id, name, slug, email, phone, address, city, province) VALUES (
  ''00000000-0000-0000-0000-000000000001'',
  ''Auto Alive'',
  ''auto-alive'',
  ''info@autoalive.co.za'',
  ''016 000 0000'',
  ''TBC'',
  ''Vanderbijlpark'',
  ''Gauteng''
);

-- Sample vehicles (Vaal Triangle market)
INSERT INTO vehicles (dealer_id, make, model, variant, year, price, mileage, fuel_type, transmission, colour, body_type, status, is_featured) VALUES
(''00000000-0000-0000-0000-000000000001'', ''Toyota'', ''Hilux'', ''2.4 GD-6 SRX'', 2022, 549900, 45000, ''diesel'', ''automatic'', ''White'', ''Double Cab'', ''available'', true),
(''00000000-0000-0000-0000-000000000001'', ''Volkswagen'', ''Polo'', ''1.0 TSI Comfortline'', 2023, 329900, 22000, ''petrol'', ''manual'', ''Silver'', ''Hatchback'', ''available'', true),
(''00000000-0000-0000-0000-000000000001'', ''Ford'', ''Ranger'', ''2.0 Bi-Turbo Wildtrak'', 2021, 599900, 68000, ''diesel'', ''automatic'', ''Blue'', ''Double Cab'', ''available'', true),
(''00000000-0000-0000-0000-000000000001'', ''Hyundai'', ''Tucson'', ''2.0 Premium'', 2022, 449900, 35000, ''petrol'', ''automatic'', ''Grey'', ''SUV'', ''available'', false),
(''00000000-0000-0000-0000-000000000001'', ''BMW'', ''3 Series'', ''320d M Sport'', 2020, 499900, 72000, ''diesel'', ''automatic'', ''Black'', ''Sedan'', ''available'', false),
(''00000000-0000-0000-0000-000000000001'', ''Toyota'', ''Corolla Cross'', ''1.8 XS Hybrid'', 2023, 459900, 18000, ''hybrid'', ''automatic'', ''White'', ''Crossover'', ''available'', true);
