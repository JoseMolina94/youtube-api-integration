"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ItemCard from '@/components/ItemCard';
import { Video } from '@/types/Video';

export default function ChannelDetailPage() {
  const { id } = useParams();
  const [channel, setChannel] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchChannelAndVideos = async () => {
      setLoading(true);
      setError('');
      try {
        // Obtener detalles del canal
        const channelRes = await fetch(`http://localhost:4000/api/youtube/channel?id=${id}`);
        const channelData = await channelRes.json();
        setChannel(channelData);
        // Obtener videos del canal
        const videosRes = await fetch(`http://localhost:4000/api/youtube/search?q=&type=video&channelId=${id}`);
        const videosData = await videosRes.json();
        setVideos(videosData.items);
      } catch (err: any) {
        setError('Error al cargar el canal o sus videos');
      } finally {
        setLoading(false);
      }
    };
    fetchChannelAndVideos();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-tertiary">Cargando canal...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }
  if (!channel) {
    return <div className="text-center py-12 text-tertiary">Canal no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-surface-primary text-primary">
      {/* Banner */}
      {channel.banner ? (
        <div className="relative w-full h-40 md:h-60 bg-cover bg-center" style={{ backgroundImage: `url(${channel.banner})` }}>
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
        </div>
      ) : (
        <div className="w-full h-40 md:h-60 relative">
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        {/* Avatar y nombre */}
        <div className="flex relative z-[1] items-center gap-6 mb-8">
          <img
            src={channel.avatar}
            alt={channel.title}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg -mt-12 bg-white"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{channel.title}</h1>
            <p className="text-tertiary text-sm mb-2 line-clamp-2">{channel.description}</p>
          </div>
        </div>
        {/* Lista de videos */}
        <h2 className="text-2xl font-semibold mb-6 text-primary">Videos del canal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos?.map((video) => (
            <ItemCard key={video.id.videoId} video={video} formatDate={formatDate} />
          ))}
        </div>
        {videos?.length === 0 && (
          <div className="text-center py-12 text-tertiary">Este canal no tiene videos públicos.</div>
        )}
      </div>
    </div>
  );
} 