import { useEffect, useRef, useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import apiClient from '../../lib/apiClient.js'
import { CardSkeleton } from '../../components/ui/Skeleton.jsx'

function FacilitiesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '' })
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [editImageFile, setEditImageFile] = useState(null)
  const [updating, setUpdating] = useState(false)
  const imageInputRef = useRef(null)
  const editImageInputRef = useRef(null)

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
    if (!form.name.trim() || !imageFile) return
    setSaving(true)
    try {
      const payload = new FormData()
      payload.append('name', form.name)
      payload.append('description', form.description)
      payload.append('image', imageFile)
      await apiClient.post('/facilities', payload)
      setForm({ name: '', description: '' })
      setImageFile(null)
      if (imageInputRef.current) {
        imageInputRef.current.value = ''
      }
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

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditForm({
      name: item.name || '',
      description: item.description || '',
    })
    setEditImageFile(null)
    if (editImageInputRef.current) {
      editImageInputRef.current.value = ''
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', description: '' })
    setEditImageFile(null)
    if (editImageInputRef.current) {
      editImageInputRef.current.value = ''
    }
  }

  const handleUpdate = async (id) => {
    if (!editForm.name.trim()) return
    setUpdating(true)
    try {
      const payload = new FormData()
      payload.append('name', editForm.name)
      payload.append('description', editForm.description)
      if (editImageFile) {
        payload.append('image', editImageFile)
      }
      await apiClient.put(`/facilities/${id}`, payload)
      cancelEdit()
      await load()
    } catch (error) {
      console.error('Failed to update facility', error)
    } finally {
      setUpdating(false)
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
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Gambar Fasilitas</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              required
              className="block w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 file:mr-3 file:rounded file:border-0 file:bg-pelitaGreen file:px-2 file:py-1 file:text-xs file:font-semibold file:text-white"
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
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-600">Nama Fasilitas</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                          className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs outline-none focus:border-pelitaGreen"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-600">Deskripsi</label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, description: e.target.value }))
                          }
                          rows={3}
                          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-pelitaGreen"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-600">
                          Ganti Gambar (opsional)
                        </label>
                        <input
                          ref={editImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                          className="block w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 file:mr-2 file:rounded file:border-0 file:bg-pelitaGreen file:px-2 file:py-1 file:text-[11px] file:font-semibold file:text-white"
                        />
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdate(item.id)}
                          disabled={updating}
                          className="inline-flex items-center gap-1 rounded-md bg-pelitaGreen px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          <span>{updating ? 'Menyimpan...' : 'Simpan'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={updating}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                          <X className="h-3 w-3" />
                          <span>Batal</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-28 w-full rounded-md object-cover"
                        />
                      ) : null}
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-slate-600">
                        {item.description ||
                          'Belum ada deskripsi. Anda dapat memperbaruinya nanti.'}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="inline-flex items-center gap-1 self-start text-[11px] text-emerald-600 hover:underline"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1 self-start text-[11px] text-red-500 hover:underline"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </>
                  )}
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

