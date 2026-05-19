export default function StatCard({ title, value, subtitle, color = 'indigo' }) {
  const colors = {
    indigo: 'border-indigo-500 bg-indigo-500/10',
    green: 'border-green-500 bg-green-500/10',
    red: 'border-red-500 bg-red-500/10',
    yellow: 'border-yellow-500 bg-yellow-500/10',
  }

  return (
    <div className={`border rounded-xl p-6 ${colors[color]}`}>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
    </div>
  )
}