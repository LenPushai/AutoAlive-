// Vehicle makes common in SA market
export const VEHICLE_MAKES = [
  'Audi', 'BMW', 'Chevrolet', 'Citroën', 'Datsun',
  'Fiat', 'Ford', 'GWM', 'Haval', 'Honda',
  'Hyundai', 'Isuzu', 'Jeep', 'Kia', 'Land Rover',
  'Lexus', 'Mahindra', 'Mazda', 'Mercedes-Benz', 'MG',
  'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot',
  'Renault', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo',
] as const

export const FUEL_TYPES = ['petrol', 'diesel', 'hybrid', 'electric'] as const
export const TRANSMISSIONS = ['manual', 'automatic'] as const
export const BODY_TYPES = [
  'Sedan', 'Hatchback', 'SUV', 'Bakkie', 'Double Cab',
  'Single Cab', 'Coupe', 'Crossover', 'MPV', 'Van',
] as const

// Aligned to live leads_source_check (schema-of-record, US-AA-048)
export const LEAD_SOURCES = [
  'website', 'autotrader', 'carscoza', 'facebook', 'tiktok', 'instagram', 'walkin', 'googleads', 'other',
] as const

export const LEAD_SOURCE_LABELS: Record<(typeof LEAD_SOURCES)[number], string> = {
  website: 'Website',
  autotrader: 'AutoTrader',
  carscoza: 'Cars.co.za',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  walkin: 'Walk-in',
  googleads: 'Google Ads',
  other: 'Other',
}

// Aligned to live leads_status_check (schema-of-record, US-AA-037/046)
export const LEAD_STATUSES = [
  'new', 'contacted', 'test_drive', 'negotiating', 'won', 'lost',
] as const

export const VEHICLE_STATUSES = ['available', 'reserved', 'sold'] as const

// Finance calculator defaults (SA market)
export const FINANCE_DEFAULTS = {
  interestRate: 11.75, // SA prime rate approx
  depositPercent: 10,
  termMonths: 72,
  balloonPercent: 0,
  initiationFee: 1207.50,
  monthlyServiceFee: 69,
} as const

export const ITEMS_PER_PAGE = 12
