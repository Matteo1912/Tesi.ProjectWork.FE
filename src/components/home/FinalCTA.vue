<template>
    <section class="relative py-28 bg-burgundy-900 text-white overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-burgundy-800 to-burgundy-600 opacity-95"></div>
      <div class="absolute right-0 top-0 h-full w-1/2 bg-cover bg-center opacity-20" 
           style="background-image: url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')"></div>
      
      <div class="relative z-10 container mx-auto px-6 text-center">
        <h2 class="text-4xl md:text-6xl font-bold mb-8">
          {{ $t('home.cta.title') }}
        </h2>
        <p class="text-xl md:text-2xl text-burgundy-100 mb-12 max-w-3xl mx-auto">
          {{ $t('home.cta.subtitle') }}
        </p>
        <button class="bg-white text-burgundy-700 hover:bg-gray-100 font-bold py-5 px-14 rounded-full text-xl transition-all transform hover:scale-105 shadow-2xl">
          {{ $t('home.cta.button') }}
        </button>
      </div>
    </section>
  </template>