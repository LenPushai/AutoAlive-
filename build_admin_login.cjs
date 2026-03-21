const fs = require('fs');
const path = require('path');

// ── 1. ROOT MIDDLEWARE ──────────────────────────────────────────────────────
fs.writeFileSync('middleware.js', `import { updateSession } from '@/lib/supabase/middleware'
export async function middleware(request) {
  return await updateSession(request)
}
export const config = {
  matcher: ['/dashboard/:path*'],
}
`);
console.log('✅ middleware.js created');

// ── 2. LOGIN PAGE ───────────────────────────────────────────────────────────
fs.writeFileSync('src/app/(auth)/login/page.tsx', `'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1f3d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '48px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f1f3d', letterSpacing: '-1px' }}>
            AUTO <span style={{ color: '#c9a84c' }}>ALIVE</span>
          </div>
          <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>Admin Portal</div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#444', marginBottom: '6px' }}>Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@autoalive.co.za"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#444', marginBottom: '6px' }}>Password</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #ffcccc', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#cc0000', marginBottom: '16px' }}>
              {error}
            </div>
          )}
          <button
            type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#999' : '#c9a84c', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
`);
console.log('✅ Login page created');

// ── 3. ADMIN SIDEBAR ────────────────────────────────────────────────────────
fs.writeFileSync('src/components/layout/admin-sidebar.tsx', `'use client'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/leads', label: 'Leads', icon: '👥' },
  { href: '/dashboard/inventory', label: 'Inventory', icon: '🚗' },
  { href: '/dashboard/sales', label: 'Sales', icon: '💰' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/login')
  }

  return (
    <aside style={{ width: '220px', background: '#0f1f3d', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '20px', fontWeight: '900', color: 'white', letterSpacing: '-0.5px' }}>
          AUTO <span style={{ color: '#c9a84c' }}>ALIVE</span>
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Admin Portal</div>
      </div>

      <nav style={{ flex: 1, padding: '16px 0' }}>
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <a key={item.href} href={item.href}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: active ? '700' : '400', color: active ? '#c9a84c' : 'rgba(255,255,255,0.7)', background: active ? 'rgba(201,168,76,0.1)' : 'transparent', borderLeft: active ? '3px solid #c9a84c' : '3px solid transparent', textDecoration: 'none', transition: 'all 0.2s' }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={handleLogout}
          style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '6px', padding: '8px', fontSize: '12px', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
`);
console.log('✅ Admin sidebar created');

// ── 4. ADMIN HEADER ─────────────────────────────────────────────────────────
fs.writeFileSync('src/components/layout/admin-header.tsx', `'use client'
import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/leads': 'Leads',
  '/dashboard/inventory': 'Inventory',
  '/dashboard/sales': 'Sales',
  '/dashboard/settings': 'Settings',
}

export function AdminHeader() {
  const pathname = usePathname()
  const title = titles[pathname] || 'Dashboard'
  const now = new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif' }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f1f3d', margin: 0 }}>{title}</h1>
        <p style={{ fontSize: '12px', color: '#999', margin: 0, marginTop: '2px' }}>{now}</p>
      </div>
      <div style={{ fontSize: '12px', color: '#999' }}>Auto Alive — Vanderbijlpark</div>
    </header>
  )
}
`);
console.log('✅ Admin header created');

// ── 5. DASHBOARD OVERVIEW PAGE ──────────────────────────────────────────────
fs.writeFileSync('src/app/(admin)/dashboard/page.tsx', `'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const [stats, setStats] = useState({ vehicles: 0, leads: 0, newLeads: 0, sold: 0 })
  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const sb = createClient()
      const [v, l, nl, s, rl] = await Promise.all([
        sb.from('vehicles').select('id', { count: 'exact', head: true }).eq('status', 'available'),
        sb.from('leads').select('id', { count: 'exact', head: true }),
        sb.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        sb.from('vehicles').select('id', { count: 'exact', head: true }).eq('status', 'sold'),
        sb.from('leads').select('id, first_name, last_name, phone, email, status, created_at, vehicle_id').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({ vehicles: v.count || 0, leads: l.count || 0, newLeads: nl.count || 0, sold: s.count || 0 })
      setRecentLeads(rl.data || [])
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { label: 'Vehicles In Stock', value: stats.vehicles, color: '#0f1f3d', icon: '🚗' },
    { label: 'Total Leads', value: stats.leads, color: '#c9a84c', icon: '👥' },
    { label: 'New Leads', value: stats.newLeads, color: '#22c55e', icon: '🔥' },
    { label: 'Vehicles Sold', value: stats.sold, color: '#6366f1', icon: '💰' },
  ]

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>Loading...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {cards.map(c => (
              <div key={c.label} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '3px solid ' + c.color }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{c.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: c.color }}>{c.value}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Leads */}
          <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f1f3d', marginBottom: '16px' }}>Recent Leads</h2>
            {recentLeads.length === 0 ? (
              <p style={{ color: '#999', fontSize: '13px' }}>No leads yet</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                    {['Name', 'Phone', 'Email', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#999', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map(lead => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '10px 12px', fontWeight: '600', color: '#0f1f3d' }}>{lead.first_name} {lead.last_name}</td>
                      <td style={{ padding: '10px 12px', color: '#555' }}>{lead.phone}</td>
                      <td style={{ padding: '10px 12px', color: '#555' }}>{lead.email || '—'}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ background: lead.status === 'new' ? '#dcfce7' : '#f0f0f0', color: lead.status === 'new' ? '#16a34a' : '#555', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#999' }}>{new Date(lead.created_at).toLocaleDateString('en-ZA')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
`);
console.log('✅ Dashboard overview page created');

console.log('\n🎉 ALL DONE - Admin login system built!');
console.log('Next: Create a Supabase user for Paul at supabase.com → Authentication → Users → Add User');
