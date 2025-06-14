import api from './apiService'

export default {
  async login(email, password) {
    try {
      const response = await api.get(
        `/user/GetTokenUser?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/user/Registrazione', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  logout() {
    api.removeAuthHeader()
    localStorage.removeItem('authToken')
  },

  setAuthToken(token) {
    localStorage.setItem('authToken', token)
    api.setAuthHeader(token)
  },

  getAuthToken() {
    return localStorage.getItem('authToken')
  }
}