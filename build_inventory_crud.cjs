const fs = require('fs');

// ── INVENTORY LIST PAGE ─────────────────────────────────────────────────────
fs.writeFileSync('src/app/(admin)/dashboard/inventory/page.tsx', `'use client'
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
`);
console.log('✅ Inventory list page created');

// ── ADD VEHICLE PAGE ────────────────────────────────────────────────────────
fs.mkdirSync('src/app/(admin)/dashboard/inventory/new', { recursive: true });
fs.writeFileSync('src/app/(admin)/dashboard/inventory/new/page.tsx', `'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const DEALER_ID = '00000000-0000-0000-0000-000000000001'

export default function NewVehiclePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    make: '', model: '', variant: '', year: new Date().getFullYear(),
    price: '', mileage: '', fuel_type: 'petrol', transmission: 'manual',
    colour: '', body_type: '', engine_size: '', description: '',
    status: 'available', is_featured: false,
  })

  function set(key: string, val: any) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.make || !form.model || !form.price) { alert('Make, Model and Price are required'); return }
    setSaving(true)
    const sb = createClient()
    const { error } = await sb.from('vehicles').insert({
      ...form,
      dealer_id: DEALER_ID,
      price: Number(form.price),
      mileage: Number(form.mileage),
      year: Number(form.year),
      images: [],
      features: [],
    })
    if (error) { alert('Error: ' + error.message); setSaving(false); return }
    router.push('/dashboard/inventory')
  }

  const inp = { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', width: '100%', boxSizing: 'border-box' as const, outline: 'none' }
  const lbl = { display: 'block', fontSize: '11px', fontWeight: '600', color: '#666', marginBottom: '4px', textTransform: 'uppercase' as const }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <a href="/dashboard/inventory" style={{ color: '#999', textDecoration: 'none', fontSize: '13px' }}>← Back</a>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f1f3d', margin: 0 }}>Add New Vehicle</h1>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f1f3d', marginBottom: '16px' }}>Basic Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label style={lbl}>Make *</label><input style={inp} value={form.make} onChange={e => set('make', e.target.value)} placeholder="e.g. Toyota" /></div>
            <div><label style={lbl}>Model *</label><input style={inp} value={form.model} onChange={e => set('model', e.target.value)} placeholder="e.g. Hilux" /></div>
            <div><label style={lbl}>Variant</label><input style={inp} value={form.variant} onChange={e => set('variant', e.target.value)} placeholder="e.g. 2.4 GD-6 SRX" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div><label style={lbl}>Year *</label><input style={inp} type="number" value={form.year} onChange={e => set('year', e.target.value)} /></div>
            <div><label style={lbl}>Price (R) *</label><input style={inp} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 485000" /></div>
            <div><label style={lbl}>Mileage (km)</label><input style={inp} type="number" value={form.mileage} onChange={e => set('mileage', e.target.value)} placeholder="e.g. 48000" /></div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f1f3d', marginBottom: '16px' }}>Specifications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label style={lbl}>Fuel Type</label>
              <select style={inp} value={form.fuel_type} onChange={e => set('fuel_type', e.target.value)}>
                {['petrol','diesel','hybrid','electric'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Transmission</label>
              <select style={inp} value={form.transmission} onChange={e => set('transmission', e.target.value)}>
                {['manual','automatic'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Body Type</label>
              <select style={inp} value={form.body_type} onChange={e => set('body_type', e.target.value)}>
                {['','Sedan','Hatchback','SUV','Double Cab','Single Cab','Wagon','Coupe','Convertible','Van','Bus'].map(o => <option key={o} value={o}>{o||'Select...'}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={lbl}>Colour</label><input style={inp} value={form.colour} onChange={e => set('colour', e.target.value)} placeholder="e.g. White" /></div>
            <div><label style={lbl}>Engine Size</label><input style={inp} value={form.engine_size} onChange={e => set('engine_size', e.target.value)} placeholder="e.g. 2.4L Turbo Diesel" /></div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f1f3d', marginBottom: '16px' }}>Listing Options</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label style={lbl}>Status</label>
              <select style={inp} value={form.status} onChange={e => set('status', e.target.value)}>
                {['available','sold','reserved','pending'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px' }}>
              <input type="checkbox" id="featured" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} style={{ width: '16px', height: '16px' }} />
              <label htmlFor="featured" style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Featured on homepage</label>
            </div>
          </div>
          <div><label style={lbl}>Description</label>
            <textarea style={{ ...inp, resize: 'vertical' }} rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Vehicle description..." />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" disabled={saving}
            style={{ background: saving ? '#999' : '#c9a84c', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving...' : 'Save Vehicle'}
          </button>
          <a href="/dashboard/inventory"
            style={{ background: '#f0f0f0', color: '#555', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
`);
console.log('✅ Add vehicle page created');

