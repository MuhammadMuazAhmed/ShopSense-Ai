import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Predict from './pages/Predict'
import BulkPredict from './pages/BulkPredict'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/bulk" element={<BulkPredict />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}