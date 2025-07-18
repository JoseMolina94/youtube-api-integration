"use client";

import { Video } from '@/types/Video';
import { useState, useEffect, useRef } from 'react';
import VideoSearcher from '@/components/VideoSearcher';
import VideoCard from '@/components/VideoCard';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Búsqueda automática al cargar la página
  useEffect(() => {
    const loadInitialVideos = async () => {
      setLoading(true);
      setError('');
      setNextPageToken(null);
      try {
        // Búsqueda por defecto para mostrar videos populares
        const response = await fetch(`http://localhost:4000/api/youtube/search?q=trending`);
        if (!response.ok) {
          throw new Error('Error al cargar videos');
        }
        const data = await response.json();
        setVideos(data.items);
        setNextPageToken(data.nextPageToken || null);
      } catch (err: any) {
        setError(err.message || 'Error al cargar videos');
      } finally {
        setLoading(false);
      }
    };
    loadInitialVideos();
  }, []);

  // Buscar videos por query
  const handleSearch = async (query: string) => {
    setLoading(true);
    setError('');
    setNextPageToken(null);
    try {
      const response = await fetch(`http://localhost:4000/api/youtube/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Error al buscar videos');
      }
      const data = await response.json();
      setVideos(data.items);
      setNextPageToken(data.nextPageToken || null);
    } catch (err: any) {
      setError(err.message || 'Error al buscar videos');
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || loading) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMoreVideos();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, loading, nextPageToken]);

  // Cargar más videos
  const loadMoreVideos = async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const response = await fetch(`http://localhost:4000/api/youtube/search?q=${encodeURIComponent(currentQuery || 'trending')}&pageToken=${nextPageToken}`);
      const data = await response.json();
      setVideos((prev) => [...prev, ...data.items]);
      setNextPageToken(data.nextPageToken || null);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-primary text-primary">
      <main className="container mx-auto px-4 py-8" ref={scrollRef}>
        {/* Buscador */}
        <VideoSearcher 
          onVideosChange={(videos) => setVideos(videos)}
          onLoadingChange={setLoading}
          onErrorChange={setError}
          onQueryChange={(query) => {
            setCurrentQuery(query);
            handleSearch(query);
          }}
          disableInitialSearch={true}
        />

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}

        {/* Lista de videos */}
        {videos?.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-primary">
              {currentQuery ? `Resultados para "${currentQuery}"` : 'Videos populares'} ({videos.length} videos)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos?.map((video) => (
                <VideoCard key={video.id.videoId} video={video} formatDate={formatDate} />
              ))}
            </div>
            {loadingMore && (
              <div className="text-center py-4">
                <p className="text-tertiary text-sm">Cargando más videos...</p>
              </div>
            )}
          </div>
        )}

        {/* Estado vacío */}
        {!loading && videos?.length === 0 && currentQuery && (
          <div className="text-center py-12">
            <p className="text-tertiary text-lg">
              No se encontraron videos para "{currentQuery}"
            </p>
          </div>
        )}

        {/* Loading inicial */}
        {loading && videos?.length === 0 && (
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
