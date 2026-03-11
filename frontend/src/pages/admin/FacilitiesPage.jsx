import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import apiClient from '../../lib/apiClient.js'
import { CardSkeleton } from '../../components/ui/Skeleton.jsx'

function FacilitiesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/facilities')
      setItems(res.data.items || [])
    } catch (error) {
      console.error('Failed to load facilities', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      await apiClient.post('/facilities', form)
      setForm({ name: '', description: '' })
      await load()
    } catch (error) {
      console.error('Failed to save facility', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus fasilitas ini?')) return
    try {
      await apiClient.delete(`/facilities/${id}`)
      await load()
    } catch (error) {
      console.error('Failed to delete facility', error)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          Fasilitas Layanan
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Tambah dan kelola data fasilitas yang tampil di halaman Layanan.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form
          className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
          onSubmit={handleSubmit}
        >
          <p className="text-xs font-semibold text-slate-800">
            Tambah Fasilitas Baru
          </p>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Nama Fasilitas</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-pelitaGreen"
              placeholder="Contoh: IGD 24 Jam"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Deskripsi Singkat</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm outline-none focus:border-pelitaGreen"
              placeholder="Opsional, deskripsi singkat fasilitas."
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-pelitaGreen px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            <Plus className="h-3 w-3" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Fasilitas'}</span>
          </button>
        </form>

        <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-800">
            Daftar Fasilitas
          </p>
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-xs text-slate-500">
              Belum ada fasilitas. Tambahkan minimal satu fasilitas.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs"
                >
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-slate-600">
                    {item.description ||
                      'Belum ada deskripsi. Anda dapat memperbaruinya nanti.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="mt-2 inline-flex items-center gap-1 self-start text-[11px] text-red-500 hover:underline"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Hapus</span>
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default FacilitiesPage

