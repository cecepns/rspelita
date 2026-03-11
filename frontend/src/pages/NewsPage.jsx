import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronRight } from 'lucide-react'
import apiClient from '../lib/apiClient.js'
import { CardSkeleton } from '../components/ui/Skeleton.jsx'

function NewsPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get('/articles')
        setArticles(res.data.items || [])
      } catch (error) {
        console.error('Failed to load articles', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handleOpenArticle(article) {
    navigate(`/berita/${article.id}`, { state: { article } })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-12">
      <header className="space-y-2" data-aos="fade-up">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          Berita
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Berita &amp; Informasi Terbaru
        </h1>
      </header>

      <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          : articles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                data-aos="fade-up"
              >
                <div className="relative h-40 w-full bg-slate-100">
                  {/* Placeholder image area - will use uploaded article image if ada */}
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
                      Placeholder gambar berita (diisi dari upload admin)
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <CalendarDays className="h-3 w-3" />
                    <span>
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString(
                            'id-ID',
                          )
                        : 'Tanggal belum diatur'}
                    </span>
                  </div>
                  <h2 className="mt-2 line-clamp-2 text-md font-semibold text-slate-900">
                    {article.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                    {article.excerpt ||
                      'Placeholder ringkasan singkat berita. Silakan isi konten lengkap melalui admin.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenArticle(article)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-pelitaGreen hover:underline"
                  >
                    Baca selengkapnya
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </article>
            ))}
      </section>
    </div>
  )
}

export default NewsPage

