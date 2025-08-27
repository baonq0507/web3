import { createI18n } from 'vue-i18n'
import vi from './locales/vi.json'
import en from './locales/en.json'
import fr from './locales/fr.json'

const messages = {
  vi,
  en,
  fr,
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'vi',
  fallbackLocale: 'en',
  messages,
})

export default i18n
