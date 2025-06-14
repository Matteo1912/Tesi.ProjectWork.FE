import api from './apiService'

export default {
  /**
   * Effettua il login e restituisce il token JWT
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<string>} Token JWT
   */
  async login(email, password) {
    try {
      const response = await api.get(
        `/user/GetTokenUser?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      )
      
      const token = response.data
      debugger
      this.setAuthToken(token)
      return token
      
    } catch (error) {
      console.error('Login error:', error)
      // Migliora la gestione degli errori
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Credenziali non valide')
        }
        throw new Error(error.response.data?.message || 'Errore durante il login')
      }
      throw new Error('Errore di connessione al server')
    }
  },

  /**
   * Registra un nuovo utente
   * @param {object} userData 
   * @returns {Promise<object>} Risposta del server
   */
  async register(userData) {
    try {
      const response = await api.post('/user/Registrazione', userData)
      return response.data
      
    } catch (error) {
      console.error('Registration error:', error)
      if (error.response) {
        throw new Error(error.response.data?.message || 'Errore durante la registrazione')
      }
      throw new Error('Errore di connessione al server')
    }
  },

  /**
   * Effettua il logout
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      localStorage.removeItem('authToken')

      
    } catch (error) {
      console.error('Logout error:', error)
      // Anche se il logout fallisce, procedi con la pulizia locale
      localStorage.removeItem('authToken')
      throw new Error('Errore durante il logout')
    }
  },

  getAuthToken() {
    return localStorage.getItem('authToken')
  },

  setAuthToken(token) {
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
  },


  isAuthenticated() {
    return !!this.getAuthToken() && this.checkTokenExpiration()
  },


  checkTokenExpiration() {
    const token = this.getAuthToken()
    if (!token) return false
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const isExpired = payload.exp * 1000 > Date.now()
      
      if (!isExpired) {
        this.setAuthToken(null)
      }
      
      return isExpired
    } catch (e) {
      console.error('Token parsing error:', e)
      return false
    }
  }
}