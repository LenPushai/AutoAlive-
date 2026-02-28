import { z } from 'zod'
import { FUEL_TYPES, TRANSMISSIONS, VEHICLE_STATUSES } from '@/config/constants'

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  variant: z.string().nullable().optional(),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  price: z.number().positive('Price must be greater than 0'),
  mileage: z.number().int().min(0),
  fuel_type: z.enum(FUEL_TYPES),
  transmission: z.enum(TRANSMISSIONS),
  colour: z.string().min(1, 'Colour is required'),
  body_type: z.string().nullable().optional(),
  engine_size: z.string().nullable().optional(),
  vin: z.string().nullable().optional(),
  registration: z.string().nullable().optional(),
  status: z.enum(VEHICLE_STATUSES).default('available'),
  description: z.string().nullable().optional(),
  features: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
})

export type VehicleFormData = z.infer<typeof vehicleSchema>
