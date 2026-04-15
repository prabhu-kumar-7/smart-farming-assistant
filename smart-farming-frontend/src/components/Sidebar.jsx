import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaLeaf, FaGlobe } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

const flags = {
  english: '🇬🇧',
  tamil:   '🇮🇳',
  french:  '🇫🇷',
}

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { language, setLanguage, t } = useLanguage()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { path: '/',          icon: '📊' },
    { path: '/farm',      icon: '🌾' },
    { path: '/weather',   icon: '🌤️' },
    { path: '/recommend', icon: '⭐' },
    { path: '/chat',      icon: '💬' },
  ]

  return (
    <aside
      style={{ backgroundColor: '#1e2d20', borderRight: '1px solid #3a4a3c' }}
      className="w-16 flex flex-col py-6 px-2 shrink-0 relative"
    >
      {/* Topo texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='800'%3E%3Cpath d='M0 100 Q50 80 100 100 Q150 120 200 100' stroke='%238fbc5a' stroke-width='1' fill='none'/%3E%3Cpath d='M0 200 Q50 180 100 200 Q150 220 200 200' stroke='%238fbc5a' stroke-width='1' fill='none'/%3E%3Cpath d='M0 300 Q50 280 100 300 Q150 320 200 300' stroke='%238fbc5a' stroke-width='1' fill='none'/%3E%3Cpath d='M0 400 Q50 380 100 400 Q150 420 200 400' stroke='%238fbc5a' stroke-width='1' fill='none'/%3E%3Cpath d='M0 500 Q50 480 100 500 Q150 520 200 500' stroke='%238fbc5a' stroke-width='1' fill='none'/%3E%3Cpath d='M0 600 Q50 580 100 600 Q150 620 200 600' stroke='%238fbc5a' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Logo */}
      <div className="flex flex-col items-center gap-1 mb-8 relative z-10">
        <div className="bg-[#e85d26] p-2 rounded-lg">
          <FaLeaf className="text-white text-sm" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 relative z-10">
        {navLinks.map((link, index) => {
          const isActive = location.pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center justify-center w-full py-3 rounded-lg
                transition-all group relative ${
                  isActive ? 'bg-[#263028]' : 'hover:bg-[#263028]/50'
                }`}
              title={t[Object.keys(t).find(key => t[key] === navLinks[index].label)] || link.path}
            >
              <span className="text-lg">{link.icon}</span>
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r"
                  style={{ backgroundColor: '#e85d26' }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-2 relative z-10">
        {/* Language Switcher */}
        <div className="relative group">
          <button
            className="flex items-center justify-center w-full py-2 rounded-lg
              hover:bg-[#263028]/50 transition-all"
            title={`Language: ${language}`}
          >
            <FaGlobe className="text-[#9aab8c] text-sm" />
          </button>
          {/* Tooltip/Dropdown */}
          <div className="absolute left-full ml-2 top-0 hidden group-hover:flex
            bg-[#263028] border border-[#3a4a3c] rounded-lg p-1 shadow-lg z-20">
            {Object.keys(flags).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded text-sm transition-all ${
                  language === lang ? 'bg-[#e85d26] text-white' : 'text-[#9aab8c] hover:bg-[#3a4a3c]'
                }`}
              >
                {flags[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full py-2 rounded-lg
            hover:bg-[#263028]/50 transition-all text-[#9aab8c]"
          title={t.logoutBtn}
        >
          🚪
        </button>
      </div>
    </aside>
  )
}
export default Sidebar