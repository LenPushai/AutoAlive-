export type LeadSource = 'website' | 'whatsapp' | 'autotrader' | 'facebook' | 'walkin' | 'phone' | 'referral'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiating' | 'won' | 'lost'

export interface Lead {
  id: string
  dealer_id: string
  vehicle_id: string | null
  first_name: string
  last_name: string
  email: string | null
  phone: string
  source: LeadSource
  status: LeadStatus
  notes: string | null
  assigned_to: string | null
  lost_reason: string | null
  created_at: string
  updated_at: string
}

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'>
export type LeadUpdate = Partial<LeadInsert>

export interface LeadTimelineEntry {
  id: string
  lead_id: string
  action: string
  details: string | null
  created_by: string | null
  created_at: string
}
