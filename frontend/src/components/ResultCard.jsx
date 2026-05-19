export default function ResultCard({ result }) {
  if (!result) return null

  const willBuy = result.will_purchase
  const prob = result.probability
  const risk = result.risk

  const colorMap = {
    green: 'text-green-400 border-green-500 bg-green-500/10',
    yellow: 'text-yellow-400 border-yellow-500 bg-yellow-500/10',
    orange: 'text-orange-400 border-orange-500 bg-orange-500/10',
    red: 'text-red-400 border-red-500 bg-red-500/10',
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-6">

      {/* Main Result */}
      <div className={`text-center p-6 rounded-xl border-2 ${
        willBuy
          ? 'border-green-500 bg-green-500/10'
          : 'border-red-500 bg-red-500/10'
      }`}>
        <div className="text-5xl mb-3">{willBuy ? '✅' : '❌'}</div>
        <h2 className={`text-2xl font-bold ${
          willBuy ? 'text-green-400' : 'text-red-400'
        }`}>
          {result.summary}
        </h2>
        <p className="text-slate-400 mt-2">
          Purchase Probability: <span className="text-white font-bold">{prob}%</span>
        </p>
      </div>

      {/* Probability Bar */}
      <div>
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Abandon</span>
          <span>Purchase</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-700 ${
              willBuy ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${prob}%` }}
          ></div>
        </div>
        <p className="text-center text-slate-400 text-sm mt-2">{prob}% likelihood</p>
      </div>

      {/* Risk Level */}
      <div className={`border rounded-xl p-4 ${colorMap[risk.color]}`}>
        <p className="text-sm font-medium">
          Risk Level: <span className="font-bold">{risk.level}</span>
        </p>
        <p className="text-sm mt-1 opacity-80">{risk.message}</p>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-white font-semibold mb-3">
          💡 Recommendations
        </h3>
        <div className="space-y-2">
          {result.recommendations.map((tip, i) => (
            <div key={i} className="bg-slate-700/50 rounded-lg px-4 py-3 text-sm text-slate-300">
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}