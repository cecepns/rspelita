import { useEffect, useState } from 'react'
import {
  Activity,
  Ambulance,
  CalendarHeart,
  CheckCircle2,
  Heart,
  Play,
  Stethoscope,
} from 'lucide-react'
import apiClient from '../lib/apiClient.js'
import Skeleton, { CardSkeleton, TextSkeleton } from '../components/ui/Skeleton.jsx'
// Gambar default tidak lagi hardcoded dari aset lokal.
// Hero dan banner diambil dari pengaturan konten (admin).

function HomePage() {
  const [content, setContent] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [contentRes, doctorsRes] = await Promise.all([
          apiClient.get('/content/home'),
          apiClient.get('/doctors'),
        ])
        setContent(contentRes.data)
        setDoctors(doctorsRes.data.items || [])
      } catch (error) {
        console.error('Failed to load home content', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const hero = content?.hero || {
    title: 'RS Pelita',
    subtitle: 'Kami menyediakan layanan kesehatan yang responsif dan fungsional untuk pasien di seluruh wilayah.',
  }

  const heroBannerImage = content?.hero?.hero_banner_image || null
  const heroFeatureImage = content?.hero?.hero_feature_image || null

  const stats = content?.stats || [
    { label: 'Dokter Spesialis', value: '20+' },
    { label: 'Kamar Tidur', value: '50+' },
    { label: 'Pelayanan 24 Jam', value: 'IGD & ICU' },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-emerald-50 via-white to-sky-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-12 md:flex-row lg:px-6 lg:py-16">
          <div
            className="flex-1 space-y-6"
            data-aos="fade-right"
            data-aos-delay="50"
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-pelitaGreen shadow-sm ring-1 ring-emerald-100">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Rumah Sakit Pilihan Keluarga
            </p>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-3/4" />
                <TextSkeleton lines={3} />
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                  {hero.title}
                </h1>
                <p className="max-w-xl text-base text-slate-600 md:text-lg">
                  {hero.subtitle}
                </p>
              </>
            )}

            <div className="grid gap-4 text-sm md:grid-cols-3 md:text-base">
              {stats.map((item, index) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-emerald-100 bg-white/80 p-4 shadow-sm"
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 80}
                >
                  <p className="font-medium text-emerald-600">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-slate-900 md:text-2xl">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex flex-1 justify-center"
            data-aos="fade-left"
            data-aos-delay="100"
          >
            <div className="relative h-full w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-emerald-50">
              {/* Placeholder background ketika belum ada gambar atau masih loading */}
              <div className="absolute inset-0 bg-gradient-to-br from-pelitaGreen/90 via-emerald-500 to-pelitaRed/80 opacity-90" />
              {heroBannerImage && !loading && (
                <img
                  src={heroBannerImage}
                  alt="RS Pelita"
                  className="relative h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 lg:px-6 lg:py-12">
          <div className="flex items-start gap-4" data-aos="fade-up">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-pelitaGreen">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800 md:text-lg">
                Pelayanan Komprehensif
              </p>
              <p className="mt-1 text-sm text-slate-600 md:text-base">
                Layanan unggulan dengan tim medis dan fasilitas lengkap.
              </p>
            </div>
          </div>
          <div
            className="flex items-start gap-4"
            data-aos="fade-up"
            data-aos-delay="80"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              <CalendarHeart className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800 md:text-lg">
                Registrasi Mudah
              </p>
              <p className="mt-1 text-sm text-slate-600 md:text-base">
                Pendaftaran online dan offline untuk kenyamanan Anda.
              </p>
            </div>
          </div>
          <div
            className="flex items-start gap-4"
            data-aos="fade-up"
            data-aos-delay="120"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800 md:text-lg">
                Siaga 24 Jam
              </p>
              <p className="mt-1 text-sm text-slate-600 md:text-base">
                IGD dan layanan gawat darurat siap melayani kapan saja.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div
            className="overflow-hidden rounded-3xl bg-white shadow-lg"
            data-aos="fade-up"
          >
            <div className="grid md:grid-cols-[1fr_1fr]">
              <div className="relative aspect-[4/3] min-h-[280px] md:aspect-auto md:min-h-[400px]">
                {/* Placeholder background ketika belum ada gambar atau masih loading */}
                <div className="absolute inset-0 bg-slate-200" />
                {heroFeatureImage && !loading && (
                  <img
                    src={heroFeatureImage}
                    alt="RS Pelita"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>

              <div className="flex flex-col justify-center p-8 lg:p-12">
                <h2 className="text-2xl font-bold text-pelitaGreen md:text-3xl lg:text-4xl">
                  Kenapa Harus Memilih RS Pelita?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
                  Memilih rumah sakit yang tepat untuk kesehatan Anda dan keluarga
                  merupakan keputusan yang sangat penting. Secara letak geografis
                  dan nilai ekonomis RS Pelita sangat potensial untuk berkembang,
                  didukung tokoh masyarakat dan Pemda Kampar. Pelita Hati sudah
                  melekat di hati masyarakat.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex gap-4" data-aos="fade-up" data-aos-delay="50">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-pelitaGreen">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                        Pelayanan Terbaik
                      </h3>
                      <p className="mt-1 text-base text-slate-600">
                        Dokter spesialis profesional (Obgyn, Anak, Bedah Umum,
                        Penyakit Dalam, Orthopedi, Anestesi, Mata, Pathology
                        Klinik) sesuai standar RS Tipe C.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-pelitaGreen">
                      <Ambulance className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                        Cepat Tanggap
                      </h3>
                      <p className="mt-1 text-base text-slate-600">
                        IGD, OK, ICU/HCU, Hemodialisa, Perinatologi,
                        Laboratorium, Radiologi—fasilitas lengkap standar Tipe C.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4" data-aos="fade-up" data-aos-delay="150">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-pelitaGreen">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                        Terakreditasi
                      </h3>
                      <p className="mt-1 text-base text-slate-600">
                        Fasilitas dan pelayanan sesuai standar Rumah Sakit Tipe C
                        untuk keamanan dan kenyamanan pasien.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div
            className="flex items-center justify-between gap-4"
            data-aos="fade-up"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl lg:text-3xl">
                Jadwal Dokter
              </h2>
              <p className="mt-2 text-sm text-slate-600 md:text-base">
                Jadwal praktek dokter Senin–Sabtu. Data dari modul Jadwal
                &amp; Praktek Dokter di admin.
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm" data-aos="fade-up">
            {loading ? (
              <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            ) : doctors.length === 0 ? (
              <p className="p-8 text-center text-slate-500">
                Belum ada data jadwal dokter.
              </p>
            ) : (
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="w-12 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600 md:w-14">
                      #
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-800 md:text-base">
                      Dokter
                    </th>
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(
                      (day) => (
                        <th
                          key={day}
                          className="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600 md:px-4 md:text-sm"
                        >
                          {day}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor, index) => (
                    <tr
                      key={doctor.id}
                      className={`border-b border-slate-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="px-3 py-3 text-center text-sm text-slate-500 md:w-14">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100 md:h-16 md:w-16">
                            {doctor.image ? (
                              <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                —
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 md:text-base">
                              {doctor.name}
                            </p>
                            <p className="text-sm text-emerald-600">
                              {doctor.specialty || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      {[
                        'schedule_senin',
                        'schedule_selasa',
                        'schedule_rabu',
                        'schedule_kamis',
                        'schedule_jumat',
                        'schedule_sabtu',
                      ].map((key) => (
                        <td
                          key={key}
                          className="whitespace-nowrap px-3 py-3 text-center text-sm text-slate-700 md:px-4"
                        >
                          {doctor[key]?.trim()
                            ? doctor[key]
                            : 'Tidak Praktek'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage

