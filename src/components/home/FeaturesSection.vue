<template>
    <section class="py-28 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-burgundy-900 mb-6">
            {{ $t('home.features.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ $t('home.features.subtitle') }}
          </p>
        </div>
  
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
              alt="Dashboard"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
            >
          </div>
          <div>
            <h3 class="text-3xl font-bold text-burgundy-900 mb-6">{{ $t('home.features.dashboard_title') }}</h3>
            <p class="text-lg text-gray-700 mb-8">
              {{ $t('home.features.dashboard_desc') }}
            </p>
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

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, messages } = useI18n()

const featureItems = computed(() => {
  return messages.value[locale.value].home.features.items || []
})
</script>