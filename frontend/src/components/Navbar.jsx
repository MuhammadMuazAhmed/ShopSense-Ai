import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/predict', label: 'Single Predict' },
    { path: '/bulk', label: 'Bulk Predict' },
  ]

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-white font-bold text-lg">
            ShopSense <span className="text-indigo-400">AI</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">API Online</span>
        </div>
      </div>
    </nav>
  )
}