"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import UserAvatar from "@/components/UserAvatar"
import UserMenu from "@/components/UserMenu"
import { User } from "@/types/User"
import Link from "next/link"
import ToggleThemeBtn from "@/components/ToggleThemeBtn"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const getUserLogged = async (token: string | null) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000/api"
      const res = await fetch(`${backendUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!res.ok) {
        // Si el token es inválido, limpiar localStorage
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        return
      }
      
      const data = await res.json()
      setUser(data.user)
    } catch (err: any) {
      console.error("Error al cargar usuario:", err.message)
      // En caso de error, limpiar localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setShowMenu(false)
    router.push("/")
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      setUser(null)
      return
    }
    
    // Verificar si hay datos de usuario en localStorage como fallback
    const savedUser = localStorage.getItem("user")
    
    if (savedUser && !user) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing saved user:", error)
      }
    }

    // Verificar con el backend (solo si no hay usuario ya cargado)
    if (!user) {
      getUserLogged(token)
    }
    
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
          <ToggleThemeBtn />

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
