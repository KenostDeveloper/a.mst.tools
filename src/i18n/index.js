import { createI18n } from 'vue-i18n'
import ru from './locales/ru.json'

// Create an i18n instance
export const i18n = createI18n({
  locale: 'ru',
  messages: {
    ru: ru
  }
})
