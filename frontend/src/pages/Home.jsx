import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkHealth } from '../utils/api'
import StatCard from '../components/StateCard'

export default function Home() {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    checkHealth()
      .then(data => setHealth(data))
      .catch(() => setHealth(null))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-indigo-600/20 border 
                        border-indigo-500/30 rounded-full px-4 py-2 mb-6">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          <span className="text-indigo-400 text-sm">
            Powered by Random Forest · 90% Accuracy
          </span>
        </div>

        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          Predict Customer
          <span className="text-indigo-400"> Purchase Behavior</span>
          <br />Before It Happens
        </h1>

        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
          ShopSense AI analyzes customer session data and predicts whether
          they will complete a purchase or abandon — giving you actionable insights.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/predict"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 
                       rounded-xl font-semibold transition-all hover:scale-105"
          >
            Try Single Prediction →
          </Link>
          <Link
            to="/bulk"
            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 
                       rounded-xl font-semibold border border-slate-600 transition-all"
          >
            Bulk CSV Upload
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <StatCard title="Model Accuracy" value="90.06%" color="indigo" />
        <StatCard title="ROC-AUC Score" value="0.918" color="green" />
        <StatCard title="Training Samples" value="9,864" color="yellow" />
        <StatCard title="Features Analyzed" value="17" color="indigo" />
      </div>

      {/* API Status */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-16">
        <h2 className="text-white font-semibold mb-4">🔌 API Status</h2>
        {health ? (
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">All Systems Operational</span>
            <span className="text-slate-500 text-sm">
              Model: {health.model} · Accuracy: {health.accuracy}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-red-400">API Offline — Start the backend</span>
          </div>
        )}
      </div>

      {/* How it works */}
      <div>
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Input Session Data',
              desc: 'Enter customer browsing behavior — pages visited, duration, bounce rate etc.'
            },
            {
              step: '02',
              title: 'AI Analysis',
              desc: 'Random Forest model analyzes 17 features to predict purchase intent.'
            },
            {
              step: '03',
              title: 'Get Insights',
              desc: 'Receive prediction, probability score, risk level and actionable recommendations.'
            }
          ].map(item => (
            <div key={item.step}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="text-indigo-400 font-bold text-lg mb-2">{item.step}</div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}