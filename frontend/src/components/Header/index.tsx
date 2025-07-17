"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import UserAvatar from "@/components/UserAvatar"
import UserMenu from "@/components/UserMenu"
import { User } from "@/types/User"
import Link from "next/link"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const getUserLogged = (token: string | null) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Token inválido o expirado")
        const data = await res.json()
        setUser(data.user)
      })
      .catch((err) => {
        console.error("Error al cargar usuario:", err.message)
        setUser(null)
      })
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setShowMenu(false)
    router.push("/login")
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) return
    if (!user) getUserLogged(token)

    setShowMenu(false)

  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // --- Theme toggle logic ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (saved) return saved
      // fallback to system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
      }
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }
  // --- end theme toggle logic ---

  return (
    <header className="w-full bg-surface-primary text-primary py-4 px-2 md:px-6 shadow-theme-md border-b border-theme relative">
      <div className="flex justify-between items-center">
        <Link href={'/'}>
          <h1 className="text-2xl md:text-4xl font-bold cursor-pointer shrink-0 text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Video Store TV
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {/* Theme toggle button */}
          <button
            aria-label="Cambiar tema"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-surface-secondary transition-colors focus:outline-none border border-theme"
            title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            type="button"
          >
            {theme === 'dark' ? (
              // Luna (dark) alternativa
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12.79A9 9 0 1111.21 3c.09 0 .18 0 .27.01A7 7 0 0021 12.79z"
                />
              </svg>
            ) : (
              // Sol (light)
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <circle cx="12" cy="12" r="5" />
                <g>
                  <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </g>
              </svg>
            )}
          </button>
          {/* Fin theme toggle button */}
          {user ? (
            <div ref={menuRef} className="relative">
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              >
                <div className="text-sm hidden md:block text-primary text-right">
                  <p>
                    Bienvenid@, 
                    <span className="font-medium capitalize"> {user.name} </span>
                  </p>
                  <span className="text-xs text-tertiary">{user.email}</span>
                </div>
                <UserAvatar />
              </div>

              {showMenu && (
                <UserMenu 
                  user={user}
                  handleLogout={handleLogout} 
                />
              )}
            </div>
          ) : (
            <Link href='/login'>
              <div 
                className="cursor-pointer hidden md:block border border-theme px-3 py-1 rounded-full bg-surface-secondary hover:bg-surface-tertiary transition-colors text-primary"
              >
                Iniciar Sesión
              </div>

              <div className="cursor-pointer text-xs md:hidden block border border-theme px-3 py-1 rounded-full bg-surface-secondary hover:bg-surface-tertiary transition-colors text-primary">
                Sesión
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
