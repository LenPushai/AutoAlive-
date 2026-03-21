const fs = require('fs');

fs.writeFileSync('src/app/(admin)/dashboard/leads/page.tsx', `'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const COLUMNS = [
  { id: 'new',          label: 'New',          color: '#3b82f6', bg: '#eff6ff' },
  { id: 'contacted',   label: 'Contacted',    color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'test_drive',  label: 'Test Drive',   color: '#f59e0b', bg: '#fffbeb' },
  { id: 'negotiating', label: 'Negotiating',  color: '#f97316', bg: '#fff7ed' },
  { id: 'won',         label: 'Won',          color: '#16a34a', bg: '#f0fdf4' },
  { id: 'lost',        label: 'Lost',         color: '#dc2626', bg: '#fef2f2' },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [updating, setUpdating] = useState<string | null>(null)

  async function load() {
    const sb = createClient()
    const { data } = await sb
      .from('leads')
      .select('*, vehicles(make, model, year, price)')
      .order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function moveLead(leadId: string, newStatus: string) {
    setUpdating(leadId)
    const sb = createClient()
    await sb.from('leads').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', leadId)
    await load()
    if (selected?.id === leadId) setSelected((s: any) => ({ ...s, status: newStatus }))
    setUpdating(null)
  }

  async function deleteLead(leadId: string) {
    if (!confirm('Delete this lead? This cannot be undone.')) return
    const sb = createClient()
    await sb.from('leads').delete().eq('id', leadId)
    setSelected(null)
    await load()
  }

  const byStatus = (status: string) => leads.filter(l => l.status === status)

  const cardStyle = (col: typeof COLUMNS[0]) => ({
    background: 'white',
    border: '1px solid #f0f0f0',
    borderLeft: '3px solid ' + col.color,
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    fontFamily: 'Arial, sans-serif',
  })

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#999', fontFamily: 'Arial' }}>Loading...</div>

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f1f3d', margin: 0 }}>Lead Pipeline</h1>
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{leads.length} total leads</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['kanban', 'table'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: '7px 16px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: view === v ? '#0f1f3d' : '#f0f0f0', color: view === v ? 'white' : '#555' }}>
              {v === 'kanban' ? '⬛ Kanban' : '☰ Table'}
            </button>
          ))}
        </div>
      </div>

      {view === 'kanban' ? (
        /* ── KANBAN VIEW ── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', alignItems: 'start' }}>
          {COLUMNS.map(col => (
            <div key={col.id}>
              {/* Column header */}
              <div style={{ background: col.bg, border: '1px solid ' + col.color + '40', borderRadius: '8px', padding: '8px 10px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: col.color, textTransform: 'uppercase' }}>{col.label}</span>
                <span style={{ background: col.color, color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: '700' }}>{byStatus(col.id).length}</span>
              </div>
              {/* Cards */}
              {byStatus(col.id).map(lead => (
                <div key={lead.id} style={cardStyle(col)} onClick={() => setSelected(lead)}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#0f1f3d', marginBottom: '2px' }}>
                    {lead.first_name} {lead.last_name}
                  </div>
                  {lead.vehicles && (
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                      {lead.vehicles.year} {lead.vehicles.make} {lead.vehicles.model}
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: '#aaa' }}>{lead.phone}</div>
                  <div style={{ fontSize: '10px', color: '#bbb', marginTop: '4px' }}>
                    {new Date(lead.created_at).toLocaleDateString('en-ZA')}
                  </div>
                  {/* Quick move buttons */}
                  <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {COLUMNS.filter(c => c.id !== col.id).map(c => (
                      <button key={c.id} onClick={e => { e.stopPropagation(); moveLead(lead.id, c.id) }}
                        disabled={updating === lead.id}
                        style={{ background: c.bg, color: c.color, border: '1px solid ' + c.color + '40', borderRadius: '4px', padding: '2px 5px', fontSize: '9px', fontWeight: '600', cursor: 'pointer' }}>
                        → {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {byStatus(col.id).length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 8px', color: '#ccc', fontSize: '12px', border: '1px dashed #e0e0e0', borderRadius: '8px' }}>
                  No leads
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* ── TABLE VIEW ── */
        <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                {['Name', 'Phone', 'Email', 'Vehicle', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#999', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const col = COLUMNS.find(c => c.id === lead.status) || COLUMNS[0]
                return (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }} onClick={() => setSelected(lead)}>
                    <td style={{ padding: '10px 14px', fontWeight: '600', color: '#0f1f3d' }}>{lead.first_name} {lead.last_name}</td>
                    <td style={{ padding: '10px 14px', color: '#555' }}>{lead.phone}</td>
                    <td style={{ padding: '10px 14px', color: '#555' }}>{lead.email || '—'}</td>
                    <td style={{ padding: '10px 14px', color: '#555' }}>{lead.vehicles ? lead.vehicles.year + ' ' + lead.vehicles.make + ' ' + lead.vehicles.model : '—'}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: col.bg, color: col.color, padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>{col.label}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#999' }}>{new Date(lead.created_at).toLocaleDateString('en-ZA')}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <select value={lead.status} onChange={e => { e.stopPropagation(); moveLead(lead.id, e.target.value) }}
                        onClick={e => e.stopPropagation()}
                        style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                        {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── LEAD DETAIL MODAL ── */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setSelected(null)}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f1f3d', margin: 0 }}>{selected.first_name} {selected.last_name}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#999' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                ['Phone', selected.phone],
                ['Email', selected.email || '—'],
                ['Source', selected.source || '—'],
                ['Date', new Date(selected.created_at).toLocaleDateString('en-ZA')],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: '10px', fontWeight: '600', color: '#999', textTransform: 'uppercase', marginBottom: '2px' }}>{k}</div>
                  <div style={{ fontSize: '13px', color: '#333' }}>{v}</div>
                </div>
              ))}
            </div>

            {selected.vehicles && (
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#999', textTransform: 'uppercase', marginBottom: '4px' }}>Enquired Vehicle</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f1f3d' }}>{selected.vehicles.year} {selected.vehicles.make} {selected.vehicles.model}</div>
                <div style={{ fontSize: '13px', color: '#c9a84c', fontWeight: '600' }}>R {Number(selected.vehicles.price).toLocaleString('en-ZA')}</div>
              </div>
            )}

            {selected.notes && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#999', textTransform: 'uppercase', marginBottom: '4px' }}>Notes</div>
                <div style={{ fontSize: '13px', color: '#555', background: '#f9f9f9', borderRadius: '8px', padding: '10px' }}>{selected.notes}</div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#999', textTransform: 'uppercase', marginBottom: '6px' }}>Move to Stage</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {COLUMNS.map(col => (
                  <button key={col.id} onClick={() => moveLead(selected.id, col.id)}
                    style={{ background: selected.status === col.id ? col.color : col.bg, color: selected.status === col.id ? 'white' : col.color, border: '1px solid ' + col.color + '60', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={'tel:' + selected.phone}
                style={{ flex: 1, background: '#0f1f3d', color: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                📞 Call
              </a>
              <a href={'https://wa.me/27' + selected.phone.replace(/^0/, '').replace(/\s/g, '')}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, background: '#16a34a', color: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                💬 WhatsApp
              </a>
              <button onClick={() => deleteLead(selected.id)}
                style={{ background: '#fff0f0', color: '#dc2626', border: 'none', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                🗑
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
`);

console.log('✅ Leads Kanban CRM built!');
console.log('Features: Kanban + Table view toggle, 6 pipeline stages, lead detail modal, quick move buttons, Call + WhatsApp CTAs, delete');
