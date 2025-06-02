<template>
    <section class="py-28 bg-gray-50">
      <div class="container mx-auto px-6">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-burgundy-900 mb-6">
            {{ $t('home.testimonials.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ $t('home.testimonials.subtitle') }}
          </p>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index" 
               class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div class="mb-6">
              <img :src="testimonial.image" :alt="testimonial.name" class="w-full h-48 object-cover rounded-xl mb-4">
              <div class="flex items-center">
                <img :src="testimonial.avatar" :alt="testimonial.name" class="w-12 h-12 rounded-full mr-4 border-2 border-burgundy-500">
                <div>
                  <h4 class="font-bold text-burgundy-900">{{ testimonial.name }}</h4>
                  <p class="text-gray-500">{{ testimonial.position }}</p>
                </div>
              </div>
            </div>
            <p class="text-gray-700 italic">"{{ testimonial.quote }}"</p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const testimonials = [
    {
      name: "Roberto Bianchi",
      position: "CEO, FinTech Solutions",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
      quote: "La qualità dei dati e l'interfaccia intuitiva hanno trasformato il nostro workflow"
    },
    {
      name: "Chiara Rossi",
      position: "Analista Senior, Banca d'Investimento",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1738&q=80",
      quote: "Finalmente una piattaforma che unisce potenza e semplicità d'uso"
    },
    {
      name: "Marco Neri",
      position: "Fondatore, Hedge Fund",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1742&q=80",
      quote: "Gli strumenti di simulazione hanno ridotto i nostri tempi di analisi del 40%"
    }
  ]
  </script>