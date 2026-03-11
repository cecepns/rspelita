import { useEffect, useState } from 'react'
import { Activity, FileText, Stethoscope, Users } from 'lucide-react'
import apiClient from '../../lib/apiClient.js'
import { CardSkeleton } from '../../components/ui/Skeleton.jsx'

function DashboardHomePage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get('/dashboard/summary')
        setSummary(res.data)
      } catch (error) {
        console.error('Failed to load dashboard summary', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    {
      key: 'facilities',
      label: 'Fasilitas Layanan',
      icon: Stethoscope,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      key: 'doctors',
      label: 'Dokter Terdaftar',
      icon: Users,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      key: 'articles',
      label: 'Berita Dipublikasikan',
      icon: FileText,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      key: 'activeDoctors',
      label: 'Dokter Aktif',
      icon: Activity,
      color: 'text-rose-600 bg-rose-50',
    },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          Ringkasan Dashboard
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Monitor sekilas konten utama website RS Pelita.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          : cards.map((card) => {
              const Icon = card.icon
              const value = summary?.[card.key] ?? 0
              return (
                <div
                  key={card.key}
                  className="flex flex-col rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">
                        {card.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {value}
                      </p>
                    </div>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${card.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              )
            })}
      </section>
    </div>
  )
}

export default DashboardHomePage

