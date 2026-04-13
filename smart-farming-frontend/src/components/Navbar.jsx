import { Link, useLocation } from 'react-router-dom'
import { FaLeaf } from 'react-icons/fa'

// Nav links config — easy to add more later
const navLinks = [
  { path: '/',          label: 'Dashboard' },
  { path: '/farm',      label: 'My Farm'   },
  { path: '/weather',   label: 'Weather'   },
  { path: '/recommend', label: 'Advice'    },
  { path: '/chat',      label: 'AI Chat'   },
]

function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-2 text-xl font-bold">
        <FaLeaf className="text-green-300" />
        <span>Smart Farm</span>
      </div>

      {/* Nav Links */}
      <div className="flex gap-6">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium hover:text-green-300 transition-colors
              ${location.pathname === link.path
                ? 'text-green-300 underline underline-offset-4'
                : 'text-white'
              }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navbar