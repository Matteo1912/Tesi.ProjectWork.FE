import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import MercatiPage from '../pages/MercatiPage.vue'
import SimulazioneInvestimento from '../pages/SimulazioneInvestimento.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/mercati',
    name: 'Mercati',
    component: MercatiPage
  },
  {
    path: '/simulazione',
    name: 'Simulazioni',
    component: SimulazioneInvestimento
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router