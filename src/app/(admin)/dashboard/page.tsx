'use client'
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
