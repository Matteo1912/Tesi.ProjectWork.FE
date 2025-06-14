<template>
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
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: {
    indices: Array,
    isSimulating: Boolean,
    isSaving: Boolean,
    simulationResult: Object
  },
  
  emits: [
    'run-simulation',
    'save-simulation',
    'fetch-saved-simulations',
    'update-index-info'
  ],
  
  setup(props, { emit }) {
    const selectedIndex = ref('^GSPC')
    const indexInfo = ref(null)
    const importoIniziale = ref(10000)
    const anniInvestimento = ref(10)
    const contributoMensile = ref(100)
    const usaMediaStorica = ref(true)
    const rendimentoPersonalizzato = ref(7)

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
      
      emit('update-index-info', indexInfo.value)
    }

    const runSimulation = () => {
      const params = {
        indice: selectedIndex.value,
        anni: anniInvestimento.value,
        importoIniziale: importoIniziale.value,
        incrementoMensile: contributoMensile.value,
        usaMediaStorica: usaMediaStorica.value,
        rendimentoPersonalizzato: rendimentoPersonalizzato.value
      }
      
      emit('run-simulation', params)
    }

    const saveSimulation = () => {
      const simulationData = {
        indice: selectedIndex.value,
        anni: anniInvestimento.value,
        importoIniziale: importoIniziale.value,
        incrementoMensile: contributoMensile.value,
        usaMediaStorica: usaMediaStorica.value,
        rendimentoPersonalizzato: usaMediaStorica.value ? null : rendimentoPersonalizzato.value
      }
      
      emit('save-simulation', simulationData)
    }

    const fetchSavedSimulations = () => {
      emit('fetch-saved-simulations')
    }

    return {
      selectedIndex,
      indexInfo,
      importoIniziale,
      anniInvestimento,
      contributoMensile,
      usaMediaStorica,
      rendimentoPersonalizzato,
      updateIndexInfo,
      runSimulation,
      saveSimulation,
      fetchSavedSimulations
    }
  }
}
</script>