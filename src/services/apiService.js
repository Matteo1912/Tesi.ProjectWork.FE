import axios from 'axios'
import authService from './authService' // Importa il servizio di autenticazione

const apiClient = axios.create({
  baseURL: 'https://tesi-be-h6b5fnbgesbmacb8.italynorth-01.azurewebsites.net/api',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Aggiungi un interceptor per includere il token in ogni richiesta
apiClient.interceptors.request.use(config => {
  const token = authService.getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default {
  get(resource, params = {}) {
    return apiClient.get(resource, { params })
  },
  
  post(resource, data) {
    return apiClient.post(resource, data)
  },
  
  put(resource, data) {
    return apiClient.put(resource, data)
  },
  
  delete(resource) {
    return apiClient.delete(resource)
  }
}