export interface Sale {
  id: string
  dealer_id: string
  vehicle_id: string
  lead_id: string
  sale_price: number
  sale_date: string
  salesperson_id: string | null
  created_at: string
}

export interface SaleVerification {
  id: string
  sale_id: string
  dealer_id: string
  vehicle_id: string
  lead_id: string
  inventory_marked: boolean
  inventory_marked_at: string | null
  inventory_marked_by: string | null
  marketplace_delisted: boolean
  marketplace_delisted_at: string | null
  crm_closed: boolean
  crm_closed_at: string | null
  crm_closed_by: string | null
  delivery_confirmed: boolean
  delivery_confirmed_at: string | null
  delivery_photo_url: string | null
  delivery_checklist: Record<string, boolean> | null
  reconciled: boolean
  reconciled_at: string | null
  reconciled_by: string | null
  anomaly_flags: string[]
  billing_amount: number
  invoice_generated: boolean
  created_at: string
  updated_at: string
}

export type SaleVerificationInsert = Omit<SaleVerification, 'id' | 'created_at' | 'updated_at'>
