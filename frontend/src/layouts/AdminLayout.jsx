import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FileText, Home, LayoutDashboard, LogOut, Settings, Stethoscope, Users } from 'lucide-react'
import { useEffect } from 'react'

const adminNav = [
  { to: '/admin', label: 'Ringkasan', icon: LayoutDashboard, end: true },
  { to: '/admin/fasilitas', label: 'Fasilitas Layanan', icon: Stethoscope },
  { to: '/admin/dokter', label: 'Jadwal Dokter', icon: Users },
  { to: '/admin/berita', label: 'Berita', icon: FileText },
  { to: '/admin/konten', label: 'Pengaturan Konten', icon: Settings },
]

function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('rs-pelita-token')
    if (!token) {
      navigate('/admin/login', { replace: true })
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('rs-pelita-token')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 hidden w-64 border-r border-slate-200 bg-white/90 px-4 py-5 shadow-sm sm:flex sm:flex-col">
        <div className="mb-6 flex items-center gap-3 px-2">
          <img src="/logo.png" alt="RS Pelita" className="h-8 w-auto" />
          <div>
            <p className="text-xs font-semibold tracking-wide text-pelitaGreen">
              RS PELITA
            </p>
            <p className="text-[11px] text-slate-500">Admin Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 text-sm">
          {adminNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 transition ${
                    isActive
                      ? 'bg-pelitaGreen text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
          <NavLink
            to="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-slate-600 hover:bg-slate-100"
          >
            <Home className="h-4 w-4" />
            <span>Lihat Website</span>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col sm:ml-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold text-slate-800">
              RS Pelita CMS
            </h1>
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              Admin aktif
            </p>
          </div>
        </header>

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

