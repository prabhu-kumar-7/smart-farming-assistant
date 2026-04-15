import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function LoginPage() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await API.post('/auth/login', form)
      login(res.data)
      navigate('/')
    } catch {
      setError(t.loginError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#2c3a2e' }}>

      {/* LEFT PANEL */}
      <div
        className="w-full md:w-[420px] min-h-screen flex flex-col justify-between px-8 py-10 relative"
        style={{ background: '#1e2d20' }}
      >
        <div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-10">
            <span
              className="text-white text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: '#e85d26' }}
            >
              setup
            </span>
            <span className="text-white text-2xl font-bold">
              SmartFarm
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2 text-[#f0ede6]">
            {t.loginTitle}
          </h1>
          <p className="text-sm mb-6 text-[#9aab8c]">
            {t.loginSubtitle}
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm border text-red-400 border-red-500 bg-red-900/20">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-xs text-[#9aab8c] block mb-1">
                {t.emailLabel}
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-xl bg-[#263028] border border-[#3a4a3c] text-[#f0ede6] outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-[#9aab8c] block mb-1">
                {t.passwordLabel}
              </label>

              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-[#263028] border border-[#3a4a3c] text-[#f0ede6] outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="text-right mt-1">
                <button
                  type="button"
                  className="text-xs text-[#9aab8c]"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-semibold text-white bg-[#e85d26] hover:bg-[#d04e1a] transition disabled:opacity-50"
            >
              {loading ? t.loggingIn : t.loginBtn}
            </button>
          </form>
        </div>

        {/* Bottom */}
        <p className="text-center text-sm text-[#9aab8c]">
          {t.noAccount}{' '}
          <Link to="/register" className="text-[#e85d26] font-semibold">
            {t.signUp}
          </Link>
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden md:flex flex-1 relative">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full text-center text-white">
          <span className="bg-[#e85d26] px-4 py-1 rounded-full text-sm mb-3">
            setup
          </span>
          <h2 className="text-5xl font-bold">SmartFarm</h2>
          <p className="text-white/70 mt-2 text-sm">
            AI-Powered Agricultural Assistant
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage