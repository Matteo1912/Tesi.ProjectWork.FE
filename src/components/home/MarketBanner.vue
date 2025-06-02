<template>
    <section class="relative h-96 md:h-screen max-h-[800px] overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
        alt="Market Analysis"
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-burgundy-900 to-transparent opacity-80 flex items-end">
        <div class="container mx-auto px-6 pb-20 text-center">
          <h3 class="text-3xl md:text-5xl font-bold text-white mb-6">
            {{ $t('home.market.title') }}
          </h3>
          <button @click="goToMarkets()" class="bg-transparent border-2 border-white hover:bg-white hover:text-burgundy-800 text-white font-bold py-3 px-8 rounded-full text-lg transition-all">
            {{ $t('home.market.cta') }}
          </button>
        </div>
      </div>
    </section>
  </template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToMarkets = () => {
  router.push({ name: 'Mercati' }) 
}
</script>