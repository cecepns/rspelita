import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import apiClient from '../../lib/apiClient.js'

function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiClient.post('/auth/login', { email, password })
      localStorage.setItem('rs-pelita-token', res.data.token)
      navigate('/admin', { replace: true })
    } catch (err) {
      console.error(err)
      setError(
        err?.response?.data?.message ||
          'Login gagal. Periksa kembali email dan password.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-100">
        <div className="mb-6 text-center">
          <img
            src="/logo.png"
            alt="RS Pelita"
            className="mx-auto h-12 w-auto"
          />
          <h1 className="mt-3 text-lg font-semibold text-slate-900">
            Login Admin RS Pelita
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Gunakan kredensial admin yang dikonfigurasi di server Express.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-medium text-slate-700">
              Email
            </label>
            <div className="mt-1 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ml-2 h-9 w-full border-none bg-transparent text-sm outline-none"
                placeholder="admin@rspelita.co.id"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              Password
            </label>
            <div className="mt-1 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ml-2 h-9 w-full border-none bg-transparent text-sm outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-9 w-full items-center justify-center rounded-lg bg-pelitaGreen text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk sebagai Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage

