"use client";

import { Video } from '@/types/Video';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import VideoCard from '@/components/VideoCard';
import VideoSearcher from '@/components/VideoSearcher';
import ChannelMiniCard from '@/components/ChannelMiniCard';

export default function SearchPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [channels, setChannels] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'videos' | 'channels'>('videos');
  const [videoNextPageToken, setVideoNextPageToken] = useState<string | null>(null);
  const [channelNextPageToken, setChannelNextPageToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Búsqueda automática cuando cambia la query
  useEffect(() => {
    if (!query) return;

    // Limpiar resultados antes de buscar
    setVideos([]);
    setChannels([]);
    setVideoNextPageToken(null);
    setChannelNextPageToken(null);

    const searchVideosAndChannels = async () => {
      setLoading(true);
      setError('');

      try {
        // Buscar videos
        const videosResponse = await fetch(`http://localhost:4000/api/youtube/search?q=${encodeURIComponent(query)}&type=video`);
        const videosData = await videosResponse.json();
        setVideos(videosData.items);
        setVideoNextPageToken(videosData.nextPageToken || null);

        // Buscar canales
        const channelsResponse = await fetch(`http://localhost:4000/api/youtube/search?q=${encodeURIComponent(query)}&type=channel`);
        const channelsData = await channelsResponse.json();
        setChannels(channelsData.items);
        setChannelNextPageToken(channelsData.nextPageToken || null);
      } catch (err: any) {
        setError(err.message || 'Error al buscar videos y canales');
      } finally {
        setLoading(false);
      }
    };

    searchVideosAndChannels();
  }, [query]);

  // Cargar más videos
  const loadMoreVideos = async () => {
    if (!videoNextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const response = await fetch(`http://localhost:4000/api/youtube/search?q=${encodeURIComponent(query)}&type=video&pageToken=${videoNextPageToken}`);
      const data = await response.json();
      setVideos((prev) => [...prev, ...data.items]);
      setVideoNextPageToken(data.nextPageToken || null);
    } finally {
      setLoadingMore(false);
    }
  };

  // Cargar más canales
  const loadMoreChannels = async () => {
    if (!channelNextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const response = await fetch(`http://localhost:4000/api/youtube/search?q=${encodeURIComponent(query)}&type=channel&pageToken=${channelNextPageToken}`);
      const data = await response.json();
      setChannels((prev) => [...prev, ...data.items]);
      setChannelNextPageToken(data.nextPageToken || null);
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll handler (desktop y mobile)
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || loading) return;
      // Desktop: scroll global
      if (window.innerWidth >= 1024) {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
          loadMoreVideos();
          loadMoreChannels();
        }
      } else {
        // Mobile: scroll del contenedor
        const el = scrollRef.current;
        if (el && el.getBoundingClientRect().bottom - window.innerHeight < 200) {
          if (activeTab === 'videos') loadMoreVideos();
          if (activeTab === 'channels') loadMoreChannels();
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab, videoNextPageToken, channelNextPageToken, loadingMore, loading]);

  // Usar useCallback para estabilizar las funciones
  const handleVideosChange = useCallback((newVideos: Video[]) => {
    setVideos(newVideos);
  }, []);

  const handleLoadingChange = useCallback((newLoading: boolean) => {
    setLoading(newLoading);
  }, []);

  const handleErrorChange = useCallback((newError: string) => {
    setError(newError);
  }, []);

  const handleQueryChange = useCallback((newQuery: string) => {
    // Actualizar la URL con la nueva query
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-surface-primary text-primary">
      <main className="container mx-auto px-4 py-8">
        {/* Buscador */}
        <VideoSearcher 
          onVideosChange={handleVideosChange}
          onLoadingChange={handleLoadingChange}
          onErrorChange={handleErrorChange}
          onQueryChange={handleQueryChange}
        />

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}

        {/* Tabs solo en mobile */}
        <div className="block lg:hidden mb-6">
          <div className="flex w-full">
            <button
              className={`w-1/2 px-4 py-2 rounded-t-md font-semibold transition-colors text-center ${activeTab === 'videos' ? 'bg-blue-600 text-white' : 'bg-surface-secondary text-primary'}`}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </button>
            <button
              className={`w-1/2 px-4 py-2 rounded-t-md font-semibold transition-colors text-center ${activeTab === 'channels' ? 'bg-blue-600 text-white' : 'bg-surface-secondary text-primary'}`}
              onClick={() => setActiveTab('channels')}
            >
              Canales
            </button>
          </div>
        </div>

        {/* Contenido principal con layout de dos columnas en desktop, tabs en mobile */}
        <div className="max-w-7xl mx-auto" ref={scrollRef}>
          {/* Mobile: mostrar solo el tab activo */}
          <div className="block lg:hidden">
            {activeTab === 'videos' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-primary">
                  Videos para "{query}"
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {videos?.map((video) => (
                    <VideoCard key={video.id.videoId} video={video} formatDate={formatDate} />
                  ))}
                </div>
                {!loading && videos?.length === 0 && query && (
                  <div className="text-center py-12">
                    <p className="text-tertiary text-lg">
                      No se encontraron videos para "{query}"
                    </p>
                  </div>
                )}
                {loadingMore && (
                  <div className="text-center py-4">
                    <p className="text-tertiary text-sm">Cargando más videos...</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'channels' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Canales relacionados
                </h3>
                <div className="space-y-2">
                  {channels?.map((channel) => (
                    <Link
                      key={channel.id.channelId}
                      href={`https://www.youtube.com/channel/${channel.id.channelId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <ChannelMiniCard channel={channel} />
                    </Link>
                  ))}
                </div>
                {!loading && channels?.length === 0 && query && (
                  <div className="bg-surface-secondary border border-theme rounded-lg p-4 mt-4">
                    <p className="text-tertiary text-sm text-center">
                      No se encontraron canales para "{query}"
                    </p>
                  </div>
                )}
                {loadingMore && (
                  <div className="text-center py-4">
                    <p className="text-tertiary text-sm">Cargando más canales...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop: mostrar ambos en columnas */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Columna izquierda - Videos */}
            <div className="lg:col-span-3">
              {videos?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-primary">
                    Videos para "{query}"
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {videos?.map((video) => (
                      <VideoCard key={video.id.videoId} video={video} formatDate={formatDate} />
                    ))}
                  </div>
                </div>
              )}

              {/* Estado vacío para videos */}
              {!loading && videos?.length === 0 && query && (
                <div className="text-center py-12">
                  <p className="text-tertiary text-lg">
                    No se encontraron videos para "{query}"
                  </p>
                </div>
              )}
              {loadingMore && (
                <div className="text-center py-4">
                  <p className="text-tertiary text-sm">Cargando más videos...</p>
                </div>
              )}
            </div>

            {/* Columna derecha - Canales */}
            <div className="lg:col-span-1">
              {channels?.length > 0 && (
                <div className="bg-surface-secondary border border-theme rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-primary">
                    Canales relacionados
                  </h3>
                  
                  <div className="space-y-2">
                    {channels?.map((channel) => (
                      <Link
                        key={channel.id.channelId}
                        href={`https://www.youtube.com/channel/${channel.id.channelId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <ChannelMiniCard channel={channel} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Estado vacío para canales */}
              {!loading && channels?.length === 0 && query && (
                <div className="bg-surface-secondary border border-theme rounded-lg p-4">
                  <p className="text-tertiary text-sm text-center">
                    No se encontraron canales para "{query}"
                  </p>
                </div>
              )}
              {loadingMore && (
                <div className="text-center py-4">
                  <p className="text-tertiary text-sm">Cargando más canales...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading inicial */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-tertiary text-lg">
              Buscando videos y canales...
            </p>
          </div>
        )}

        {/* Sin query */}
        {!query && !loading && (
          <div className="text-center py-12">
            <p className="text-tertiary text-lg">
              No se proporcionó un término de búsqueda
            </p>
          </div>
        )}
      </main>

    </div>
  );
} 