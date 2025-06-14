import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://tesi-be-h6b5fnbgesbmacb8.italynorth-01.azurewebsites.net/api',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
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
  },
  
  setAuthHeader(token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  
  removeAuthHeader() {
    delete apiClient.defaults.headers.common['Authorization']
  }
}