import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import apiClient from '../../lib/apiClient.js'
import { CardSkeleton } from '../../components/ui/Skeleton.jsx'

const DAY_LABELS = [
  { key: 'schedule_senin', label: 'Senin' },
  { key: 'schedule_selasa', label: 'Selasa' },
  { key: 'schedule_rabu', label: 'Rabu' },
  { key: 'schedule_kamis', label: 'Kamis' },
  { key: 'schedule_jumat', label: 'Jumat' },
  { key: 'schedule_sabtu', label: 'Sabtu' },
]

const initialForm = {
  name: '',
  specialty: '',
  image: null,
  schedule_senin: '',
  schedule_selasa: '',
  schedule_rabu: '',
  schedule_kamis: '',
  schedule_jumat: '',
  schedule_sabtu: '',
}

function DoctorsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/doctors')
      setItems(res.data.items || [])
    } catch (error) {
      console.error('Failed to load doctors', error)
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
      const fd = new FormData()
      fd.append('name', form.name.trim())
      fd.append('specialty', form.specialty.trim())
      DAY_LABELS.forEach(({ key }) => fd.append(key, form[key]?.trim() || ''))
      if (form.image) fd.append('image', form.image)
      await apiClient.post('/doctors', fd)
      setForm({ ...initialForm })
      await load()
    } catch (error) {
      console.error('Failed to save doctor', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data dokter ini?')) return
    try {
      await apiClient.delete(`/doctors/${id}`)
      await load()
    } catch (error) {
      console.error('Failed to delete doctor', error)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          Jadwal &amp; Praktek Dokter
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Data dokter tampil di halaman depan (tabel jadwal Senin–Sabtu) dan
          halaman Layanan. Isi jadwal per hari, misal 13:00–16:00 atau Tidak
          Praktek.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form
          className="space-y-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
          onSubmit={handleSubmit}
        >
          <p className="text-sm font-semibold text-slate-800">Tambah Dokter</p>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Nama Dokter</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-pelitaGreen"
              placeholder="dr. Nama, Sp.PD"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Spesialisasi</label>
            <input
              type="text"
              value={form.specialty}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, specialty: e.target.value }))
              }
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-pelitaGreen"
              placeholder="Contoh: Penyakit Dalam"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Foto Dokter</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, image: e.target.files?.[0] }))
              }
              className="w-full text-sm text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-pelitaGreen file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white file:hover:bg-emerald-700"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-700">
              Jadwal per hari (contoh: 13:00–16:00 atau Tidak Praktek)
            </p>
            {DAY_LABELS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <label className="w-16 shrink-0 text-xs text-slate-600">
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="h-8 flex-1 rounded-md border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-pelitaGreen"
                  placeholder="13:00-16:00"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-pelitaGreen px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            <Plus className="h-3 w-3" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Dokter'}</span>
          </button>
        </form>

        <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-800">Daftar Dokter</p>
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-slate-500">
              Belum ada data dokter. Tambahkan minimal satu dokter.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        No foto
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-0.5 text-slate-600">
                      {item.specialty || '—'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Jadwal: Senin–Sabtu (lihat di halaman depan)
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="mt-2 inline-flex items-center gap-1 text-red-500 hover:underline"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default DoctorsPage
