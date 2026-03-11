import { useEffect, useState } from 'react'
import { Stethoscope } from 'lucide-react'
import apiClient from '../lib/apiClient.js'
import { CardSkeleton } from '../components/ui/Skeleton.jsx'

function ServicesPage() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get('/facilities')
        setFacilities(res.data.items || [])
      } catch (error) {
        console.error('Failed to load facilities', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-12">
      <header className="space-y-2" data-aos="fade-up">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          Layanan
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Fasilitas &amp; Pelayanan RS Pelita
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 md:text-base">
          Data fasilitas layanan ini dikelola dari modul admin &quot;Fasilitas
          Layanan&quot;. Anda dapat menambah, mengubah, atau menyembunyikan
          layanan sesuai kebutuhan.
        </p>
      </header>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-slate-800">
          Fasilitas Layanan
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Ditampilkan secara dinamis dari database.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            : facilities.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  data-aos="fade-up"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-pelitaGreen">
                      <Stethoscope className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-slate-600">
                        {item.description ||
                          'Placeholder deskripsi layanan. Silakan isi detail melalui dashboard admin.'}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </section>
    </div>
  )
}

export default ServicesPage

