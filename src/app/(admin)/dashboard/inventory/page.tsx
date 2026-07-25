'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const STATUS_COLORS: Record<string, string> = {
  available: '#16a34a',
  sold: '#dc2626',
  reserved: '#d97706',
  pending: '#6366f1',
}

export default function InventoryPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  async function load() {
    const sb = createClient()
    const { data } = await sb.from('vehicles').select('*').order('created_at', { ascending: false })
    setVehicles(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string, make: string, model: string) {
    if (!confirm('Delete ' + make + ' ' + model + '? This cannot be undone.')) return
    setDeleting(id)
    const sb = createClient()
    await sb.from('vehicles').delete().eq('id', id)
    await load()
    setDeleting(null)
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === 'available' ? 'sold' : 'available'
    const sb = createClient()
    await sb.from('vehicles').update({ status: next }).eq('id', id)
    await load()
  }

  const filtered = vehicles.filter(v =>
    (v.make + ' ' + v.model + ' ' + v.variant + ' ' + v.year).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f1f3d', margin: 0 }}>Inventory</h1>
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{vehicles.length} vehicles total</p>
        </div>
        <a href="/dashboard/inventory/new"
          style={{ background: '#c9a84c', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
          + Add Vehicle
        </a>
      </div>

      {/* Search */}
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by make, model, year..."
        style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' }}
      />

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>Loading...</div>
      ) : (
        <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                {['Vehicle', 'Year', 'Price', 'Mileage', 'Status', 'Featured', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#999', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '600', color: '#0f1f3d' }}>{v.make} {v.model}</div>
                    <div style={{ fontSize: '11px', color: '#999' }}>{v.variant}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#555' }}>{v.year}</td>
                  <td style={{ padding: '12px 14px', fontWeight: '600', color: '#0f1f3d' }}>R {Number(v.price).toLocaleString('en-ZA')}</td>
                  <td style={{ padding: '12px 14px', color: '#555' }}>{Number(v.mileage).toLocaleString('en-ZA')} km</td>
                  <td style={{ padding: '12px 14px' }}>
                    <button onClick={() => toggleStatus(v.id, v.status)}
                      style={{ background: STATUS_COLORS[v.status] + '20', color: STATUS_COLORS[v.status], border: 'none', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                      {v.status}
                    </button>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ color: v.is_featured ? '#c9a84c' : '#ccc', fontSize: '16px' }}>{v.is_featured ? '★' : '☆'}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a href={'/dashboard/inventory/' + v.id}
                        style={{ background: '#f0f0f0', color: '#555', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', textDecoration: 'none', cursor: 'pointer' }}>
                        Edit
                      </a>
                      <button onClick={() => handleDelete(v.id, v.make, v.model)} disabled={deleting === v.id}
                        style={{ background: '#fff0f0', color: '#dc2626', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                        {deleting === v.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No vehicles found</div>
          )}
        </div>
      )}
    </div>
  )
}
