import api from './apiService'

export default {
  // ... altre funzioni esistenti ...
  
  getAuthToken() {
    return localStorage.getItem('authToken')
  },

  isAuthenticated() {
    return !!this.getAuthToken()
  },

  checkTokenExpiration() {
    const token = this.getAuthToken()
    if (!token) return false
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch (e) {
      return false
    }
  }
}