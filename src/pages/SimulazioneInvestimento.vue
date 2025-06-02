<template>
  <section class="py-12 bg-white">
    <!-- Modale Autenticazione -->
    <div v-if="showAuthModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-2xl font-bold text-burgundy-900 mb-4">
          {{ isLoginMode ? 'Accedi' : 'Registrati' }}
        </h3>
        
        <form @submit.prevent="handleAuth">
          <div class="space-y-4">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email*</label>
              <input 
                v-model="authForm.email"
                @blur="v$.email.$touch()"
                type="email" 
                class="w-full px-4 py-2 rounded-lg border"
                :class="v$.email.$error ? 'border-red-500' : 'border-gray-300'"
              >
              <p v-if="v$.email.$error" class="text-red-500 text-xs mt-1">
                {{ v$.email.$errors[0]?.$message }}
              </p>
            </div>
            
            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password*</label>
              <input 
                v-model="authForm.password"
                @blur="v$.password.$touch()"
                type="password" 
                class="w-full px-4 py-2 rounded-lg border"
                :class="v$.password.$error ? 'border-red-500' : 'border-gray-300'"
              >
              <p v-if="v$.password.$error" class="text-red-500 text-xs mt-1">
                {{ v$.password.$errors[0]?.$message }}
              </p>
            </div>

            <!-- Campi aggiuntivi registrazione -->
            <template v-if="!isLoginMode">
              <!-- Username -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Username*</label>
                <input 
                  v-model="authForm.username"
                  @blur="v$.username.$touch()"
                  type="text" 
                  class="w-full px-4 py-2 rounded-lg border"
                  :class="v$.username.$error ? 'border-red-500' : 'border-gray-300'"
                >
                <p v-if="v$.username.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.username.$errors[0]?.$message }}
                </p>
              </div>
              
              <!-- Nome -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
                <input 
                  v-model="authForm.firstName"
                  @blur="v$.firstName.$touch()"
                  type="text" 
                  class="w-full px-4 py-2 rounded-lg border"
                  :class="v$.firstName.$error ? 'border-red-500' : 'border-gray-300'"
                >
                <p v-if="v$.firstName.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.firstName.$errors[0]?.$message }}
                </p>
              </div>

              <!-- Cognome -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cognome*</label>
                <input 
                  v-model="authForm.lastName"
                  @blur="v$.lastName.$touch()"
                  type="text" 
                  class="w-full px-4 py-2 rounded-lg border"
                  :class="v$.lastName.$error ? 'border-red-500' : 'border-gray-300'"
                >
                <p v-if="v$.lastName.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.lastName.$errors[0]?.$message }}
                </p>
              </div>

              <!-- Codice Fiscale -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale*</label>
                <input 
                  v-model="authForm.codiceFiscale"
                  @blur="v$.codiceFiscale.$touch()"
                  type="text" 
                  class="w-full px-4 py-2 rounded-lg border"
                  :class="v$.codiceFiscale.$error ? 'border-red-500' : 'border-gray-300'"
                >
                <p v-if="v$.codiceFiscale.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.codiceFiscale.$errors[0]?.$message }}
                </p>
              </div>
            </template>

            <div class="flex justify-between items-center pt-2">
              <button
                type="button"
                @click="toggleAuthMode"
                class="text-sm text-burgundy-600 hover:text-burgundy-800"
              >
                {{ isLoginMode ? 'Crea un account' : 'Hai già un account? Accedi' }}
              </button>
              
              <button
                type="submit"
                class="bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold py-2 px-4 rounded-lg"
                :disabled="v$.$invalid || authLoading"
              >
                <span v-if="!authLoading">{{ isLoginMode ? 'Accedi' : 'Registrati' }}</span>
                <span v-else>Caricamento...</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Modale Simulazioni Salvate -->
    <div v-if="showSavedSimulationsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold text-burgundy-900">Le tue simulazioni salvate</h3>
          <button @click="showSavedSimulationsModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="savedSimulations.length === 0" class="text-center py-8 text-gray-500">
          Nessuna simulazione salvata trovata
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="(sim, index) in savedSimulations" :key="index" 
               class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-500">Indice</p>
                <p class="font-medium">{{ sim.indice }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Durata</p>
                <p class="font-medium">{{ sim.anni }} anni</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Importo iniziale</p>
                <p class="font-medium">{{ formatCurrency(sim.importoIniziale) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Contributo mensile</p>
                <p class="font-medium">{{ formatCurrency(sim.incrementoMensile) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tipo rendimento</p>
                <p class="font-medium">{{ sim.usaMediaStorica ? 'Media storica' : 'Personalizzato (' + sim.rendimentoPersonalizzato + '%)' }}</p>
              </div>
              <div class="flex items-end justify-end">
                <button @click="loadSavedSimulation(sim)"
                        class="bg-burgundy-600 hover:bg-burgundy-700 text-white font-medium py-2 px-4 rounded-lg text-sm">
                  Carica questa simulazione
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
        <div class="bg-gray-50 p-6 rounded-2xl shadow-lg">
          <h3 class="text-2xl font-bold text-burgundy-900 mb-6">Parametri</h3>
          
          <div class="space-y-6">
            <!-- Selezione Indice -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Indice di Riferimento</label>
              <select 
                v-model="selectedIndex" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-burgundy-500 focus:border-burgundy-500"
                @change="updateIndexInfo"
              >
                <option v-for="index in indices" :key="index.id" :value="index.codice">
                  {{ index.descrizione }} ({{ index.codice }})
                </option>
              </select>
            </div>

            <!-- Info indice -->
            <div v-if="indexInfo" class="bg-burgundy-50 p-4 rounded-lg">
              <h4 class="font-bold text-burgundy-800 mb-2">Informazioni Indice</h4>
              <p class="text-sm text-gray-700">
                Rendimento medio annuo: <span class="font-bold">{{ indexInfo.rendimentoMedio }}%</span>
              </p>
              <p class="text-sm text-gray-700">
                Volatilità storica: <span class="font-bold">{{ indexInfo.volatilita }}%</span>
              </p>
            </div>

            <!-- Importo Iniziale -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Importo Iniziale (€)</label>
              <input 
                v-model.number="importoIniziale" 
                type="number" 
                min="0" 
                step="100" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-burgundy-500 focus:border-burgundy-500"
              >
            </div>

            <!-- Durata Investimento -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Durata Investimento (anni)</label>
              <input 
                v-model.number="anniInvestimento" 
                type="number" 
                min="1" 
                max="30" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-burgundy-500 focus:border-burgundy-500"
              >
            </div>

            <!-- Contributo mensile -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contributo Mensile (€)</label>
              <input 
                v-model.number="contributoMensile" 
                type="number" 
                min="0" 
                step="10" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-burgundy-500 focus:border-burgundy-500"
              >
            </div>

            <!-- Toggle media storica -->
            <div class="flex items-center">
              <input 
                v-model="usaMediaStorica" 
                type="checkbox" 
                id="useHistorical" 
                class="h-4 w-4 text-burgundy-600 focus:ring-burgundy-500 border-gray-300 rounded"
              >
              <label for="useHistorical" class="ml-2 block text-sm text-gray-700">
                Usa rendimento medio storico
              </label>
            </div>

            <!-- Rendimento personalizzato -->
            <div v-if="!usaMediaStorica">
              <label class="block text-sm font-medium text-gray-700 mb-1">Rendimento Annuo Personalizzato (%)</label>
              <input 
                v-model.number="rendimentoPersonalizzato" 
                type="number" 
                step="0.1" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-burgundy-500 focus:border-burgundy-500"
              >
            </div>

            <!-- Pulsante Simulazione -->
            <button
              @click="runSimulation"
              :disabled="isSimulating"
              class="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center"
            >
              <span v-if="!isSimulating">Simula Investimento</span>
              <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>

            <!-- Pulsante Salva Simulazione -->
            <button
              v-if="simulationResult"
              @click="saveSimulation"
              :disabled="isSaving"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center"
            >
              <span v-if="!isSaving">Salva Simulazione</span>
              <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>

            <!-- Pulsante Visualizza Simulazioni Salvate -->
            <button
              @click="fetchSavedSimulations"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Visualizza Simulazioni Salvate
            </button>
          </div>
        </div>

        <!-- Grafico e Risultati -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-burgundy-900">Proiezione Investimento</h3>
              <div v-if="simulationResult" class="bg-burgundy-100 px-4 py-2 rounded-full">
                <span class="text-burgundy-700 font-medium">
                  Valore finale: {{ formatCurrency(simulationResult.finalValue) }}
                </span>
              </div>
            </div>

            <div class="relative h-96">
              <div v-if="isSimulating" class="absolute inset-0 flex items-center justify-center z-10">
                <div class="text-center">
                  <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy-600 mb-2"></div>
                  <p class="text-gray-600">Generando simulazione...</p>
                </div>
              </div>

              <Line
                v-if="chartData.labels && !isSimulating"
                :data="chartData"
                :options="chartOptions"
                :key="chartKey"
                class="chart-canvas"
              />

              <div v-if="!chartData.labels && !isSimulating" class="h-full flex items-center justify-center text-gray-500">
                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <p class="mt-4">Imposta i parametri e clicca "Simula Investimento"</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Risultati -->
          <div v-if="simulationResult" class="bg-white p-6 rounded-2xl shadow-lg">
            <h3 class="text-2xl font-bold text-burgundy-900 mb-6">Risultati della Simulazione</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-burgundy-50 p-6 rounded-xl">
                <p class="text-sm text-burgundy-700 mb-1">Totale Investito</p>
                <p class="text-xl md:text-2xl font-bold text-burgundy-900">
                  {{ formatCurrency(simulationResult.totalInvested) }}
                </p>
              </div>
              <div class="bg-burgundy-50 p-6 rounded-xl">
                <p class="text-sm text-burgundy-700 mb-1">Valore Finale</p>
                <p class="text-xl md:text-2xl font-bold text-burgundy-900">
                  {{ formatCurrency(simulationResult.finalValue) }}
                </p>
              </div>
              <div class="bg-burgundy-50 p-6 rounded-xl">
                <p class="text-sm text-burgundy-700 mb-1">Guadagno</p>
                <p class="text-xl md:text-2xl font-bold" :class="simulationResult.gain >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatCurrency(simulationResult.gain) }} ({{ simulationResult.gainPercentage.toFixed(2) }}%)
                </p>
              </div>
            </div>
          </div>
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength, helpers } from '@vuelidate/validators'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-date-fns'

// Registra i componenti di Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Filler
)

// Stato per autenticazione
const showAuthModal = ref(false)
const isLoginMode = ref(true)
const authLoading = ref(false)
const isAuthenticated = ref(false)
const user = ref(null)
const token = ref(null)

// Form autenticazione
const authForm = ref({
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  codiceFiscale: ''
})

// Validazioni
const rules = computed(() => {
  const baseRules = {
    email: { 
      required: helpers.withMessage('Email obbligatoria', required),
      email: helpers.withMessage('Formato email non valido', email)
    },
    password: {
      required: helpers.withMessage('Password obbligatoria', required),
      minLength: helpers.withMessage('Minimo 8 caratteri', minLength(8)),
      regex: helpers.withMessage(
        'Deve contenere maiuscole, minuscole, numeri e caratteri speciali',
        helpers.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)
      )
    }
  };

  if (!isLoginMode.value) {
    return {
      ...baseRules,
      username: { 
        required: helpers.withMessage('Username obbligatorio', required),
        minLength: helpers.withMessage('Minimo 3 caratteri', minLength(3)),
        maxLength: helpers.withMessage('Massimo 20 caratteri', maxLength(20)),
        regex: helpers.withMessage(
          'Solo lettere, numeri e underscore',
          helpers.regex(/^[a-zA-Z0-9_]+$/)
        )
      },
      firstName: {
        required: helpers.withMessage('Nome obbligatorio', required),
        maxLength: helpers.withMessage('Massimo 50 caratteri', maxLength(50))
      },
      lastName: {
        required: helpers.withMessage('Cognome obbligatorio', required),
        maxLength: helpers.withMessage('Massimo 50 caratteri', maxLength(50))
      },
      codiceFiscale: {
        required: helpers.withMessage('Codice Fiscale obbligatorio', required),
        regex: helpers.withMessage(
          'Codice Fiscale non valido',
          helpers.regex(/^[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]$/)
        )
      }
    };
  }
  
  return baseRules;
})

const v$ = useVuelidate(rules, authForm)

// Stato per simulazioni
const indices = ref([])
const selectedIndex = ref('^GSPC')
const indexInfo = ref(null)
const importoIniziale = ref(10000)
const anniInvestimento = ref(10)
const contributoMensile = ref(100)
const usaMediaStorica = ref(true)
const rendimentoPersonalizzato = ref(7)
const isSimulating = ref(false)
const isSaving = ref(false)
const simulationResult = ref(null)
const chartData = ref({})
const chartKey = ref(0)
const savedSimulations = ref([])
const showSavedSimulationsModal = ref(false)

// Opzioni del grafico
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#7F1D1D',
      titleColor: '#FEE2E2',
      bodyColor: '#FECACA',
      borderColor: '#B91C1C',
      borderWidth: 1,
      padding: 12,
      usePointStyle: true,
      callbacks: {
        label: (context) => {
          return ` ${formatCurrency(context.parsed.y)}`
        },
        title: (items) => {
          return new Date(items[0].parsed.x).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long'
          })
        }
      }
    }
  },
  scales: {
    x: {
      type: 'time',
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: '#9CA3AF'
      },
      time: {
        tooltipFormat: 'MMM yyyy',
        displayFormats: {
          month: 'MMM yyyy'
        }
      }
    },
    y: {
      grid: {
        color: '#F3F4F6',
        drawBorder: false
      },
      ticks: {
        color: '#9CA3AF',
        callback: (value) => formatCurrency(value)
      }
    }
  },
  elements: {
    point: {
      radius: 0,
      hoverRadius: 6,
      backgroundColor: '#7F1D1D',
      borderWidth: 2,
      borderColor: '#FEE2E2'
    },
    line: {
      borderWidth: 3,
      borderColor: '#7F1D1D',
      tension: 0.1,
      fill: {
        target: 'origin',
        above: 'rgba(127, 29, 29, 0.1)'
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
}

// Funzioni per autenticazione
const toggleAuthMode = () => {
  isLoginMode.value = !isLoginMode.value
  v$.value.$reset()
}

const handleAuth = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) return
  
  authLoading.value = true
  try {
    if (isLoginMode.value) {
      // Chiamata GET per login
      const response = await fetch(
        `https://tesi-be-h6b5fnbgesbmacb8.italynorth-01.azurewebsites.net/api/user/GetTokenUser?email=${encodeURIComponent(authForm.value.email)}&password=${encodeURIComponent(authForm.value.password)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )

      if (!response.ok) {
        throw new Error(await response.text())
      }

      token.value = await response.text()
      user.value = { username: authForm.value.email }
      isAuthenticated.value = true
      showAuthModal.value = false
      localStorage.setItem('authToken', token.value)
      
      // Carica gli indici dopo il login
      await fetchIndices()
      updateIndexInfo()
    } else {
      // Chiamata POST per registrazione
      const response = await fetch('https://tesi-be-h6b5fnbgesbmacb8.italynorth-01.azurewebsites.net/api/user/Registrazione', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authForm.value)
      })
      
      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      // Dopo la registrazione, passa alla modalità login
      isLoginMode.value = true
      authForm.value.password = ''
      alert('Registrazione completata! Effettua il login')
    }
  } catch (error) {
    alert(error.message)
  } finally {
    authLoading.value = false
  }
}

const logout = () => {
  token.value = null
  user.value = null
  isAuthenticated.value = false
  localStorage.removeItem('authToken')
  simulationResult.value = null
  chartData.value = {}
}

// Funzioni per simulazioni
const fetchIndices = async () => {
  try {
    const response = await fetch('https://tesi-be-h6b5fnbgesbmacb8.italynorth-01.azurewebsites.net/api/investimenti/GetTipologieIndici', {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    const result = await response.json()
    indices.value = result.data
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
  const infoMap = {
    '^GSPC': { rendimentoMedio: 7.5, volatilita: 15 },
    '^DJI': { rendimentoMedio: 6.8, volatilita: 14 },
    '^IXIC': { rendimentoMedio: 9.2, volatilita: 18 },
    '^FTSE': { rendimentoMedio: 5.5, volatilita: 12 }
  }
  
  indexInfo.value = infoMap[selectedIndex.value] || { rendimentoMedio: 7, volatilita: 15 }
  
  if (usaMediaStorica.value) {
    rendimentoPersonalizzato.value = indexInfo.value.rendimentoMedio
  }
}

const runSimulation = async () => {
  isSimulating.value = true
  simulationResult.value = null
  chartData.value = {}

  try {
    const params = new URLSearchParams({
      indice: selectedIndex.value,
      anni: anniInvestimento.value,
      importoIniziale: importoIniziale.value,
      incrementoMensile: contributoMensile.value,
      usaMediaStorica: usaMediaStorica.value,
      rendimentoPersonalizzato: rendimentoPersonalizzato.value
    })

    const response = await fetch(`https://tesi-be-h6b5fnbgesbmacb8.italynorth-01.azurewebsites.net/api/investimenti/proiezione-grafico?${params}`)
    
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`)
    }

    const responseData = await response.json()
    
    // Estrai i dati dalla risposta
    const datiGrafico = responseData.datiGrafico
    const rendimentoMedio = responseData.rendimentoMedioAnnuale

    // Aggiorna le info sull'indice con il rendimento reale
    indexInfo.value.rendimentoMedio = rendimentoMedio.toFixed(2)

    // Elabora i dati per il grafico
    chartData.value = {
      labels: datiGrafico.map(item => new Date(item.date)),
      datasets: [{
        label: 'Valore Investimento',
        data: datiGrafico.map(item => ({
          x: new Date(item.date),
          y: item.close
        })),
        borderColor: '#7F1D1D',
        backgroundColor: 'rgba(127, 29, 29, 0.1)'
      }]
    }

    // Calcola i risultati della simulazione
    if (datiGrafico.length === 0) {
      throw new Error('Nessun dato disponibile per la simulazione')
    }

    const finalValue = datiGrafico[datiGrafico.length - 1].close
    const totalInvested = importoIniziale.value + (contributoMensile.value * 12 * anniInvestimento.value)
    const gain = finalValue - totalInvested
    const gainPercentage = (gain / totalInvested) * 100

    // Estrai dati annuali per la tabella
    const yearlyResults = []
    const monthsPerYear = 12
    const totalMonths = anniInvestimento.value * monthsPerYear

    for (let year = 1; year <= anniInvestimento.value; year++) {
      const monthIndex = Math.min(year * monthsPerYear - 1, datiGrafico.length - 1)
      const yearData = datiGrafico[monthIndex]
      
      const yearInvested = importoIniziale.value * (year === 1 ? 1 : 0) + 
                         (contributoMensile.value * monthsPerYear * year)
      
      yearlyResults.push({
        year: year,
        invested: yearInvested,
        value: yearData.close,
        return: ((yearData.close / (yearInvested || 1)) - 1) * 100
      })
    }

    simulationResult.value = {
      finalValue,
      totalInvested,
      gain,
      gainPercentage,
      yearlyResults,
      rendimentoMedioAnnuale: rendimentoMedio
    }

    chartKey.value++

  } catch (error) {
    console.error('Errore nella simulazione:', error)
    showErrorNotification(error.message)
    showSampleData()
  } finally {
    isSimulating.value = false
  }
}

const saveSimulation = async () => {
  if (!simulationResult.value) return
  
  isSaving.value = true
  try {
    const simulationData = {
      indice: selectedIndex.value,
      anni: anniInvestimento.value,
      importoIniziale: importoIniziale.value,
      incrementoMensile: contributoMensile.value,
      usaMediaStorica: usaMediaStorica.value,
      rendimentoPersonalizzato: usaMediaStorica.value ? null : rendimentoPersonalizzato.value
    }

    const response = await fetch('https://tesi-be-h6b5fnbgesbmacb8.italynorth-01.azurewebsites.net/api/investimenti/salva-simulazione', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify(simulationData)
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    alert('Simulazione salvata con successo!')
  } catch (error) {
    console.error('Errore nel salvataggio:', error)
    alert(`Errore: ${error.message}`)
  } finally {
    isSaving.value = false
  }
}

const fetchSavedSimulations = async () => {
  try {
    const response = await fetch('https://tesi-be-h6b5fnbgesbmacb8.italynorth-01.azurewebsites.net/api/investimenti/simulazioni', {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    savedSimulations.value = await response.json()
    showSavedSimulationsModal.value = true
  } catch (error) {
    console.error('Errore nel recupero delle simulazioni:', error)
    alert(`Errore: ${error.message}`)
  }
}

const loadSavedSimulation = (simulation) => {
  selectedIndex.value = simulation.indice
  importoIniziale.value = simulation.importoIniziale
  anniInvestimento.value = simulation.anni
  contributoMensile.value = simulation.incrementoMensile
  usaMediaStorica.value = simulation.usaMediaStorica
  if (!simulation.usaMediaStorica) {
    rendimentoPersonalizzato.value = simulation.rendimentoPersonalizzato
  }
  updateIndexInfo()
  showSavedSimulationsModal.value = false
}

// Funzioni utility
const formatCurrency = (value) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

// Inizializzazione
onMounted(() => {
  const savedToken = localStorage.getItem('authToken')
  if (savedToken) {
    token.value = savedToken
    isAuthenticated.value = true
    user.value = { username: 'Utente' }
    fetchIndices()
    updateIndexInfo()
  }
})


</script>

<style scoped>
.bg-burgundy-600 {
  background-color: #7F1D1D;
}
.hover\:bg-burgundy-700:hover {
  background-color: #6B1616;
}
.text-burgundy-900 {
  color: #3D0C0C;
}
.bg-burgundy-100 {
  background-color: #FEE2E2;
}
.text-burgundy-700 {
  color: #B91C1C;
}
.border-burgundy-300 {
  border-color: #FCA5A5;
}
.focus\:ring-burgundy-500:focus {
  --tw-ring-color: #EF4444;
}
.focus\:border-burgundy-500:focus {
  border-color: #EF4444;
}

.chart-canvas {
  @apply w-full h-full;
}

/* Animazioni */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Effetto hover per i box statistiche */
.bg-burgundy-50:hover {
  @apply bg-burgundy-100;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Stili per la tabella dei risultati */
table {
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th {
  position: sticky;
  top: 0;
  background-color: #F9FAFB;
}

td, th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #E5E7EB;
}

tr:last-child td {
  border-bottom: none;
}

/* Stili per il modale delle simulazioni salvate */
.modal-content {
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

/* Stili per i pulsanti disabilitati */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Stili per gli input */
input[type="number"], input[type="text"], input[type="email"], input[type="password"], select {
  transition: border-color 0.2s ease;
}

input[type="number"]:focus, input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

/* Stili per il loader */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Stili per la card dei parametri */
.bg-gray-50 {
  background-color: #F9FAFB;
}

.rounded-2xl {
  border-radius: 1rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>