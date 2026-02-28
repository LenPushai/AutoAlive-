export interface DealerProfile {
  id: string
  name: string
  slug: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  logo_url: string | null
  operating_hours: Record<string, { open: string; close: string }> | null
  created_at: string
}
