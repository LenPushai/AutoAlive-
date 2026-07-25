'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { VEHICLE_STATUSES } from '@/config/constants'

export default function EditVehiclePage() {
  const router = useRouter()
  const params = useParams(); const id = params.id as string
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
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

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const json = await res.json().catch(() => ({}))
    setUploading(false)
    if (!res.ok) { alert(json.error || 'Upload failed. Please use a JPG or PNG under 5MB.'); return }
    set('thumbnail', json.url)
    set('images', [json.url])
  }

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
      thumbnail: form.thumbnail ?? null, images: form.images ?? [],
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
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f1f3d', marginBottom: '16px' }}>Photo</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {form.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.thumbnail} alt="Vehicle" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e0e0e0' }} />
            ) : (
              <div style={{ width: '120px', height: '80px', borderRadius: '8px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#ccc' }}>🚗</div>
            )}
            <div>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} disabled={uploading} style={{ fontSize: '13px' }} />
              <div style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}>{uploading ? 'Uploading…' : 'JPG or PNG, up to 5MB. Replaces the current photo.'}</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label style={lbl}>Status</label>
              <select style={inp} value={form.status} onChange={e => set('status', e.target.value)}>
                {VEHICLE_STATUSES.map(o => <option key={o}>{o}</option>)}
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
          <button type="submit" disabled={saving || uploading}
            style={{ background: (saving || uploading) ? '#999' : '#c9a84c', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: (saving || uploading) ? 'not-allowed' : 'pointer' }}>
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
