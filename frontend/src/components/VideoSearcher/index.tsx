"use client";

import { Video } from '@/types/Video';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface VideoSearcherProps {
  onVideosChange: (videos: Video[]) => void;
  onLoadingChange: (loading: boolean) => void;
  onErrorChange: (error: string) => void;
  onQueryChange: (query: string) => void;
  disableInitialSearch?: boolean;
}

export default function VideoSearcher({ 
  onVideosChange, 
  onLoadingChange, 
  onErrorChange,
  onQueryChange,
  disableInitialSearch = false
}: VideoSearcherProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q');

  // Búsqueda automática al cargar la página (solo si no hay query en la URL y no está deshabilitada)
  useEffect(() => {
    if (disableInitialSearch) return;
    // Solo ejecutar la búsqueda inicial si estamos en la página principal (sin query en URL)
    if (urlQuery) return;

    const loadInitialVideos = async () => {
      onLoadingChange(true);
      onErrorChange('');

      try {
        // Búsqueda por defecto para mostrar videos populares
        const response = await fetch(`http://localhost:4000/api/youtube/search?q=trending`);
        
        if (!response.ok) {
          throw new Error('Error al cargar videos');
        }

        const data = await response.json();
        onVideosChange(data.items); // <-- Corregido aquí
      } catch (err: any) {
        onErrorChange(err.message || 'Error al cargar videos');
      } finally {
        onLoadingChange(false);
      }
    };

    loadInitialVideos();
  }, [urlQuery, onVideosChange, onLoadingChange, onErrorChange, disableInitialSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Redirigir a la página de búsqueda con la query como parámetro
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">      
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar videos..."
          className="flex-1 border border-theme bg-surface-secondary text-primary px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-tertiary"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
