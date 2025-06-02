<template>
    <section class="relative h-[600px] flex items-center justify-center bg-gray-900 overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1468254095679-bbcba94a7066?ixlib=rb-4.0.3&auto=format&fit=crop&w=2160&q=80" 
        alt="Financial Markets"
        class="absolute inset-0 w-full h-full object-cover opacity-50"
      >
      
      <div class="relative z-10 container mx-auto px-6 text-center">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {{ $t('home.hero.title') }}
          </h1>
          <p class="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
            {{ $t('home.hero.subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-6">
            <button class="bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all transform hover:scale-105 shadow-xl">
              {{ $t('home.hero.cta_primary') }}
            </button>
            <button class="bg-transparent border-2 border-white hover:bg-white hover:text-burgundy-800 text-white font-bold py-4 px-10 rounded-full text-lg transition-all">
              {{ $t('home.hero.cta_secondary') }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  // Il componente utilizza automaticamente la localizzazione tramite $t
  </script>