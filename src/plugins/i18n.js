import { createI18n } from 'vue-i18n'
import it from '@/locals/it.json'
import en from '@/locals/en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'it', 
  fallbackLocale: 'en',
  messages: { it, en }
})

export default i18n