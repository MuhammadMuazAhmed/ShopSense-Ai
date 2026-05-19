import { useState, useCallback } from 'react'
import { predictBulk } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard from '../components/StateCard'

export default function BulkPredict() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.name.endsWith('.csv')) setFile(dropped)
    else setError('Please upload a CSV file')
  }, [])

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await predictBulk(file)
      setResult(data)
    } catch (err) {
      setError('Upload failed. Make sure backend is running and CSV format is correct.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Bulk Customer Prediction</h1>
        <p className="text-slate-400 mt-2">
          Upload a CSV file to predict purchase intent for multiple customers at once
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all mb-6 ${
          dragging
            ? 'border-indigo-400 bg-indigo-500/10'
            : 'border-slate-600 bg-slate-800'
        }`}
      >
        <p className="text-4xl mb-4">📂</p>
        <p className="text-white font-semibold mb-2">
          Drag & drop your CSV file here
        </p>
        <p className="text-slate-400 text-sm mb-4">or</p>
        <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 
                          rounded-lg cursor-pointer font-medium transition-all">
          Browse File
          <input type="file" accept=".csv" className="hidden"
            onChange={(e) => setFile(e.target.files[0])} />
        </label>

        {file && (
          <div className="mt-4 bg-slate-700 rounded-lg px-4 py-2 inline-block">
            <span className="text-green-400 text-sm">✅ {file.name}</span>
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
        <p className="text-slate-400 text-sm">
          💡 <strong className="text-white">Tip:</strong> Use the same CSV format as the
          dataset — just remove the Revenue column before uploading.
          You can use the original dataset file to test this feature.
        </p>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={!file || loading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 
                   text-white px-8 py-3 rounded-xl font-semibold transition-all mb-8">
        {loading ? 'Processing...' : '🚀 Analyze All Customers'}
      </button>

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 
                       text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner text="Analyzing all customers..." />}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Customers" value={result.total_customers} color="indigo" />
            <StatCard title="Will Purchase" value={result.will_purchase} color="green" />
            <StatCard title="Will Abandon" value={result.will_abandon} color="red" />
            <StatCard title="Conversion Rate"
              value={`${result.conversion_rate}%`} color="yellow" />
          </div>

          {/* Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">
                Prediction Results ({result.total_customers} customers)
              </h3>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-slate-700 sticky top-0">
                  <tr>
                    {['Row', 'Prediction', 'Probability', 'Risk Level', 'Message'].map(h => (
                      <th key={h} className="text-left text-slate-300 px-4 py-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.results.map((row, i) => (
                    <tr key={i} className="border-t border-slate-700 hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-slate-400">{row.row}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${
                          row.will_purchase ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {row.will_purchase ? '✅ Purchase' : '❌ Abandon'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{row.probability}%</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.risk_level === 'High' ? 'bg-green-500/20 text-green-400' :
                          row.risk_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          row.risk_level === 'Low' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {row.risk_level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{row.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}