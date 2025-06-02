<template>
  <div class="min-h-screen bg-white overflow-hidden">
    <HeroSection />
    <StatsSection />
    <FeaturesSection />
    <MarketBanner />
    <TestimonialsSection />
    <FinalCTA />
  </div>
</template>

<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import StatsSection from '@/components/home/StatsSection.vue'
import FeaturesSection from '@/components/home/FeaturesSection.vue'
import MarketBanner from '@/components/home/MarketBanner.vue'
import TestimonialsSection from '@/components/home/TestimonialsSection.vue'
import FinalCTA from '@/components/home/FinalCTA.vue'
</script>