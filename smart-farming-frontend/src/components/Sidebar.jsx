import { Link, useLocation } from 'react-router-dom'
import { FaLeaf, FaGlobe } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const flags = {
  english: '🇬🇧',
  tamil:   '🇮🇳',
  french:  '🇫🇷',
}

function Sidebar() {
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()

  const navLinks = [
    { path: '/',          label: t.dashboard },
    { path: '/farm',      label: t.myFarm    },
    { path: '/weather',   label: t.weather   },
    { path: '/recommend', label: t.advice    },
    { path: '/chat',      label: t.aiChat    },
  ]

  const icons = ['📊', '🌾', '🌤️', '⭐', '💬']

  return (
    <aside
      style={{ backgroundColor: '#0d1f17', borderRight: '1px solid #1a3a2a' }}
      className="w-56 flex flex-col py-6 px-4 shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="bg-green-600 p-2 rounded-lg">
          <FaLeaf className="text-white text-sm" />
        </div>
        <div>
          <p className="font-bold text-white text-sm">{t.appName}</p>
          <p style={{ fontSize: '10px' }} className="text-green-400">
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1">
        {navLinks.map((link, i) => {
          const isActive = location.pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                backgroundColor: isActive ? '#15803d' : 'transparent',
                color: isActive ? '#ffffff' : '#9ca3af',
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-all duration-200 hover:bg-green-900"
            >
              <span>{icons[i]}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* ── Language Selector ── */}
      <div className="mt-8 px-1">
        <div className="flex items-center gap-2 mb-2">
          <FaGlobe className="text-green-500 text-xs" />
          <p className="text-gray-400 text-xs uppercase tracking-wider">
            Language
          </p>
        </div>

        {/* Language Buttons */}
        <div className="flex flex-col gap-1">
          {['english', 'tamil', 'french'].map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                backgroundColor: language === lang ? '#14532d' : 'transparent',
                border: language === lang
                  ? '1px solid #16a34a'
                  : '1px solid #1a3a2a',
                color: language === lang ? '#4ade80' : '#6b7280',
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                text-xs font-medium transition-all duration-200 hover:bg-green-900"
            >
              <span>{flags[lang]}</span>
              <span className="capitalize">{lang}</span>
              {language === lang && (
                <span className="ml-auto text-green-500">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-auto px-2">
        <p style={{ fontSize: '10px' }} className="text-gray-600">
          {t.version}
        </p>
        <p style={{ fontSize: '10px' }} className="text-gray-600">
          {t.platform}
        </p>
      </div>
    </aside>
  )
}

export default Sidebar