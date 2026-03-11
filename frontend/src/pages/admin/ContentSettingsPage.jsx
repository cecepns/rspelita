import { useEffect, useState } from 'react'
import apiClient from '../../lib/apiClient.js'
import { TextSkeleton } from '../../components/ui/Skeleton.jsx'

function ContentSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [home, setHome] = useState({ title: '', subtitle: '' })
  const [about, setAbout] = useState({
    title: '',
    body: '',
    vision_title: '',
    vision_body: '',
    mission_title: '',
    mission_body: '',
    motto_title: '',
    motto_body: '',
  })
  const [contact, setContact] = useState({
    hospital_name: '',
    address: '',
    phone: '',
    email: '',
    whatsapp_number: '',
    map_embed: '',
  })

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [homeRes, aboutRes, contactRes] = await Promise.all([
          apiClient.get('/content/home'),
          apiClient.get('/content/about'),
          apiClient.get('/contact'),
        ])
        setHome({
          title: homeRes.data?.hero?.title || '',
          subtitle: homeRes.data?.hero?.subtitle || '',
        })
        setAbout({
          title: aboutRes.data?.title || '',
          body: aboutRes.data?.body || '',
          vision_title: aboutRes.data?.vision_title || '',
          vision_body: aboutRes.data?.vision_body || '',
          mission_title: aboutRes.data?.mission_title || '',
          mission_body: aboutRes.data?.mission_body || '',
          motto_title: aboutRes.data?.motto_title || '',
          motto_body: aboutRes.data?.motto_body || '',
        })
        setContact({
          hospital_name: contactRes.data?.hospital_name || '',
          address: contactRes.data?.address || '',
          phone: contactRes.data?.phone || '',
          email: contactRes.data?.email || '',
          whatsapp_number: contactRes.data?.whatsapp_number || '',
          map_embed: contactRes.data?.map_embed || '',
        })
      } catch (error) {
        console.error('Failed to load content settings', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await Promise.all([
        apiClient.put('/content/home', {
          hero: { title: home.title, subtitle: home.subtitle },
        }),
        apiClient.put('/content/about', {
          title: about.title,
          body: about.body,
          vision_title: about.vision_title,
          vision_body: about.vision_body,
          mission_title: about.mission_title,
          mission_body: about.mission_body,
          motto_title: about.motto_title,
          motto_body: about.motto_body,
        }),
        apiClient.put('/contact', contact),
      ])
    } catch (error) {
      console.error('Failed to save content settings', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          Pengaturan Konten
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Atur konten utama halaman Home, Tentang Kami, dan Kontak Kami.
        </p>
      </header>

      {loading ? (
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <TextSkeleton lines={8} />
        </div>
      ) : (
        <form
          className="space-y-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
          onSubmit={handleSave}
        >
          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-800">
                Home - Hero Section
              </p>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Judul Utama</label>
                <input
                  type="text"
                  value={home.title}
                  onChange={(e) =>
                    setHome((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-pelitaGreen"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Subjudul</label>
                <textarea
                  rows={3}
                  value={home.subtitle}
                  onChange={(e) =>
                    setHome((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm outline-none focus:border-pelitaGreen"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-800">
                Tentang Kami
              </p>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Judul Halaman</label>
                <input
                  type="text"
                  value={about.title}
                  onChange={(e) =>
                    setAbout((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-pelitaGreen"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Isi Konten</label>
                <textarea
                  rows={5}
                  value={about.body}
                  onChange={(e) =>
                    setAbout((prev) => ({ ...prev, body: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm outline-none focus:border-pelitaGreen"
                />
              </div>
              <div className="mt-2 space-y-2 rounded-lg bg-slate-50 p-3">
                <p className="text-[11px] font-semibold text-slate-700">
                  Kartu Visi, Misi, Motto (halaman Tentang Kami)
                </p>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-600">Judul Visi</label>
                    <input
                      type="text"
                      value={about.vision_title}
                      onChange={(e) =>
                        setAbout((prev) => ({ ...prev, vision_title: e.target.value }))
                      }
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs outline-none focus:border-pelitaGreen"
                    />
                    <textarea
                      rows={3}
                      value={about.vision_body}
                      onChange={(e) =>
                        setAbout((prev) => ({ ...prev, vision_body: e.target.value }))
                      }
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-pelitaGreen"
                      placeholder="Isi visi singkat rumah sakit"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-600">Judul Misi</label>
                    <input
                      type="text"
                      value={about.mission_title}
                      onChange={(e) =>
                        setAbout((prev) => ({ ...prev, mission_title: e.target.value }))
                      }
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs outline-none focus:border-pelitaGreen"
                    />
                    <textarea
                      rows={3}
                      value={about.mission_body}
                      onChange={(e) =>
                        setAbout((prev) => ({ ...prev, mission_body: e.target.value }))
                      }
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-pelitaGreen"
                      placeholder="Isi misi singkat rumah sakit"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-600">Judul Motto</label>
                    <input
                      type="text"
                      value={about.motto_title}
                      onChange={(e) =>
                        setAbout((prev) => ({ ...prev, motto_title: e.target.value }))
                      }
                      className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs outline-none focus:border-pelitaGreen"
                    />
                    <textarea
                      rows={3}
                      value={about.motto_body}
                      onChange={(e) =>
                        setAbout((prev) => ({ ...prev, motto_body: e.target.value }))
                      }
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-pelitaGreen"
                      placeholder="Isi motto singkat rumah sakit"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs font-semibold text-slate-800">Kontak Kami</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Nama Rumah Sakit</label>
                <input
                  type="text"
                  value={contact.hospital_name}
                  onChange={(e) =>
                    setContact((prev) => ({
                      ...prev,
                      hospital_name: e.target.value,
                    }))
                  }
                  className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-pelitaGreen"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">
                  Nomor Telepon Utama (Emergency)
                </label>
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-pelitaGreen"
                  placeholder="Contoh: 0822-8826-7688"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-pelitaGreen"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">
                  Nomor WhatsApp (Floating Button)
                </label>
                <input
                  type="text"
                  value={contact.whatsapp_number}
                  onChange={(e) =>
                    setContact((prev) => ({
                      ...prev,
                      whatsapp_number: e.target.value,
                    }))
                  }
                  className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-sm outline-none focus:border-pelitaGreen"
                  placeholder="Contoh: 0822-8826-7688"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Alamat Lengkap</label>
                <textarea
                  rows={3}
                  value={contact.address}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm outline-none focus:border-pelitaGreen"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600">
                Embed Peta (iframe HTML)
              </label>
              <textarea
                rows={3}
                value={contact.map_embed}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, map_embed: e.target.value }))
                }
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-pelitaGreen"
                placeholder="<iframe src='...'></iframe>"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-pelitaGreen px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Menyimpan perubahan...' : 'Simpan Semua Perubahan'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ContentSettingsPage

