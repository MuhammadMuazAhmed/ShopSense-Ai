import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

export const checkHealth = async () => {
  const res = await api.get('/health')
  return res.data
}

export const predictSingle = async (customerData) => {
  const res = await api.post('/predict', customerData)
  return res.data
}

export const predictBulk = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await axios.post(`${BASE_URL}/predict-bulk`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}