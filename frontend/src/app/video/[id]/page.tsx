"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VideoCard from '@/components/VideoCard';
import { Video } from '@/types/Video';

export default function VideoPlayerPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [related, setRelated] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchVideoAndRelated = async () => {
      setLoading(true);
      setError('');
      try {
        // Obtener detalles del video
        const videoRes = await fetch(`http://localhost:4000/api/youtube/video?id=${id}`);
        const videoData = await videoRes.json();
        setVideo(videoData);
        // Obtener videos relacionados
        const relatedRes = await fetch(`http://localhost:4000/api/youtube/related?id=${id}`);
        const relatedData = await relatedRes.json();
        setRelated(relatedData.items);
      } catch (err: any) {
        setError('Error al cargar el video o los recomendados');
      } finally {
        setLoading(false);
      }
    };
    fetchVideoAndRelated();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-tertiary">Cargando video...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }
  if (!video) {
    return <div className="text-center py-12 text-tertiary">Video no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-surface-primary text-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Reproductor de video */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${id}?autoplay=1`}
              title={video.snippet?.title || 'YouTube Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              frameBorder={0}
            />
          </div>
          <h1 className="text-2xl font-bold mt-6 mb-2">{video.snippet?.title}</h1>
          <p className="text-tertiary text-sm mb-2">{video.snippet?.channelTitle} • {formatDate(video.snippet?.publishedAt)}</p>
          <p className="text-secondary text-base mb-4 line-clamp-4">{video.snippet?.description}</p>
        </div>
        {/* Videos recomendados */}
        <h2 className="text-xl font-semibold mb-4 text-primary">Videos recomendados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {related?.map((v) => (
            <VideoCard key={v.id.videoId} video={v} formatDate={formatDate} />
          ))}
        </div>
        {related?.length === 0 && (
          <div className="text-center py-12 text-tertiary">No hay videos recomendados.</div>
        )}
      </div>
    </div>
  );
} 