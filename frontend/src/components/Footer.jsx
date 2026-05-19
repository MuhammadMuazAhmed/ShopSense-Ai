import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-white font-bold text-md">
                ShopSense <span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs">
              Empowering e-commerce businesses with real-time customer behavior predictions and conversion optimization insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home / Dashboard
                </Link>
              </li>
              <li>
                <Link to="/predict" className="text-slate-400 hover:text-white transition-colors">
                  Single Prediction
                </Link>
              </li>
              <li>
                <Link to="/bulk" className="text-slate-400 hover:text-white transition-colors">
                  Bulk CSV Upload
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">System Information</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p>Model: <span className="text-indigo-400">Random Forest Classifier</span></p>
              <p>Accuracy: <span className="text-emerald-400">90.06%</span></p>
              <p>Stack: <span className="text-slate-300">FastAPI + React 19 + Tailwind v4</span></p>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} ShopSense AI. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-default">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-default">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
