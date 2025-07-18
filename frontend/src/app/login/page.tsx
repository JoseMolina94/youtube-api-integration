"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type LoginFormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [loginFormState, setLoginFormState] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  // Guardar la última URL visitada antes de llegar a login
  useEffect(() => {
    const lastUrl = localStorage.getItem('lastVisitedUrl');
    const from = window.location.pathname + window.location.search;
    if (!lastUrl || lastUrl === '/login' || lastUrl === '/register') {
      if (from !== '/login' && from !== '/register') {
        localStorage.setItem('lastVisitedUrl', from);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLoginFormState({ ...loginFormState, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000/api"
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginFormState),
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.message || "Error al iniciar sesión")

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Redirigir a la última URL visitada si existe y no es login/register
      const lastUrl = localStorage.getItem('lastVisitedUrl');
      if (lastUrl && lastUrl !== '/login' && lastUrl !== '/register') {
        localStorage.removeItem('lastVisitedUrl');
        router.push(lastUrl);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-surface-secondary text-primary flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface-primary text-primary p-6 md:p-8 md:shadow-theme-lg rounded-xl border-theme">

        <h2 className="text-center text-2xl font-bold mb-4 text-primary">Iniciar sesión</h2>

      {
        error && 
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      }
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-semibold text-primary">Correo electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="w-full border border-theme bg-surface-secondary text-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-tertiary"
            value={loginFormState.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-primary">Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full border border-theme bg-surface-secondary text-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-tertiary"
            value={loginFormState.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Entrar
        </button>
      </form>

      <div className="mt-8 w-full text-center" >
        <Link href='/register'>
          <span className="underline text-blue-500 hover:text-blue-600 cursor-pointer text-sm transition-colors" >
            ¿No tienes cuenta?, puedes crear una aquí
          </span>
        </Link>
      </div>
    </div>
    </div>
  )
}
