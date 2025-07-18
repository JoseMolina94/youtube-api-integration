"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  error: string;
  addFavorite: (videoId: string) => Promise<void>;
  removeFavorite: (videoId: string) => Promise<void>;
  reloadFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFavorites = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:4000/api';
      const res = await fetch(`${backendUrl}/user/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('No se pudieron obtener los favoritos');
      const data = await res.json();
      setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar favoritos');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const addFavorite = async (videoId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:4000/api';
    const res = await fetch(`${backendUrl}/user/favorites/${videoId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setFavorites((prev) => [...prev, videoId]);
    }
  };

  const removeFavorite = async (videoId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:4000/api';
    const res = await fetch(`${backendUrl}/user/favorites/${videoId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setFavorites((prev) => prev.filter((id) => id !== videoId));
    }
  };

  const reloadFavorites = fetchFavorites;

  return (
    <FavoritesContext.Provider value={{ favorites, loading, error, addFavorite, removeFavorite, reloadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  }
  return context;
} 