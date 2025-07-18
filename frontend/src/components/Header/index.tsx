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
