import { useState } from 'react'
import { predictSingle } from '../utils/api'
import ResultCard from '../components/ResultCard'
import LoadingSpinner from '../components/LoadingSpinner'

const MONTHS = ['Jan','Feb','Mar','Apr','May','June','Jul','Aug','Sep','Oct','Nov','Dec']
const VISITOR_TYPES = ['Returning_Visitor', 'New_Visitor', 'Other']

const defaultForm = {
  Administrative: 0,
  Administrative_Duration: 0,
  Informational: 0,
  Informational_Duration: 0,
  ProductRelated: 5,
  ProductRelated_Duration: 300,
  BounceRates: 0.02,
  ExitRates: 0.03,
  PageValues: 15,
  SpecialDay: 0,
  Month: 'Nov',
  OperatingSystems: 2,
  Browser: 2,
  Region: 1,
  TrafficType: 2,
  VisitorType: 'Returning_Visitor',
  Weekend: false,
}

export default function Predict() {
  const [form, setForm] = useState(defaultForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked
            : ['Administrative','Informational','ProductRelated',
               'OperatingSystems','Browser','Region','TrafficType'].includes(name)
            ? parseInt(value)
            : ['BounceRates','ExitRates','PageValues','SpecialDay',
               'Administrative_Duration','Informational_Duration',
               'ProductRelated_Duration'].includes(name)
            ? parseFloat(value)
            : value
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await predictSingle(form)
      setResult(data)
    } catch (err) {
      setError('Prediction failed. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, type = 'number', min, max, step }) => (
    <div>
      <label className="text-slate-400 text-xs mb-1 block">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        min={min} max={max} step={step}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 
                   text-white text-sm focus:outline-none focus:border-indigo-500"
      />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Single Customer Prediction</h1>
        <p className="text-slate-400 mt-2">
          Enter session data to predict if a customer will purchase
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-lg mb-4">
            📋 Session Data
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Administrative Pages" name="Administrative" min={0} />
            <Field label="Admin Duration (sec)" name="Administrative_Duration" step={0.1} />
            <Field label="Informational Pages" name="Informational" min={0} />
            <Field label="Info Duration (sec)" name="Informational_Duration" step={0.1} />
            <Field label="Product Pages" name="ProductRelated" min={0} />
            <Field label="Product Duration (sec)" name="ProductRelated_Duration" step={0.1} />
            <Field label="Bounce Rate" name="BounceRates" min={0} max={1} step={0.001} />
            <Field label="Exit Rate" name="ExitRates" min={0} max={1} step={0.001} />
            <Field label="Page Value" name="PageValues" min={0} step={0.1} />
            <Field label="Special Day (0-1)" name="SpecialDay" min={0} max={1} step={0.1} />
            <Field label="OS" name="OperatingSystems" min={1} max={8} />
            <Field label="Browser" name="Browser" min={1} max={13} />
            <Field label="Region" name="Region" min={1} max={9} />
            <Field label="Traffic Type" name="TrafficType" min={1} max={20} />
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Month</label>
              <select name="Month" value={form.Month} onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg 
                           px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Visitor Type</label>
              <select name="VisitorType" value={form.VisitorType} onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg 
                           px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                {VISITOR_TYPES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* Weekend checkbox */}
          <div className="flex items-center gap-3">
            <input type="checkbox" name="Weekend" checked={form.Weekend}
              onChange={handleChange}
              className="w-4 h-4 accent-indigo-600" />
            <label className="text-slate-300 text-sm">Weekend Session</label>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 
                       text-white py-3 rounded-xl font-semibold transition-all mt-4">
            {loading ? 'Analyzing...' : '🔍 Predict Purchase Intent'}
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 
                           text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        <div>
          {loading && <LoadingSpinner text="Analyzing customer behavior..." />}
          {result && <ResultCard result={result} />}
          {!loading && !result && (
            <div className="bg-slate-800 border border-slate-700 border-dashed 
                           rounded-xl p-12 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-slate-400">
                Fill in the form and click predict to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}