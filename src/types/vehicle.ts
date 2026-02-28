export type VehicleStatus = 'available' | 'reserved' | 'sold'
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric'
export type TransmissionType = 'manual' | 'automatic'

export interface Vehicle {
  id: string
  dealer_id: string
  make: string
  model: string
  variant: string | null
  year: number
  price: number
  mileage: number
  fuel_type: FuelType
  transmission: TransmissionType
  colour: string
  body_type: string | null
  engine_size: string | null
  vin: string | null
  registration: string | null
  status: VehicleStatus
  description: string | null
  features: string[]
  images: string[]
  thumbnail: string | null
  is_featured: boolean
  created_at: string
  updated_at: string
}

export type VehicleInsert = Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>
export type VehicleUpdate = Partial<VehicleInsert>

export interface VehicleFilters {
  make?: string
  model?: string
  yearMin?: number
  yearMax?: number
  priceMin?: number
  priceMax?: number
  fuelType?: FuelType
  transmission?: TransmissionType
  status?: VehicleStatus
  search?: string
  page?: number
  limit?: number
  sort?: 'price_asc' | 'price_desc' | 'year_desc' | 'newest'
}
