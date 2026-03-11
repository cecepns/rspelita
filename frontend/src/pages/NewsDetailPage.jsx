import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CalendarDays, ChevronLeft } from 'lucide-react'
import apiClient from '../lib/apiClient.js'
import { CardSkeleton } from '../components/ui/Skeleton.jsx'

function NewsDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [article, setArticle] = useState(location.state?.article || null)
  const [loading, setLoading] = useState(!location.state?.article)

  useEffect(() => {
    if (location.state?.article) return

    async function load() {
      try {
        const res = await apiClient.get('/articles')
        const items = res.data.items || []
        const found = items.find((item) => String(item.id) === String(id)) || null
        setArticle(found)
      } catch (error) {
        console.error('Failed to load article', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, location.state?.article])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/berita')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-6 lg:py-12">
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-pelitaGreen hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Kembali ke daftar berita
      </button>

      {loading && (
        <div className="space-y-4">
          <CardSkeleton />
        </div>
      )}

      {!loading && !article && (
        <div className="rounded-xl border border-slate-100 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Berita tidak ditemukan atau sudah dihapus.
        </div>
      )}

      {article && (
        <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {article.image && (
            <div className="relative h-96 w-full bg-slate-100">
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="p-6 lg:p-8">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CalendarDays className="h-4 w-4" />
              <span>
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString('id-ID')
                  : 'Tanggal belum diatur'}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900 lg:text-3xl">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-3 text-sm font-medium text-slate-600">{article.excerpt}</p>
            )}
            <div
              className="prose prose-sm mt-5 max-w-none text-slate-700 prose-a:text-pelitaGreen"
              dangerouslySetInnerHTML={{ __html: article.body || '' }}
            />
          </div>
        </article>
      )}
    </div>
  )
}

export default NewsDetailPage

