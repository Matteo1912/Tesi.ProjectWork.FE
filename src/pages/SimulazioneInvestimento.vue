<template>
  <section class="py-12 bg-white">
    <!-- Modale Autenticazione -->
    <AuthModal 
      :show="showAuthModal" 
      :is-login-mode="isLoginMode"
      @submit="handleAuth"
      @toggle-mode="toggleAuthMode"
      @close="showAuthModal = false"
    />

    <!-- Modale Simulazioni Salvate -->
    <SavedSimulationsModal
      :show="showSavedSimulationsModal"
      :saved-simulations="savedSimulations"
      @close="showSavedSimulationsModal = false"
      @load-simulation="loadSavedSimulation"
    />

    <!-- Contenuto principale -->
    <div class="container mx-auto px-6">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-burgundy-900 mb-4">
          Simulatore di Investimento
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Simula il rendimento del tuo investimento basato su indici finanziari storici
        </p>
        
        <!-- Pulsante Accesso -->
        <div class="mt-6">
          <button
            v-if="!isAuthenticated"
            @click="showAuthModal = true"
            class="bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Accedi per utilizzare il simulatore
          </button>
          
          <div v-else class="flex items-center justify-center space-x-4">
            <span class="text-gray-700">Ciao, {{ user.username }}</span>
            <button
              @click="logout"
              class="text-burgundy-600 hover:text-burgundy-800 font-medium"
            >
              Esci
            </button>
          </div>
        </div>
      </div>

      <!-- Sezione Simulazione (mostrata solo se autenticato) -->
      <div v-if="isAuthenticated" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Pannello Parametri -->
        <SimulationForm
          :indices="indices"
          :is-simulating="isSimulating"
          :is-saving="isSaving"
          :simulation-result="simulationResult"
          @run-simulation="runSimulation"
          @save-simulation="saveSimulation"
          @fetch-saved-simulations="fetchSavedSimulations"
          @update-index-info="updateIndexInfo"
        />

        <!-- Grafico e Risultati -->
        <div class="lg:col-span-2 space-y-8">
          <SimulationChart
            :loading="isSimulating"
            :simulation-data="simulationData"
            :final-value="simulationResult?.finalValue"
          />

          <SimulationResults
            :simulation-result="simulationResult"
          />
        </div>
      </div>

      <!-- Messaggio per utenti non autenticati -->
      <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
        <h3 class="text-2xl font-bold text-burgundy-900 mb-4">Accedi per utilizzare il simulatore</h3>
        <p class="text-gray-600 mb-6">Registrati o accedi al tuo account per simulare investimenti e salvare i risultati.</p>
        <button
          @click="showAuthModal = true"
          class="bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          Accedi o Registrati
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import SimulationForm from '@/components/simulation/SimulationForm.vue'
import SimulationChart from '@/components/simulation/SimulationChart.vue'
import SimulationResults from '@/components/simulation/SimulationResults.vue'
import SavedSimulationsModal from '@/components/simulation/SavedSimulationsModal.vue'
import authService from '@/services/authService'
import simulationService from '@/services/simulationService'

