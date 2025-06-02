<template>
    <section class="py-16 bg-burgundy-800 text-white relative">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-burgundy-900 to-burgundy-700 opacity-90"></div>
        <div class="absolute inset-0 bg-pattern opacity-10"></div>
      </div>
      
      <div class="relative z-10 container mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="p-6">
            <div class="text-4xl md:text-5xl font-bold mb-2">10K+</div>
            <div class="text-burgundy-200">{{ $t('home.stats.users') }}</div>
          </div>
          <div class="p-6">
            <div class="text-4xl md:text-5xl font-bold mb-2">98%</div>
            <div class="text-burgundy-200">{{ $t('home.stats.satisfaction') }}</div>
          </div>
          <div class="p-6">
            <div class="text-4xl md:text-5xl font-bold mb-2">5M+</div>
            <div class="text-burgundy-200">{{ $t('home.stats.simulations') }}</div>
          </div>
          <div class="p-6">
            <div class="text-4xl md:text-5xl font-bold mb-2">24/7</div>
            <div class="text-burgundy-200">{{ $t('home.stats.support') }}</div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <style scoped>
  .bg-pattern {
    background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  </style>