'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const sb = createClient()
      const { data } = await sb
        .from('sales')
        .select('id, sale_price, sale_date, vehicles(make, model, year), leads(first_name, last_name)')
        .order('sale_date', { ascending: false })
      setSales(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const total = sales.reduce((sum, s) => sum + Number(s.sale_price || 0), 0)

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#999', fontFamily: 'Arial' }}>Loading...</div>

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header + total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f1f3d', margin: 0 }}>Sales</h1>
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{sales.length} recorded {sales.length === 1 ? 'sale' : 'sales'}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '12px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'right' }}>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#999', textTransform: 'uppercase' }}>Total Sales Value</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#16a34a' }}>R {total.toLocaleString('en-ZA')}</div>
        </div>
      </div>

      {sales.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '40px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
          No sales recorded yet. Record a sale from a lead in the Leads pipeline.
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                {['Vehicle', 'Buyer', 'Price', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#999', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 14px', fontWeight: '600', color: '#0f1f3d' }}>
                    {s.vehicles ? s.vehicles.year + ' ' + s.vehicles.make + ' ' + s.vehicles.model : '—'}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#555' }}>
                    {s.leads ? s.leads.first_name + ' ' + s.leads.last_name : '—'}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: '600', color: '#16a34a' }}>R {Number(s.sale_price).toLocaleString('en-ZA')}</td>
                  <td style={{ padding: '12px 14px', color: '#999' }}>{new Date(s.sale_date).toLocaleDateString('en-ZA')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