export default {
  components: {
    AuthModal,
    SimulationForm,
    SimulationChart,
    SimulationResults,
    SavedSimulationsModal
  },
  
  setup() {
    // Stato per autenticazione
    const showAuthModal = ref(false)
    const isLoginMode = ref(true)
    const isAuthenticated = ref(false)
    const user = ref(null)
    
    // Stato per simulazioni
    const indices = ref([])
    const isSimulating = ref(false)
    const isSaving = ref(false)
    const simulationData = ref(null)
    const simulationResult = ref(null)
    const savedSimulations = ref([])
    const showSavedSimulationsModal = ref(false)

    // Funzioni per autenticazione
    const toggleAuthMode = () => {
      isLoginMode.value = !isLoginMode.value
    }

    const handleAuth = async (formData) => {
      try {
        if (isLoginMode.value) {
          const token = await authService.login(formData.email, formData.password)
          authService.setAuthToken(token)
          user.value = { username: formData.email }
          isAuthenticated.value = true
          showAuthModal.value = false
          
          // Carica gli indici dopo il login
          await fetchIndices()
        } else {
          await authService.register(formData)
          // Dopo la registrazione, passa alla modalità login
          isLoginMode.value = true
          alert('Registrazione completata! Effettua il login')
        }
      } catch (error) {
        alert(error)
      }
    }

    const logout = () => {
      authService.logout()
      isAuthenticated.value = false
      user.value = null
      simulationResult.value = null
      simulationData.value = null
    }

    // Funzioni per simulazioni
    const fetchIndices = async () => {
      try {
        const response = await simulationService.getIndices()
        indices.value = response.data
      } catch (error) {
        console.error('Errore nel caricamento degli indici:', error)
        // Fallback in caso di errore
        indices.value = [
          { id: 1, codice: '^GSPC', descrizione: 'S&P 500' },
          { id: 2, codice: '^DJI', descrizione: 'Dow Jones' },
          { id: 3, codice: '^IXIC', descrizione: 'NASDAQ' },
          { id: 4, codice: '^FTSE', descrizione: 'FTSE 100' }
        ]
      }
    }

    const updateIndexInfo = () => {
      // Implementazione semplificata
      console.log('Index info updated')
    }

    const runSimulation = async (params) => {
      isSimulating.value = true
      simulationResult.value = null
      simulationData.value = null

      try {
        const response = await simulationService.runSimulation(params)
        simulationData.value = response
        
        // Calcola i risultati della simulazione
        if (response.datiGrafico && response.datiGrafico.length > 0) {
          const finalValue = response.datiGrafico[response.datiGrafico.length - 1].close
          const totalInvested = params.importoIniziale + (params.incrementoMensile * 12 * params.anni)
          const gain = finalValue - totalInvested
          const gainPercentage = (gain / totalInvested) * 100

          simulationResult.value = {
            finalValue,
            totalInvested,
            gain,
            gainPercentage,
            rendimentoMedioAnnuale: response.rendimentoMedioAnnuale
          }
        }
      } catch (error) {
        console.error('Errore nella simulazione:', error)
        alert('Si è verificato un errore durante la simulazione')
      } finally {
        isSimulating.value = false
      }
    }

    const saveSimulation = async (simulationData) => {
      isSaving.value = true
      try {
        await simulationService.saveSimulation(simulationData)
        alert('Simulazione salvata con successo!')
      } catch (error) {
        console.error('Errore nel salvataggio:', error)
        alert(`Errore: ${error}`)
      } finally {
        isSaving.value = false
      }
    }

    const fetchSavedSimulations = async () => {
      try {
        const response = await simulationService.getSavedSimulations()
        savedSimulations.value = response
        showSavedSimulationsModal.value = true
      } catch (error) {
        console.error('Errore nel recupero delle simulazioni:', error)
        alert(`Errore: ${error}`)
      }
    }

    const loadSavedSimulation = (simulation) => {
      // Qui dovresti emettere un evento o gestire il caricamento dei dati
      // nella simulazione corrente
      console.log('Loading simulation:', simulation)
      showSavedSimulationsModal.value = false
    }

    // Inizializzazione
    onMounted(() => {
      const savedToken = authService.getAuthToken()
      if (savedToken) {
        isAuthenticated.value = true
        user.value = { username: 'Utente' }
        fetchIndices()
      }
    })

    return {
      // Stato autenticazione
      showAuthModal,
      isLoginMode,
      isAuthenticated,
      user,
      
      // Funzioni autenticazione
      toggleAuthMode,
      handleAuth,
      logout,
      
      // Stato simulazioni
      indices,
      isSimulating,
      isSaving,
      simulationData,
      simulationResult,
      savedSimulations,
      showSavedSimulationsModal,
      
      // Funzioni simulazioni
      updateIndexInfo,
      runSimulation,
      saveSimulation,
      fetchSavedSimulations,
      loadSavedSimulation
    }
  }
}
</script>