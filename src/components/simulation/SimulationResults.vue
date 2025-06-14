<template>
  <div v-if="results" class="bg-white p-6 rounded-2xl shadow-lg">
    <h3 class="text-2xl font-bold text-burgundy-900 mb-6">Risultati della Simulazione</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-burgundy-50 p-6 rounded-xl">
        <p class="text-sm text-burgundy-700 mb-1">Totale Investito</p>
        <p class="text-xl md:text-2xl font-bold text-burgundy-900">
          {{ formatCurrency(results.totalInvested) }}
        </p>
      </div>
      <div class="bg-burgundy-50 p-6 rounded-xl">
        <p class="text-sm text-burgundy-700 mb-1">Valore Finale</p>
        <p class="text-xl md:text-2xl font-bold text-burgundy-900">
          {{ formatCurrency(results.finalValue) }}
        </p>
      </div>
      <div class="bg-burgundy-50 p-6 rounded-xl">
        <p class="text-sm text-burgundy-700 mb-1">Guadagno</p>
        <p class="text-xl md:text-2xl font-bold" :class="results.gain >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatCurrency(results.gain) }} ({{ results.gainPercentage.toFixed(2) }}%)
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    simulationResult: Object
  },
  
  setup(props) {
    const results = computed(() => {
      if (!props.simulationResult) return null
      
      return {
        totalInvested: props.simulationResult.totalInvested,
        finalValue: props.simulationResult.finalValue,
        gain: props.simulationResult.gain,
        gainPercentage: props.simulationResult.gainPercentage
      }
    })
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
    }
    
    return {
      results,
      formatCurrency
    }
  }
}
</script>