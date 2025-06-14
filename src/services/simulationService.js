import api from './apiService'

export default {
  async getIndices() {
    try {
      const response = await api.get('/investimenti/GetTipologieIndici')
      return response.data
    } catch (error) {
      console.error('Error fetching indices:', error)
      throw error
    }
  },

  async runSimulation(params) {
    try {
      const response = await api.get('/investimenti/proiezione-grafico', { params })
      return response.data
    } catch (error) {
      console.error('Error running simulation:', error)
      throw error
    }
  },

  async saveSimulation(simulationData) {
    try {
      const response = await api.post('/investimenti/salva-simulazione', simulationData)
      return response.data
    } catch (error) {
      console.error('Error saving simulation:', error)
      throw error
    }
  },

  async deleteSimulation(simulationId) {
    try {
        const response = await api.delete(`/investimenti/elimina-simulazione/${simulationId}`)
        return response.data
    } catch (error) {
        console.error('Error deleting simulation:', error)
        throw error
    }
  },

  async getSavedSimulations() {
    try {
      const response = await api.get('/investimenti/simulazioni')
      return response.data
    } catch (error) {
      console.error('Error fetching saved simulations:', error)
      throw error
    }
  }
}