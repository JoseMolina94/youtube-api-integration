"use client"

import { useState, useEffect } from "react"
import { MoonIcon, SunIcon } from "@/components/Icons"

export default function ToggleThemeBtn() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === null) {
        // Inicialización: leer de localStorage o preferencia del sistema
        const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
        if (saved) {
          setTheme(saved)
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setTheme('dark')
        } else {
          setTheme('light')
        }
      } else {
        // Aplicar tema y guardar en localStorage
        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.setAttribute('data-theme', 'light')
        }
        localStorage.setItem('theme', theme)
      }

      setLoading(false)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (!loading && (
    <button
      aria-label="Cambiar tema"
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-surface-secondary transition-colors focus:outline-none border border-theme"
      title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      type="button"
    >
      {theme === 'dark' ? (
        <MoonIcon />
      ) : (
        <SunIcon />
      )}
    </button>
  ))
}