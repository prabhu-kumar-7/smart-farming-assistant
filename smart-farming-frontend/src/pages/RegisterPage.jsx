import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function RegisterPage() {
  const { t }     = useLanguage()
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: ''
  })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [showPass, setShowPass] = useState(false)

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirmPassword) {
      setError(t.passwordMismatch)
      return
    }
    setLoading(true)
    try {
      const res = await API.post('/auth/register', {
        fullName: form.fullName,
        email:    form.email,
        password: form.password,
      })
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || t.registerError)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: '#263028',
    border: '1px solid #3a4a3c',
    color: '#f0ede6',
  }

  const labelStyle = { color: '#9aab8c' }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"

  return (
    <div className="min-h-screen flex" style={{ background: '#2c3a2e' }}>

      {/* ── Left Panel ── */}
      <div
        className="w-full md:w-[420px] min-h-screen flex flex-col
          justify-between px-8 py-10 relative overflow-hidden"
        style={{ background: '#1e2d20' }}
      >
        {/* Topo pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='800'%3E%3Cpath d='M-50 100 Q100 60 250 100 Q400 140 550 100' stroke='%238fbc5a' stroke-width='1.5' fill='none'/%3E%3Cpath d='M-50 200 Q100 160 250 200 Q400 240 550 200' stroke='%238fbc5a' stroke-width='1' fill='none'/%3E%3Cpath d='M-50 300 Q100 260 250 300 Q400 340 550 300' stroke='%238fbc5a' stroke-width='1.5' fill='none'/%3E%3Cpath d='M-50 400 Q100 360 250 400 Q400 440 550 400' stroke='%238fbc5a' stroke-width='1' fill='none'/%3E%3Cpath d='M-50 500 Q100 460 250 500 Q400 540 550 500' stroke='%238fbc5a' stroke-width='1.5' fill='none'/%3E%3Cpath d='M-50 600 Q100 560 250 600 Q400 640 550 600' stroke='%238fbc5a' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10">

          {/* Badge */}
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

          {/* Heading */}
          <div className="mb-6">
            <h1
              className="text-3xl font-bold mb-1"
              style={{ color: '#f0ede6' }}
            >
              {t.registerTitle}
            </h1>
            <p className="text-sm" style={{ color: '#9aab8c' }}>
              {t.registerSubtitle}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="p-3 rounded-xl text-sm mb-4 border"
              style={{
                background: 'rgba(232,93,38,0.15)',
                borderColor: '#e85d26',
                color: '#e85d26'
              }}
            >
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label
                className="text-xs font-medium block mb-1.5"
                style={labelStyle}
              >
                {t.fullNameLabel}
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Ravi Kumar"
                className={inputClass}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#e85d26')}
                onBlur={e  => (e.target.style.borderColor = '#3a4a3c')}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="text-xs font-medium block mb-1.5"
                style={labelStyle}
              >
                {t.emailLabel}
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="ravi@farm.com"
                className={inputClass}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#e85d26')}
                onBlur={e  => (e.target.style.borderColor = '#3a4a3c')}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="text-xs font-medium block mb-1.5"
                style={labelStyle}
              >
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  className={`${inputClass} pr-10`}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#e85d26')}
                  onBlur={e  => (e.target.style.borderColor = '#3a4a3c')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#9aab8c' }}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="text-xs font-medium block mb-1.5"
                style={labelStyle}
              >
                {t.confirmPassword}
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={inputClass}
                style={{
                  ...inputStyle,
                  borderColor: form.confirmPassword
                    ? form.password === form.confirmPassword
                      ? '#8fbc5a'
                      : '#e85d26'
                    : '#3a4a3c'
                }}
              />
              {form.confirmPassword && (
                <p
                  className="text-xs mt-1"
                  style={{
                    color: form.password === form.confirmPassword
                      ? '#8fbc5a'
                      : '#e85d26'
                  }}
                >
                  {form.password === form.confirmPassword
                    ? '✓ Passwords match'
                    : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-semibold
                text-sm transition-all disabled:opacity-50 mt-2"
              style={{ background: '#e85d26', color: 'white' }}
              onMouseOver={e => (e.currentTarget.style.background = '#d04e1a')}
              onMouseOut={e  => (e.currentTarget.style.background = '#e85d26')}
            >
              {loading ? t.registering2 : t.registerBtn2}
            </button>
          </form>
        </div>

        {/* Bottom login link */}
        <div className="relative z-10 text-center">
          <p className="text-sm" style={{ color: '#9aab8c' }}>
            {t.hasAccount}{' '}
            <Link
              to="/login"
              className="font-semibold"
              style={{ color: '#e85d26' }}
            >
              ↗ {t.signIn}
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right Panel — Farm Photo ── */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80')`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(30,45,32,0.55)' }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Cpath d='M-100 200 Q200 150 400 200 Q600 250 900 200' stroke='%238fbc5a' stroke-width='2' fill='none'/%3E%3Cpath d='M-100 350 Q200 300 400 350 Q600 400 900 350' stroke='%238fbc5a' stroke-width='1.5' fill='none'/%3E%3Cpath d='M-100 500 Q200 450 400 500 Q600 550 900 500' stroke='%238fbc5a' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center
          justify-center w-full">
          <span
            className="text-white text-sm font-bold px-4 py-1.5
              rounded-full mb-3"
            style={{ background: '#e85d26' }}
          >
            setup
          </span>
          <span className="text-white text-5xl font-bold drop-shadow-lg">
            SmartFarm
          </span>
          <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Grow Smarter with AI
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage