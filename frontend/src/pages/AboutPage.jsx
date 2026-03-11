import { useEffect, useState } from 'react'
import apiClient from '../lib/apiClient.js'
import { TextSkeleton } from '../components/ui/Skeleton.jsx'

function AboutPage() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get('/content/about')
        setContent(res.data)
      } catch (error) {
        console.error('Failed to load about content', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const title = content?.title || 'Tentang RS Pelita'
  const body =
    content?.body ||
    'Placeholder narasi profil singkat rumah sakit. Silakan isi melalui dashboard admin untuk menampilkan visi, misi, sejarah, dan komitmen layanan RS Pelita.'

  const visionTitle = content?.vision_title || 'Visi'
  const visionBody =
    content?.vision_body ||
    'Menjadi rumah sakit rujukan dengan pelayanan yang humanis dan profesional.'
  const missionTitle = content?.mission_title || 'Misi'
  const missionBody =
    content?.mission_body ||
    'Memberikan pelayanan kesehatan yang bermutu dengan mengutamakan keselamatan pasien.'
  const mottoTitle = content?.motto_title || 'Motto'
  const mottoBody =
    content?.motto_body ||
    'Motto singkat rumah sakit. Semua teks dapat diubah lewat admin.'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-12">
      <header className="space-y-2" data-aos="fade-up">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          Tentang Kami
        </p>
        {loading ? (
          <TextSkeleton lines={2} />
        ) : (
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            {title}
          </h1>
        )}
      </header>

      <section className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600 md:text-base">
        {loading ? (
          <TextSkeleton lines={6} />
        ) : (
          <p data-aos="fade-up" data-aos-delay="50">
            {body}
          </p>
        )}

        <div
          className="mt-8 grid gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:grid-cols-3"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {visionTitle}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {visionBody}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {missionTitle}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {missionBody}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {mottoTitle}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {mottoBody}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage

