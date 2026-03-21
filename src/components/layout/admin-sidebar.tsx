'use client'
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