// ── EDIT VEHICLE PAGE ───────────────────────────────────────────────────────
fs.mkdirSync('src/app/(admin)/dashboard/inventory/[id]', { recursive: true });
fs.writeFileSync('src/app/(admin)/dashboard/inventory/[id]/page.tsx', `'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'

export default function EditVehiclePage() {
  const router = useRouter()
  const { id } = useParams()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const sb = createClient()
      const { data } = await sb.from('vehicles').select('*').eq('id', id).single()
      if (data) setForm(data)
      setLoading(false)
    }
    load()
  }, [id])

  function set(key: string, val: any) { setForm((f: any) => ({ ...f, [key]: val })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const sb = createClient()
    const { error } = await sb.from('vehicles').update({
      make: form.make, model: form.model, variant: form.variant,
      year: Number(form.year), price: Number(form.price), mileage: Number(form.mileage),
      fuel_type: form.fuel_type, transmission: form.transmission,
      colour: form.colour, body_type: form.body_type, engine_size: form.engine_size,
      description: form.description, status: form.status, is_featured: form.is_featured,
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) { alert('Error: ' + error.message); setSaving(false); return }
    router.push('/dashboard/inventory')
  }

  const inp = { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', width: '100%', boxSizing: 'border-box' as const, outline: 'none' }
  const lbl = { display: 'block', fontSize: '11px', fontWeight: '600', color: '#666', marginBottom: '4px', textTransform: 'uppercase' as const }

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#999', fontFamily: 'Arial' }}>Loading...</div>
  if (!form) return <div style={{ textAlign: 'center', padding: '60px', color: '#999', fontFamily: 'Arial' }}>Vehicle not found</div>

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <a href="/dashboard/inventory" style={{ color: '#999', textDecoration: 'none', fontSize: '13px' }}>← Back</a>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f1f3d', margin: 0 }}>Edit — {form.make} {form.model}</h1>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f1f3d', marginBottom: '16px' }}>Basic Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label style={lbl}>Make</label><input style={inp} value={form.make} onChange={e => set('make', e.target.value)} /></div>
            <div><label style={lbl}>Model</label><input style={inp} value={form.model} onChange={e => set('model', e.target.value)} /></div>
            <div><label style={lbl}>Variant</label><input style={inp} value={form.variant||''} onChange={e => set('variant', e.target.value)} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div><label style={lbl}>Year</label><input style={inp} type="number" value={form.year} onChange={e => set('year', e.target.value)} /></div>
            <div><label style={lbl}>Price (R)</label><input style={inp} type="number" value={form.price} onChange={e => set('price', e.target.value)} /></div>
            <div><label style={lbl}>Mileage (km)</label><input style={inp} type="number" value={form.mileage} onChange={e => set('mileage', e.target.value)} /></div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f1f3d', marginBottom: '16px' }}>Specifications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label style={lbl}>Fuel Type</label>
              <select style={inp} value={form.fuel_type} onChange={e => set('fuel_type', e.target.value)}>
                {['petrol','diesel','hybrid','electric'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Transmission</label>
              <select style={inp} value={form.transmission} onChange={e => set('transmission', e.target.value)}>
                {['manual','automatic'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Body Type</label>
              <select style={inp} value={form.body_type||''} onChange={e => set('body_type', e.target.value)}>
                {['','Sedan','Hatchback','SUV','Double Cab','Single Cab','Wagon','Coupe','Convertible','Van','Bus'].map(o => <option key={o} value={o}>{o||'Select...'}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={lbl}>Colour</label><input style={inp} value={form.colour||''} onChange={e => set('colour', e.target.value)} /></div>
            <div><label style={lbl}>Engine Size</label><input style={inp} value={form.engine_size||''} onChange={e => set('engine_size', e.target.value)} /></div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label style={lbl}>Status</label>
              <select style={inp} value={form.status} onChange={e => set('status', e.target.value)}>
                {['available','sold','reserved','pending'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px' }}>
              <input type="checkbox" id="featured" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} style={{ width: '16px', height: '16px' }} />
              <label htmlFor="featured" style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Featured on homepage</label>
            </div>
          </div>
          <div><label style={lbl}>Description</label>
            <textarea style={{ ...inp, resize: 'vertical' }} rows={4} value={form.description||''} onChange={e => set('description', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" disabled={saving}
            style={{ background: saving ? '#999' : '#c9a84c', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <a href="/dashboard/inventory"
            style={{ background: '#f0f0f0', color: '#555', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
`);
console.log('✅ Edit vehicle page created');
console.log('\n🎉 ALL DONE - Inventory CRUD complete!');
console.log('Features: List + Search, Add Vehicle, Edit Vehicle, Delete, Toggle Status (available/sold), Featured toggle');
