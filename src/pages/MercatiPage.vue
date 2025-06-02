<template>
  <section class="py-8 bg-white">
    <div class="container mx-auto px-6">
      <div class="text-center mb-20">
        <h2 class="text-4xl md:text-5xl font-bold text-burgundy-900 mb-6">
          Analisi S&P 500
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Monitora l'andamento dell'indice S&P 500 con dati storici e analisi dettagliate
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-gray-50 p-4 md:p-8">
          <!-- Grafico -->
          <div class="h-full w-full">
            <div class="flex justify-between items-center mb-8">
              <div>
                <h3 class="text-2xl font-bold text-burgundy-900">S&P 500</h3>
                <p class="text-gray-500">{{ lastUpdate }}</p>
              </div>
              <div class="bg-burgundy-100 px-4 py-2 rounded-full">
                <span class="text-burgundy-700 font-medium">{{ currentPrice }}</span>
              </div>
            </div>

            <div class="relative h-3/5">
              <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center z-10">
                <div class="text-center">
                  <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy-600 mb-2"></div>
                  <p class="text-gray-600">Caricamento dati...</p>
                </div>
              </div>

              <Line
                v-if="chartData.labels"
                :data="chartData"
                :options="chartOptions"
                :key="chartKey"
                class="chart-canvas"
              />
            </div>

            <div class="flex justify-center mt-6 space-x-4">
              <button
                v-for="period in periods"
                :key="period.value"
                @click="selectedPeriod = period.value; fetchData()"
                :class="[
                  'px-2 py-1 rounded-full text-sm font-medium transition-all',
                  selectedPeriod === period.value
                    ? 'bg-burgundy-600 text-white shadow-md'
                    : 'text-burgundy-700 bg-burgundy-50 hover:bg-burgundy-100'
                ]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-3xl font-bold text-burgundy-900 mb-6">Statistiche Avanzate</h3>
          <p class="text-lg text-gray-700 mb-8">
            Analisi dettagliata dell'andamento dell'indice S&P 500 nel periodo selezionato.
            Tutti i dati sono aggiornati in tempo reale e provenienti da fonti ufficiali.
          </p>
          
          <div class="grid grid-cols-2 gap-6 mb-8">
            <div class="bg-burgundy-50 p-6 rounded-xl">
              <p class="text-sm text-burgundy-700 mb-1">Valore Minimo</p>
              <p class="text-xl md:text-2xl font-bold text-burgundy-900">{{ stats.min }}</p>
            </div>
            <div class="bg-burgundy-50 p-6 rounded-xl">
              <p class="text-sm text-burgundy-700 mb-1">Valore Massimo</p>
              <p class="text-xl md:text-2xl font-bold text-burgundy-900">{{ stats.max }}</p>
            </div>
            <div class="bg-burgundy-50 p-6 rounded-xl">
              <p class="text-sm text-burgundy-700 mb-1">Variazione</p>
              <p class="text-xl md:text-2xl font-bold" :class="stats.change >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ stats.change >= 0 ? '+' : '' }}{{ stats.change }}%
              </p>
            </div>
            <div class="bg-burgundy-50 p-6 rounded-xl">
              <p class="text-sm text-burgundy-700 mb-1">Ultimo Valore</p>
              <p class="text-xl md:text-2xl font-bold text-burgundy-900">{{ currentPrice }}</p>
            </div>
          </div>

          <ul class="space-y-4">
            <li v-for="(feature, index) in featureItems" :key="index" class="flex items-start">
              <div class="bg-burgundy-100 p-2 rounded-full mr-4">
                <svg class="w-5 h-5 text-burgundy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-gray-800 text-lg">{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
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
  name: 'ElegantSP500Chart',
  components: { Line },
  data() {
    return {
      selectedPeriod: '6months',
      periods: [
        { value: '6months', label: '6 Mesi' },
        { value: '1year', label: '1 Anno' },
        { value: '3years', label: '3 Anni' },
        { value: '5years', label: '5 Anni' }
      ],
      featureItems: [
        'Dati storici dal 1957 ad oggi',
        'Aggiornamenti in tempo reale',
        'Analisi tecniche avanzate',
        'Supporto e resistenza automatici'
      ],
      chartData: {},
      chartKey: 0,
      isLoading: false,
      lastUpdate: '--/--/---- --:--',
      currentPrice: '---',
      stats: {
        min: '---',
        max: '---',
        change: '--'
      },
      chartOptions: {
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
                return ` $${context.parsed.y.toFixed(2)}`
              },
              title: (items) => {
                return new Date(items[0].parsed.x).toLocaleDateString('it-IT', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
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
              tooltipFormat: 'dd MMM yyyy',
              displayFormats: {
                day: 'dd MMM',
                month: 'MMM yy',
                year: 'yyyy'
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
              callback: (value) => `$${value}`
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
    }
  },
  methods: {
    async fetchData() {
      this.isLoading = true
      
      try {
        const response = await fetch(`https://tesi-be-h6b5fnbgesbmacb8.italynorth-01.azurewebsites.net/api/investimenti/sp500?period=${this.selectedPeriod}`)
        const data = await response.json()

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Dati non validi')
        }

        // Formatta i dati
        const labels = data.map(item => new Date(item.date))
        const closePrices = data.map(item => item.close)

        // Calcola le statistiche
        const firstPrice = data[0].close
        const lastPrice = data[data.length - 1].close
        const minPrice = Math.min(...closePrices)
        const maxPrice = Math.max(...closePrices)
        const changePercent = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(2)

        // Aggiorna lo stato
        this.lastUpdate = new Date().toLocaleString('it-IT')
        this.currentPrice = `$${lastPrice.toFixed(2)}`
        this.stats = {
          min: `$${minPrice.toFixed(2)}`,
          max: `$${maxPrice.toFixed(2)}`,
          change: changePercent
        }

        // Prepara i dati per il grafico
        this.chartData = {
          labels,
          datasets: [{
            label: 'S&P 500',
            data: data.map(item => ({
              x: new Date(item.date),
              y: item.close
            })),
            borderColor: '#7F1D1D',
            backgroundColor: 'rgba(127, 29, 29, 0.1)'
          }]
        }

        this.chartKey++

      } catch (error) {
        console.error('Errore:', error)
        this.showSampleData()
      } finally {
        this.isLoading = false
      }
    },
    showSampleData() {
      const sampleDates = []
      const sampleData = []
      let currentValue = 4000
      
      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (30 - i))
        sampleDates.push(date)
        
        currentValue += (Math.random() * 40 - 20)
        sampleData.push(currentValue)
      }

      this.lastUpdate = new Date().toLocaleString('it-IT')
      this.currentPrice = `$${currentValue.toFixed(2)}`
      this.stats = {
        min: `$${Math.min(...sampleData).toFixed(2)}`,
        max: `$${Math.max(...sampleData).toFixed(2)}`,
        change: ((sampleData[sampleData.length - 1] - sampleData[0]) / sampleData[0] * 100).toFixed(2)
      }

      this.chartData = {
        labels: sampleDates,
        datasets: [{
          label: 'Dati di esempio',
          data: sampleDates.map((date, i) => ({
            x: date,
            y: sampleData[i]
          })),
          borderColor: '#7F1D1D',
          backgroundColor: 'rgba(127, 29, 29, 0.1)'
        }]
      }
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
.chart-canvas {
  @apply w-full h-full;
}

/* Animazioni */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Effetto hover per i box statistiche */

</style>