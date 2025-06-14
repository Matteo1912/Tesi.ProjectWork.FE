<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="text-2xl font-bold text-burgundy-900 mb-4">
        {{ isLoginMode ? 'Accedi' : 'Registrati' }}
      </h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input 
              v-model="form.email"
              @blur="v$.email.$touch()"
              type="email" 
              class="w-full px-4 py-2 rounded-lg border"
              :class="v$.email.$error ? 'border-red-500' : 'border-gray-300'"
            >
            <p v-if="v$.email.$error" class="text-red-500 text-xs mt-1">
              {{ v$.email.$errors[0]?.$message }}
            </p>
          </div>
          
          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password*</label>
            <input 
              v-model="form.password"
              @blur="v$.password.$touch()"
              type="password" 
              class="w-full px-4 py-2 rounded-lg border"
              :class="v$.password.$error ? 'border-red-500' : 'border-gray-300'"
            >
            <p v-if="v$.password.$error" class="text-red-500 text-xs mt-1">
              {{ v$.password.$errors[0]?.$message }}
            </p>
          </div>

          <!-- Campi aggiuntivi registrazione -->
          <template v-if="!isLoginMode">
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username*</label>
              <input 
                v-model="form.username"
                @blur="v$.username.$touch()"
                type="text" 
                class="w-full px-4 py-2 rounded-lg border"
                :class="v$.username.$error ? 'border-red-500' : 'border-gray-300'"
              >
              <p v-if="v$.username.$error" class="text-red-500 text-xs mt-1">
                {{ v$.username.$errors[0]?.$message }}
              </p>
            </div>
            
            <!-- Nome -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
              <input 
                v-model="form.firstName"
                @blur="v$.firstName.$touch()"
                type="text" 
                class="w-full px-4 py-2 rounded-lg border"
                :class="v$.firstName.$error ? 'border-red-500' : 'border-gray-300'"
              >
              <p v-if="v$.firstName.$error" class="text-red-500 text-xs mt-1">
                {{ v$.firstName.$errors[0]?.$message }}
              </p>
            </div>

            <!-- Cognome -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cognome*</label>
              <input 
                v-model="form.lastName"
                @blur="v$.lastName.$touch()"
                type="text" 
                class="w-full px-4 py-2 rounded-lg border"
                :class="v$.lastName.$error ? 'border-red-500' : 'border-gray-300'"
              >
              <p v-if="v$.lastName.$error" class="text-red-500 text-xs mt-1">
                {{ v$.lastName.$errors[0]?.$message }}
              </p>
            </div>

            <!-- Codice Fiscale -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale*</label>
              <input 
                v-model="form.codiceFiscale"
                @blur="v$.codiceFiscale.$touch()"
                type="text" 
                class="w-full px-4 py-2 rounded-lg border"
                :class="v$.codiceFiscale.$error ? 'border-red-500' : 'border-gray-300'"
              >
              <p v-if="v$.codiceFiscale.$error" class="text-red-500 text-xs mt-1">
                {{ v$.codiceFiscale.$errors[0]?.$message }}
              </p>
            </div>
          </template>

          <div class="flex justify-between items-center pt-2">
            <button
              type="button"
              @click="toggleMode"
              class="text-sm text-burgundy-600 hover:text-burgundy-800"
            >
              {{ isLoginMode ? 'Crea un account' : 'Hai già un account? Accedi' }}
            </button>
            
            <button
              type="submit"
              class="bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold py-2 px-4 rounded-lg"
              :disabled="v$.$invalid || loading"
            >
              <span v-if="!loading">{{ isLoginMode ? 'Accedi' : 'Registrati' }}</span>
              <span v-else>Caricamento...</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength, helpers } from '@vuelidate/validators'

export default {
  props: {
    show: Boolean,
    isLoginMode: Boolean
  },
  
  emits: ['submit', 'toggle-mode', 'close'],
  
  setup(props, { emit }) {
    const form = ref({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      codiceFiscale: ''
    })

    const loading = ref(false)

    const rules = computed(() => {
      const baseRules = {
        email: { 
          required: helpers.withMessage('Email obbligatoria', required),
          email: helpers.withMessage('Formato email non valido', email)
        },
        password: {
          required: helpers.withMessage('Password obbligatoria', required),
          minLength: helpers.withMessage('Minimo 8 caratteri', minLength(8)),
          regex: helpers.withMessage(
            'Deve contenere maiuscole, minuscole, numeri e caratteri speciali',
            helpers.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)
          )
        }
      }

      if (!props.isLoginMode) {
        return {
          ...baseRules,
          username: { 
            required: helpers.withMessage('Username obbligatorio', required),
            minLength: helpers.withMessage('Minimo 3 caratteri', minLength(3)),
            maxLength: helpers.withMessage('Massimo 20 caratteri', maxLength(20)),
            regex: helpers.withMessage(
              'Solo lettere, numeri e underscore',
              helpers.regex(/^[a-zA-Z0-9_]+$/)
            )
          },
          firstName: {
            required: helpers.withMessage('Nome obbligatorio', required),
            maxLength: helpers.withMessage('Massimo 50 caratteri', maxLength(50))
          },
          lastName: {
            required: helpers.withMessage('Cognome obbligatorio', required),
            maxLength: helpers.withMessage('Massimo 50 caratteri', maxLength(50))
          },
          codiceFiscale: {
            required: helpers.withMessage('Codice Fiscale obbligatorio', required),
            regex: helpers.withMessage(
              'Codice Fiscale non valido',
              helpers.regex(/^[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]$/)
            )
          }
        }
      }
      
      return baseRules
    })

    const v$ = useVuelidate(rules, form)

    const toggleMode = () => {
      emit('toggle-mode')
    }

    const handleSubmit = async () => {
      v$.value.$touch()
      if (v$.value.$invalid) return
      
      loading.value = true
      try {
        emit('submit', form.value)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      v$,
      loading,
      toggleMode,
      handleSubmit
    }
  }
}
</script>