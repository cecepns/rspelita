import { useEffect, useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import apiClient from '../lib/apiClient.js'
import { TextSkeleton } from '../components/ui/Skeleton.jsx'

function ContactPage() {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get('/contact')
        setInfo(res.data)
      } catch (error) {
        console.error('Failed to load contact info', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const name = info?.hospital_name || 'RS Pelita'
  const address =
    info?.address ||
    'Placeholder alamat lengkap rumah sakit. Silakan isi melalui modul Kontak di dashboard admin.'
  const phone = info?.phone || 'Placeholder nomor telepon'
  const email = info?.email || 'placeholder@email.rs'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-12">
      <header className="space-y-2" data-aos="fade-up">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          Kontak Kami
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Hubungi RS Pelita
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 md:text-base">
          Informasi di halaman ini diambil dari pengaturan &quot;Kontak
          Kami&quot; pada dashboard admin sehingga dapat diperbarui sewaktu-
          waktu tanpa mengubah kode.
        </p>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div
          className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
          data-aos="fade-up"
        >
          {loading ? (
            <TextSkeleton lines={5} />
          ) : (
            <>
              <p className="text-md font-semibold text-slate-900">{name}</p>
              <div className="flex items-start gap-3 text-md text-slate-600">
                <MapPin className="h-4 w-4 text-pelitaGreen" />
                <p className="max-w-64">{address}</p>
              </div>
              <div className="flex items-center gap-3 text-md text-slate-600">
                <Phone className="h-4 w-4 text-pelitaGreen" />
                <p>{phone}</p>
              </div>
              <div className="flex items-center gap-3 text-md text-slate-600">
                <Mail className="h-4 w-4 text-pelitaGreen" />
                <p>{email}</p>
              </div>
            </>
          )}
        </div>

        <div
          className="overflow-hidden rounded-2xl bg-slate-100 shadow-inner"
          data-aos="fade-left"
        >
          {/* Placeholder embed peta - admin dapat mengisi iframe map / link di pengaturan */}
          {info?.map_embed ? (
            <div
              className="h-64 md:h-96 w-full"
              dangerouslySetInnerHTML={{ __html: info.map_embed }}
            />
          ) : (
            <div className="flex h-[260px] items-center justify-center px-6 text-center text-xs text-slate-500">
              Placeholder area peta. Admin dapat mengisi embed Google Maps atau
              peta lain lewat pengaturan Kontak.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ContactPage

