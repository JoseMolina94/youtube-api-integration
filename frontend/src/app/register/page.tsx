"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/types/User";

export default function RegisterPage() {
  const router = useRouter();
  const DEFAULT_USER: User = {
    name: "",
    email: "",
    password: "",
  }
  const [formData, setFormData] = useState<User>(DEFAULT_USER);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Error en el registro");
        setLoading(false);
        return;
      }

      alert("¡Registro realizado con éxito!")
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Error en la conexión con el servidor");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-surface-primary text-primary p-8 md:shadow-theme-lg rounded-xl border-theme">
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

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </form>

      <div className="mt-8 w-full text-center">
        <Link href='/login'>
          <span className="underline text-blue-500 hover:text-blue-600 cursor-pointer text-sm transition-colors">
            ¿Ya tienes cuenta?, inicia sesión aquí
          </span>
        </Link>
      </div>
    </div>
  );
}
