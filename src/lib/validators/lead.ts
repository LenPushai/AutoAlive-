import { z } from 'zod'
import { LEAD_SOURCES, LEAD_STATUSES } from '@/config/constants'

// Public enquiry form
export const enquirySchema = z.object({
  first_name: z.string().min(1, 'Name is required'),
  last_name: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email').nullable().optional(),
  phone: z.string().min(10, 'Valid phone number required'),
  vehicle_id: z.string().uuid().nullable().optional(),
  message: z.string().optional(),
})

// Admin lead management
export const leadSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().nullable().optional(),
  phone: z.string().min(10),
  source: z.enum(LEAD_SOURCES),
  status: z.enum(LEAD_STATUSES).default('new'),
  vehicle_id: z.string().uuid().nullable().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type EnquiryFormData = z.infer<typeof enquirySchema>
export type LeadFormData = z.infer<typeof leadSchema>
