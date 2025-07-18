"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/types/User";
import { useToast } from "@/contexts/ToastContext";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  // Guardar la última URL visitada antes de llegar a register
  useEffect(() => {
    const lastUrl = localStorage.getItem('lastVisitedUrl');
    const from = window.location.pathname + window.location.search;
    if (!lastUrl || lastUrl === '/login' || lastUrl === '/register') {
      if (from !== '/login' && from !== '/register') {
        localStorage.setItem('lastVisitedUrl', from);
      }
    }
  }, []);
  const DEFAULT_USER: User = {
    name: "",
    email: "",
    password: "",
  }
  const [formData, setFormData] = useState<User>(DEFAULT_USER);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000/api"
      const res = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        showToast(errorData.message || "Error en el registro", "error");
        setLoading(false);
        return;
      }

      showToast("¡Registro realizado con éxito!", "success");
      // Redirigir a la última URL visitada si existe y no es login/register
      const lastUrl = localStorage.getItem('lastVisitedUrl');
      if (lastUrl && lastUrl !== '/login' && lastUrl !== '/register') {
        localStorage.removeItem('lastVisitedUrl');
        router.push(lastUrl);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      showToast("Error en la conexión con el servidor", "error");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-80px)] bg-surface-secondary text-primary flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface-primary text-primary p-6 md:p-8 md:shadow-theme-lg rounded-xl border-theme">
          <h1 className="text-2xl font-bold mb-6 text-center text-primary">Registro</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              className="w-full border border-theme bg-surface-secondary text-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-tertiary"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className="w-full border border-theme bg-surface-secondary text-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-tertiary"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="w-full border border-theme bg-surface-secondary text-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-tertiary"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>


          </form>

          <div className="mt-8 w-full text-center">
            <Link href='/login'>
              <span className="underline text-blue-500 hover:text-blue-600 cursor-pointer text-sm transition-colors">
                ¿Ya tienes cuenta?, inicia sesión aquí
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
