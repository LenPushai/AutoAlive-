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

// Display meta (label + pill colour + icon) for every live source — the single
// source of truth for source badges across the dashboard (US-AA-040).
export const LEAD_SOURCE_META: Record<(typeof LEAD_SOURCES)[number], { label: string; color: string; icon: string }> = {
  website:    { label: 'Website',    color: '#0f1f3d', icon: '🌐' },
  autotrader: { label: 'AutoTrader', color: '#e84118', icon: '🚘' },
  carscoza:   { label: 'Cars.co.za', color: '#e67e22', icon: '🔶' },
  facebook:   { label: 'Facebook',   color: '#1877f2', icon: '📘' },
  tiktok:     { label: 'TikTok',     color: '#010101', icon: '🎵' },
  instagram:  { label: 'Instagram',  color: '#c13584', icon: '📸' },
  walkin:     { label: 'Walk-in',    color: '#27ae60', icon: '🚶' },
  googleads:  { label: 'Google Ads', color: '#4285f4', icon: '🔍' },
  other:      { label: 'Other',      color: '#95a5a6', icon: '📋' },
}

// Aligned to live leads_status_check (schema-of-record, US-AA-037/046)
export const LEAD_STATUSES = [
  'new', 'contacted', 'test_drive', 'negotiating', 'won', 'lost',
] as const

// Display meta (label + colours) for every live lead status — single source of
// truth for the kanban columns, table/modal badges, and the Overview list.
export const LEAD_STATUS_META: Record<(typeof LEAD_STATUSES)[number], { label: string; color: string; bg: string }> = {
  new:         { label: 'New',         color: '#3b82f6', bg: '#eff6ff' },
  contacted:   { label: 'Contacted',   color: '#8b5cf6', bg: '#f5f3ff' },
  test_drive:  { label: 'Test Drive',  color: '#f59e0b', bg: '#fffbeb' },
  negotiating: { label: 'Negotiating', color: '#f97316', bg: '#fff7ed' },
  won:         { label: 'Won',         color: '#16a34a', bg: '#f0fdf4' },
  lost:        { label: 'Lost',        color: '#dc2626', bg: '#fef2f2' },
}

export const VEHICLE_STATUSES = ['available', 'reserved', 'sold'] as const

// Display labels for vehicle status (single source of truth for status badges).
export const VEHICLE_STATUS_LABELS: Record<(typeof VEHICLE_STATUSES)[number], string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
}

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
