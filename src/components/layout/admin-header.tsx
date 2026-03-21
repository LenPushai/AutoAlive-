'use client'
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
