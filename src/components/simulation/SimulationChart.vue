<template>
  <div class="bg-white p-6 rounded-2xl shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold text-burgundy-900">Proiezione Investimento</h3>
      <div v-if="finalValue" class="bg-burgundy-100 px-4 py-2 rounded-full">
        <span class="text-burgundy-700 font-medium">
          Valore finale: {{ formatCurrency(finalValue) }}
        </span>
      </div>
    </div>

    <div class="relative h-96">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-10">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy-600 mb-2"></div>
          <p class="text-gray-600">Generando simulazione...</p>
        </div>
      </div>

      <Line
        v-if="chartData.labels && !loading"
        :data="chartData"
        :options="chartOptions"
        :key="chartKey"
        class="chart-canvas"
      />

      <div v-if="!chartData.labels && !loading" class="h-full flex items-center justify-center text-gray-500">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p class="mt-4">Imposta i parametri e clicca "Simula Investimento"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
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
import 'chartjs-adapter-date-fns'

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

export default {
  components: { Line },
  
  props: {
    loading: Boolean,
    simulationData: Object,
    finalValue: Number
  },
  
  setup(props) {
    const chartKey = ref(0)
    
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
    
    const chartData = computed(() => {
      if (!props.simulationData || !props.simulationData.datiGrafico) {
        return {}
      }
      
      return {
        labels: props.simulationData.datiGrafico.map(item => new Date(item.date)),
        datasets: [{
          label: 'Valore Investimento',
          data: props.simulationData.datiGrafico.map(item => ({
            x: new Date(item.date),
            y: item.close
          })),
          borderColor: '#7F1D1D',
          backgroundColor: 'rgba(127, 29, 29, 0.1)'
        }]
      }
    })
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
    }
    
    return {
      chartData,
      chartOptions,
      chartKey,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.chart-canvas {
  @apply w-full h-full;
}
</style>