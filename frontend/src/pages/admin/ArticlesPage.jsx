import { useEffect, useState } from 'react'
import { CalendarDays, Image, Plus, Trash2 } from 'lucide-react'
import apiClient from '../../lib/apiClient.js'
import { CardSkeleton } from '../../components/ui/Skeleton.jsx'

function ArticlesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    body: '',
    image: null,
  })

  const load = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/articles')
      setItems(res.data.items || [])
    } catch (error) {
      console.error('Failed to load articles', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const data = new FormData()
      data.append('title', form.title)
      data.append('excerpt', form.excerpt)
      data.append('body', form.body)
      if (form.image) {
        data.append('image', form.image)
      }
      await apiClient.post('/articles', data)
      setForm({ title: '', excerpt: '', body: '', image: null })
      await load()
    } catch (error) {
      console.error('Failed to save article', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus berita ini?')) return
    try {
      await apiClient.delete(`/articles/${id}`)
      await load()
    } catch (error) {
      console.error('Failed to delete article', error)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Berita</h2>
        <p className="mt-1 text-xs text-slate-500">
          Kelola berita dan artikel yang tampil di halaman Berita.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form
          className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
          onSubmit={handleSubmit}
        >
          <p className="text-xs font-semibold text-slate-800">Tambah Berita</p>

          <div className="space-y-1">
            <label className="text-xs text-slate-600">Judul</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-pelitaGreen"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-600">Ringkasan</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm outline-none focus:border-pelitaGreen"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-600">Isi Konten</label>
            <textarea
              rows={4}
              value={form.body}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, body: e.target.value }))
              }
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm outline-none focus:border-pelitaGreen"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-600">
              Gambar (opsional, jpg/png)
            </label>
            <div className="flex items-center gap-2 text-xs">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 hover:border-pelitaGreen">
                <Image className="h-4 w-4 text-slate-500" />
                <span>Pilih file</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      image: e.target.files?.[0] || null,
                    }))
                  }
                />
              </label>
              {form.image && (
                <span className="truncate text-slate-500">
                  {form.image.name}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-pelitaGreen px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            <Plus className="h-3 w-3" />
            <span>{saving ? 'Menyimpan...' : 'Publikasikan Berita'}</span>
          </button>
        </form>

        <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-800">
            Daftar Berita
          </p>
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-xs text-slate-500">
              Belum ada berita. Tambahkan berita pertama Anda.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((article) => (
                <article
                  key={article.id}
                  className="flex flex-col rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">
                      {article.title}
                    </p>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <CalendarDays className="h-3 w-3" />
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString(
                            'id-ID',
                          )
                        : 'Belum diatur'}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-slate-600">
                    {article.excerpt ||
                      'Belum ada ringkasan. Akan diambil dari isi konten.'}
                  </p>
                  {article.image && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-16 w-24 shrink-0 overflow-hidden rounded border border-slate-200 bg-white">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="line-clamp-2 text-[11px] text-slate-500 break-all">
                        {article.image}
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(article.id)}
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

export default ArticlesPage

