<template>
  <header class="bg-white sticky top-0 z-50 shadow-lg transition-all duration-300 hover:shadow-xl">
    <div class="container mx-auto px-6 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <a href="/" class="flex items-center space-x-3 group" @click.prevent="navigate('/')">
          <div class="relative">
            <img src="@/assets/svg/logo.svg" alt="Logo" 
                 class="w-12 h-12 transition-all duration-500 group-hover:rotate-12" />
            <div class="absolute -inset-1 bg-red-100 rounded-full opacity-0 group-hover:opacity-100 
                        blur-sm transition-opacity duration-300"></div>
          </div>
          <span class="text-2xl font-extrabold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            InvestSim
          </span>
        </a>
      </div>
      <nav class="hidden md:block md:pr-20">
        <ul class="flex items-center space-x-1">
          <li v-for="item in menuItems" :key="item.id" class="relative group">
            <a href="#" 
               @click.prevent="navigate(item.url)"
               class="flex items-center px-4 py-3 rounded-xl transition-all duration-300"
               :class="{
                 'text-red-600 bg-red-50': isActive(item),
                 'text-gray-700 hover:text-red-500 hover:bg-red-50': !isActive(item)
               }">
              <img :src="getIconPath(item.icon)" :alt="item.label" class="w-5 h-5 mr-2" />
              <span class="font-medium">{{ item.label }}</span>
              <span v-if="isActive(item)" class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-red-600 rounded-full"></span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center space-x-4">        
        <button @click="toggleMenu" class="md:hidden p-2 rounded-xl hover:bg-gray-100 focus:outline-none transition-all">
          <img :src="menuIcon" alt="Menu" class="w-6 h-6 transition-transform duration-300" :class="{'rotate-90': menuOpen}" />
        </button>
      </div>
    </div>

    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="menuOpen" class="md:hidden bg-white shadow-xl rounded-b-2xl overflow-hidden">
        <ul class="flex flex-col py-2 px-4">
          <li v-for="item in menuItems" :key="item.id">
            <a href="#"
               @click.prevent="navigate(item.url)"
               class="flex items-center px-4 py-3 rounded-lg transition-all duration-300"
               :class="{
                 'text-red-600 bg-red-50': isActive(item),
                 'text-gray-700 hover:text-red-500 hover:bg-red-50': !isActive(item)
               }">
              <img :src="getIconPath(item.icon)" :alt="item.label" class="w-5 h-5 mr-3" />
              <span class="font-medium">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import menuIcon from '@/assets/svg/menu.svg'
import homeIcon from '@/assets/svg/home.svg'
import investmentIcon from '@/assets/svg/investment.svg'

const currentPath = ref(window.location.pathname)
const menuOpen = ref(false)

const menuItems = [
  { id: 1, label: 'Home', url: '/', icon: 'home' },
  { id: 2, label: 'Investimenti', url: '/simulazione', icon: 'investment' },
]
// Mappa delle icone
const iconMap = {
  home: homeIcon,
  investment: investmentIcon
}

const getIconPath = (iconName) => {
  return iconMap[iconName] || ''
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const isActive = (item) => {
  return currentPath.value === item.url
}

const navigate = (url) => {
  currentPath.value = url
  window.history.pushState({}, '', url)
  menuOpen.value = false
  window.dispatchEvent(new PopStateEvent('popstate'))
}

window.addEventListener('popstate', () => {
  currentPath.value = window.location.pathname
})

const clickOutside = (event) => {
  if (menuOpen.value && !event.target.closest('header')) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', clickOutside)
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
