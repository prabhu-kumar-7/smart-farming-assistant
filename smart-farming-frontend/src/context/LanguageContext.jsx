import { createContext, useContext, useState } from 'react'
import translations from '../i18n/translations'

// Create context
const LanguageContext = createContext()

// Provider wraps entire app
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('english')

  // t = current translation object
  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook — use this in every component
export function useLanguage() {
  return useContext(LanguageContext)
}