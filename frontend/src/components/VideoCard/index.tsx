import { Video } from '@/types/Video';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { StarIcon, ClockIcon } from '@/components/Icons';
import { useToast } from '@/contexts/ToastContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface VideoCardProps {
  video: Video;
  formatDate: (dateString: string) => string;
}

export default function VideoCard({ video, formatDate }: VideoCardProps) {
  const channelId = video.id.channelId || video.snippet.channelId;
  const videoId = video.id.videoId;
  const { showToast } = useToast();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [isSeeLater, setIsSeeLater] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingSeeLater, setLoadingSeeLater] = useState(false);

  // Cargar estado inicial de ver más tarde desde backend si hay token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !videoId) return;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:4000/api';
    fetch(`${backendUrl}/user/see-later`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.see_later)) setIsSeeLater(data.see_later.includes(videoId));
      });
  }, [videoId]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoId) return;
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Debes iniciar sesión para guardar favoritos', 'warning');
      return;
    }
    setLoadingFav(true);
    try {
      if (videoId) {
        const isFav = favorites.includes(videoId);
        if (isFav) {
          await removeFavorite(videoId);
          showToast('Eliminado de favoritos', 'success');
        } else {
          await addFavorite(videoId);
          showToast('Agregado a favoritos', 'success');
        }
      }
    } catch {
      showToast('Error al actualizar favoritos', 'error');
    } finally {
      setLoadingFav(false);
    }
  };

  const handleSeeLater = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoId) return;
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Debes iniciar sesión para guardar en ver más tarde', 'warning');
      return;
    }
    setLoadingSeeLater(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:4000/api';
    try {
      const method = isSeeLater ? 'DELETE' : 'POST';
      const res = await fetch(`${backendUrl}/user/see-later/${videoId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al actualizar ver más tarde');
      setIsSeeLater(!isSeeLater);
      showToast(isSeeLater ? 'Eliminado de ver más tarde' : 'Agregado a ver más tarde', 'success');
    } catch {
      showToast('Error al actualizar ver más tarde', 'error');
    } finally {
      setLoadingSeeLater(false);
    }
  };

  // Solo renderizar videos
  return (
    <Link href={`/video/${video.id.videoId}`} className="block h-full">
      <div
        className="bg-surface-secondary border border-theme rounded-lg overflow-hidden shadow-theme-md hover:shadow-theme-lg transition-shadow cursor-pointer h-full flex flex-col"
      >
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={video.snippet.thumbnails.medium?.url}
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
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="font-semibold text-primary line-clamp-2">
              {video.snippet.title}
            </h3>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleFavorite}
                disabled={loadingFav}
                title={videoId && favorites.includes(videoId) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                className={`rounded-full p-1 transition-colors ${videoId && favorites.includes(videoId) ? 'text-yellow-400' : 'text-tertiary hover:text-yellow-400'} ${loadingFav ? 'opacity-50 cursor-wait' : ''}`}
              >
                <StarIcon filled={!!(videoId && favorites.includes(videoId))} />
              </button>
              <button
                onClick={handleSeeLater}
                disabled={loadingSeeLater}
                title={isSeeLater ? 'Quitar de ver más tarde' : 'Agregar a ver más tarde'}
                className={`rounded-full p-1 transition-colors ${isSeeLater ? 'text-blue-400' : 'text-tertiary hover:text-blue-400'} ${loadingSeeLater ? 'opacity-50 cursor-wait' : ''}`}
              >
                <ClockIcon filled={isSeeLater} />
              </button>
            </div>
          </div>
          <span
            className="hover:underline text-blue-500 cursor-pointer text-sm mb-2 w-fit"
            onClick={e => {
              e.stopPropagation();
              if (channelId) window.location.href = `/channel/${channelId}`;
            }}
          >
            {video.snippet.channelTitle}
          </span>
          <p className="text-tertiary text-xs mb-3">
            {formatDate(video.snippet.publishedAt)}
          </p>
          <p className="text-secondary text-sm line-clamp-3 flex-1">
            {video.snippet.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
