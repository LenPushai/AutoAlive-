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

export const LEAD_SOURCES = [
  'website', 'whatsapp', 'autotrader', 'facebook', 'walkin', 'phone', 'referral',
] as const

export const LEAD_STATUSES = [
  'new', 'contacted', 'qualified', 'negotiating', 'won', 'lost',
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
