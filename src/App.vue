<template>
  <div class="bg-gray-50 min-h-screen text-gray-800">
    <Header/>
    <main>
      <RouterView/>
    </main>
  </div>
</template>

<script>
import { RouterView } from 'vue-router';
import Header from './components/Header.vue'

export default {
  components: { Header },
}
</script>