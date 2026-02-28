# ============================================================================
# AUTO ALIVE — Supabase Setup Script
# PUSH AI Foundation | Proverbs 16:3
# ============================================================================
# Run from: C:\Users\lenkl\WebstormProjects\autoalive1-1\
# ============================================================================
# 
# BEFORE RUNNING THIS SCRIPT:
# 1. Go to https://supabase.com/dashboard
# 2. Create a new project (name: "auto-alive", region: closest to SA)
# 3. Wait for project to be ready (~2 min)
# 4. Go to Settings > API and copy:
#    - Project URL
#    - anon (public) key
#    - service_role key
# 5. Go to SQL Editor and run the 3 SQL files in order:
#    - 01_schema.sql
#    - 02_rls_policies.sql
#    - 03_seed_data.sql
# 6. Then run this script
# ============================================================================

$root = "."

Write-Host ""
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "  AUTO ALIVE — Supabase Local Setup" -ForegroundColor Yellow
Write-Host "  Proverbs 16:3" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host ""

# ============================================================================
# 1. INSTALL SUPABASE PACKAGES
# ============================================================================
Write-Host "[1/4] Installing Supabase packages..." -ForegroundColor Cyan
npm install @supabase/supabase-js @supabase/ssr

# ============================================================================
# 2. CREATE .env.local (if it doesn't exist)
# ============================================================================
Write-Host ""
Write-Host "[2/4] Setting up environment..." -ForegroundColor Cyan

if (!(Test-Path ".env.local")) {
@'
# ============================================================================
# AUTO ALIVE — Environment Variables
# PUSH AI Foundation
# ============================================================================
# Fill in your Supabase values from:
# https://supabase.com/dashboard > Your Project > Settings > API
# ============================================================================

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEALER_ID=00000000-0000-0000-0000-000000000001
'@ | Set-Content -Path ".env.local" -Encoding UTF8
    Write-Host "  >> .env.local created — FILL IN YOUR SUPABASE KEYS" -ForegroundColor Yellow
} else {
    Write-Host "  >> .env.local already exists — skipping" -ForegroundColor Green
}

# ============================================================================
# 3. SUPABASE CLIENT FILES (Browser + Server + Middleware)
# ============================================================================
Write-Host ""
Write-Host "[3/4] Creating Supabase client files..." -ForegroundColor Cyan

# Ensure directories exist
New-Item -ItemType Directory -Force -Path "src/lib/supabase" | Out-Null

# --- Browser Client ---
@'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
'@ | Set-Content -Path "$root/src/lib/supabase/client.js" -Encoding UTF8
Write-Host "  >> src/lib/supabase/client.js" -ForegroundColor Green

# --- Server Client ---
@'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — read-only
          }
        },
      },
    }
  )
}
'@ | Set-Content -Path "$root/src/lib/supabase/server.js" -Encoding UTF8
Write-Host "  >> src/lib/supabase/server.js" -ForegroundColor Green

# --- Admin Client (service role — server only, bypasses RLS) ---
@'
import { createClient } from '@supabase/supabase-js'

// Service role client — NEVER expose on the client
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}
'@ | Set-Content -Path "$root/src/lib/supabase/admin.js" -Encoding UTF8
Write-Host "  >> src/lib/supabase/admin.js" -ForegroundColor Green

# --- Middleware helper ---
@'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
'@ | Set-Content -Path "$root/src/lib/supabase/middleware.js" -Encoding UTF8
Write-Host "  >> src/lib/supabase/middleware.js" -ForegroundColor Green

# ============================================================================
# 4. VEHICLE DATA HELPER (fetches from Supabase for public pages)
# ============================================================================
Write-Host ""
Write-Host "[4/4] Creating data helpers..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path "src/lib/data" | Out-Null

@'
import { createAdminClient } from '@/lib/supabase/admin'

const DEALER_ID = process.env.NEXT_PUBLIC_DEALER_ID || '00000000-0000-0000-0000-000000000001'

/**
 * Fetch all available vehicles (for public pages)
 * Uses admin client to bypass RLS — server-side only
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
 * Fetch vehicle count by status
 */
export async function getVehicleCounts() {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('status')
    .eq('dealer_id', DEALER_ID)

  if (error) return { available: 0, reserved: 0, sold: 0, total: 0 }

  const counts = { available: 0, reserved: 0, sold: 0, total: data.length }
  data.forEach(v => { counts[v.status] = (counts[v.status] || 0) + 1 })
  return counts
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
'@ | Set-Content -Path "$root/src/lib/data/vehicles.js" -Encoding UTF8
Write-Host "  >> src/lib/data/vehicles.js" -ForegroundColor Green

@'
import { createAdminClient } from '@/lib/supabase/admin'

const DEALER_ID = process.env.NEXT_PUBLIC_DEALER_ID || '00000000-0000-0000-0000-000000000001'

/**
 * Fetch leads for CRM dashboard
 */
export async function getLeads({ status, limit = 50 } = {}) {
  const supabase = createAdminClient()
  
  let query = supabase
    .from('leads')
    .select('*, vehicles(make, model, year, variant)')
    .eq('dealer_id', DEALER_ID)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) {
    console.error('Error fetching leads:', error)
    return []
  }
  return data
}

/**
 * Fetch lead counts by status (for Kanban columns)
 */
export async function getLeadCounts() {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('leads')
    .select('status')
    .eq('dealer_id', DEALER_ID)

  if (error) return {}

  const counts = {}
  data.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1 })
  return counts
}
'@ | Set-Content -Path "$root/src/lib/data/leads.js" -Encoding UTF8
Write-Host "  >> src/lib/data/leads.js" -ForegroundColor Green

# ============================================================================
# DONE
# ============================================================================
Write-Host ""
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "  SUPABASE SETUP COMPLETE" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "  FILES CREATED:" -ForegroundColor Cyan
Write-Host "    .env.local                    (FILL IN YOUR KEYS)"
Write-Host "    src/lib/supabase/client.js    (Browser client)"
Write-Host "    src/lib/supabase/server.js    (Server client)"
Write-Host "    src/lib/supabase/admin.js     (Service role client)"
Write-Host "    src/lib/supabase/middleware.js (Auth middleware)"
Write-Host "    src/lib/data/vehicles.js      (Vehicle queries)"
Write-Host "    src/lib/data/leads.js         (Lead queries)"
Write-Host ""
Write-Host "  NEXT STEPS:" -ForegroundColor Yellow
Write-Host "    1. Open .env.local and paste your Supabase keys" -ForegroundColor White
Write-Host "    2. In Supabase SQL Editor, run in order:" -ForegroundColor White
Write-Host "       - 01_schema.sql" -ForegroundColor Gray
Write-Host "       - 02_rls_policies.sql" -ForegroundColor Gray
Write-Host "       - 03_seed_data.sql" -ForegroundColor Gray
Write-Host "    3. Verify in Supabase Table Editor:" -ForegroundColor White
Write-Host "       - dealers: 1 row (Auto Alive)" -ForegroundColor Gray
Write-Host "       - vehicles: 10 rows (6 featured)" -ForegroundColor Gray
Write-Host "       - leads: 5 demo leads" -ForegroundColor Gray
Write-Host "       - sales: 1 (Kia Seltos)" -ForegroundColor Gray
Write-Host "    4. Remove-Item -Recurse -Force .next" -ForegroundColor White
Write-Host "    5. npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "  Proverbs 16:3" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Yellow
