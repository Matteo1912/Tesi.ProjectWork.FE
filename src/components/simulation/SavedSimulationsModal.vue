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
              <p class="font-medium">{{ sim.usaMediaStorica ? 'Media storica' : 'Personalizzato (' + (sim.rendimentoPersonalizzato || 0) + '%)' }}</p>
            </div>
            <div class="flex items-end justify-end space-x-2">
              <button @click="loadSimulation(sim)"
                      class="bg-burgundy-600 hover:bg-burgundy-700 text-white font-medium py-2 px-4 rounded-lg text-sm">
                Carica
              </button>
              <button @click="deleteSimulation(sim.id)"
                      class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                      :disabled="isDeleting === sim.id">
                <span v-if="isDeleting !== sim.id">Elimina</span>
                <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import simulationService from '@/services/simulationService'

export default {
  props: {
    show: Boolean,
    savedSimulations: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['close', 'load-simulation', 'simulation-deleted'],
  
  setup(props, { emit }) {
    const isDeleting = ref(null)
    const simulations = ref([...props.savedSimulations])

    // Aggiorna le simulazioni quando cambia la prop
    watch(() => props.savedSimulations, (newVal) => {
      simulations.value = [...newVal]
    })

    const close = () => {
      emit('close')
    }
    
    const loadSimulation = (simulation) => {
      emit('load-simulation', simulation)
    }
    
    const deleteSimulation = async (simulationId) => {
        if (!confirm('Sei sicuro di voler eliminare questa simulazione?')) {
            return
        }
        
        isDeleting.value = simulationId
        try {
            await simulationService.deleteSimulation(simulationId)
            
            // 1. Crea un nuovo array invece di modificare quello esistente
            const updatedSimulations = simulations.value.filter(sim => sim.id !== simulationId)
            
            // 2. Assegna il nuovo array per forzare la reattività
            simulations.value = updatedSimulations
            
            // 3. Notifica il componente padre
            emit('simulation-deleted', simulationId)
            loadSimulation()
            alert('Simulazione eliminata correttamente')
            
        } catch (error) {
            console.error('Errore eliminazione:', error)
            alert('Errore durante l\'eliminazione: ' + (error.response?.data?.message || error.message))
        } finally {
            isDeleting.value = null
        }
    }
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('it-IT', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value)
    }
    
    return {
      simulations,
      isDeleting,
      close,
      loadSimulation,
      deleteSimulation,
      formatCurrency
    }
  }
}
</script>