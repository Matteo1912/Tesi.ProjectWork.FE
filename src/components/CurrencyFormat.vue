<template>
  <span>{{ formattedValue }}</span>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    value: {
      type: [Number, String],
      required: true
    }
  },
  
  setup(props) {
    const formattedValue = computed(() => {
      return new Intl.NumberFormat('it-IT', { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(Number(props.value))
    })
    
    return {
      formattedValue
    }
  }
}
</script>