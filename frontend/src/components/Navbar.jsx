import { Link, useLocation } from 'react-router-dom'
import { useAuth }           from '../context/AuthContext'

const navLinks = [
  { to: '/',                 label: 'Dashboard' },
  { to: '/members',          label: 'Members'   },
  { to: '/add-member',       label: '+ Add Member' },
  { to: '/mentor-dashboard', label: 'Mentors'   },
]

function Navbar() {
  const { user, logout } = useAuth()
  const location         = useLocation()

  return (
    <nav className="bg-warm-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">🙏</span>
          <div>
            <p className="text-white font-bold text-base leading-none m-0">
              Faith Follower
            </p>
            <p className="text-warm-300 text-xs leading-none m-0">
              Tracker
            </p>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-200 no-underline
                  ${isActive
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-warm-200 hover:bg-warm-700 hover:text-white'
                  }
                `}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* User Info + Logout */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white text-sm font-semibold m-0 leading-none">
              {user?.name}
            </p>
            <p className="text-warm-300 text-xs m-0 leading-none capitalize mt-1">
              {user?.role}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={logout}
            className="text-warm-300 hover:text-white text-sm
                       px-3 py-1.5 rounded-lg hover:bg-warm-700
                       transition-all duration-200 border border-warm-600"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar