<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-2xl font-bold text-burgundy-900">Le tue simulazioni salvate</h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div v-if="simulations.length === 0" class="text-center py-8 text-gray-500">
        Nessuna simulazione salvata trovata
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="(sim, index) in simulations" :key="index" 
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
              <button @click="loadSimulation(sim)"
                      class="bg-burgundy-600 hover:bg-burgundy-700 text-white font-medium py-2 px-4 rounded-lg text-sm">
                Carica questa simulazione
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    show: Boolean,
    savedSimulations: Array
  },
  
  emits: ['close', 'load-simulation'],
  
  setup(props, { emit }) {
    const simulations = computed(() => props.savedSimulations)
    
    const close = () => {
      emit('close')
    }
    
    const loadSimulation = (simulation) => {
      emit('load-simulation', simulation)
    }
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
    }
    
    return {
      simulations,
      close,
      loadSimulation,
      formatCurrency
    }
  }
}
</script>