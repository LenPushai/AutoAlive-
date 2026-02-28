import { createAdminClient } from '@/lib/supabase/admin'

const DEALER_ID = process.env.NEXT_PUBLIC_DEALER_ID || '00000000-0000-0000-0000-000000000001'

/**
 * Fetch all available vehicles (for public pages)
 */
export async function getAvailableVehicles({ featured = false, limit = 50 } = {}) {
  const supabase = createAdminClient()
  
  let query = supabase
    .from('vehicles')
    .select('*')
    .eq('dealer_id', DEALER_ID)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (featured) {
    query = query.eq('is_featured', true)
  }

  const { data, error } = await query
  if (error) {
    console.error('Error fetching vehicles:', error)
    return []
  }
  return data
}

/**
 * Fetch single vehicle by ID
 */
export async function getVehicleById(id) {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching vehicle:', error)
    return null
  }
  return data
}

/**
 * Fetch dealer info
 */
export async function getDealer() {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('dealers')
    .select('*')
    .eq('id', DEALER_ID)
    .single()

  if (error) {
    console.error('Error fetching dealer:', error)
    return null
  }
  return data
}

/**
 * Format ZAR price
 */
export function formatPrice(amount) {
  return 'R ' + Number(amount).toLocaleString('en-ZA', { maximumFractionDigits: 0 })
}

/**
 * Calculate monthly finance estimate
 */
export function calculateMonthly(price, deposit = 0, termMonths = 72, ratePercent = 13.75) {
  const principal = price - deposit
  if (principal <= 0) return 0
  const r = ratePercent / 100 / 12
  return Math.round(principal * (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1))
}
