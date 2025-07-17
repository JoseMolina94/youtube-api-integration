"use client";

import { Video } from '@/types/Video';
import { useState, useEffect } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Búsqueda automática al cargar la página
  useEffect(() => {
    const loadInitialVideos = async () => {
      setLoading(true);
      setError('');

      try {
        // Búsqueda por defecto para mostrar videos populares
        const response = await fetch(`http://localhost:4000/api/youtube/search?q=trending`);
        
        if (!response.ok) {
          throw new Error('Error al cargar videos');
        }

        const data = await response.json();
        setVideos(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar videos');
      } finally {
        setLoading(false);
      }
    };

    loadInitialVideos();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/youtube/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Error al buscar videos');
      }

      const data = await response.json();
      setVideos(data);
    } catch (err: any) {
      setError(err.message || 'Error al buscar videos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-surface-primary text-primary">
      
      <main className="container mx-auto px-4 py-8">
        {/* Buscador */}
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-primary">
            Busca videos en YouTube
          </h1>
          
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
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}
        </div>

        {/* Lista de videos */}
        {videos.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-primary">
              {query ? `Resultados para "${query}"` : 'Videos populares'} ({videos.length} videos)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id.videoId}
                  className="bg-surface-secondary border border-theme rounded-lg overflow-hidden shadow-theme-md hover:shadow-theme-lg transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <svg className="w-16 h-16 text-white opacity-0 hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Información del video */}
                  <div className="p-4">
                    <h3 className="font-semibold text-primary mb-2 line-clamp-2">
                      {video.snippet.title}
                    </h3>
                    
                    <p className="text-tertiary text-sm mb-2">
                      {video.snippet.channelTitle}
                    </p>
                    
                    <p className="text-tertiary text-xs mb-3">
                      {formatDate(video.snippet.publishedAt)}
                    </p>
                    
                    <p className="text-secondary text-sm line-clamp-3">
                      {video.snippet.description}
                    </p>

                    {/* Botón para ver video */}
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Ver en YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {!loading && videos.length === 0 && query && (
          <div className="text-center py-12">
            <p className="text-tertiary text-lg">
              No se encontraron videos para "{query}"
            </p>
          </div>
        )}

        {/* Loading inicial */}
        {loading && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-tertiary text-lg">
              Cargando videos populares...
            </p>
          </div>
        )}
      </main>

    </div>
  );
}
