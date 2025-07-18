"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import VideoCard from '@/components/VideoCard';
import { Video } from '@/types/Video';

const PAGE_SIZE = 10;

export default function SeeLaterPage() {
  const router = useRouter();
  const [seeLaterIds, setSeeLaterIds] = useState<string[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);

  // Obtener todos los IDs de ver más tarde al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    const fetchSeeLaterIds = async () => {
      setLoading(true);
      setError("");
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000/api";
        const res = await fetch(`${backendUrl}/user/see-later`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudieron obtener los videos de ver más tarde");
        const data = await res.json();
        if (Array.isArray(data.see_later)) {
          setSeeLaterIds(data.see_later);
          setHasMore(data.see_later.length > 0);
        } else {
          setSeeLaterIds([]);
          setHasMore(false);
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar ver más tarde");
      } finally {
        setLoading(false);
      }
    };
    fetchSeeLaterIds();
  }, [router]);

  // Cargar videos de la página actual
  const loadVideos = useCallback(async () => {
    if (!seeLaterIds.length || loadingMore) return;
    setLoadingMore(true);
    setError("");
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000/api";
    const start = pageRef.current * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const idsToFetch = seeLaterIds.slice(start, end);
    try {
      const videoPromises = idsToFetch.map(id =>
        fetch(`${backendUrl}/youtube/video?id=${id}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
      );
      const results = await Promise.all(videoPromises);
      const newVideos = results
        .filter(Boolean)
        .map((data: any) => data && data.id ? data : null)
        .filter(Boolean);
      setVideos(prev => {
        // Evitar duplicados
        const existingIds = new Set(prev.map(v => typeof v.id === 'string' ? v.id : v.id?.videoId));
        return [...prev, ...newVideos.filter(v => {
          const vid = typeof v.id === 'string' ? v.id : v.id?.videoId;
          return !existingIds.has(vid);
        })];
      });
      pageRef.current += 1;
      if (end >= seeLaterIds.length) setHasMore(false);
    } catch (err: any) {
      setError("Error al cargar videos de ver más tarde");
    } finally {
      setLoadingMore(false);
    }
  }, [seeLaterIds, loadingMore]);

  // Cargar la primera página de videos cuando seeLaterIds cambia
  useEffect(() => {
    if (seeLaterIds.length > 0) {
      setVideos([]);
      pageRef.current = 0;
      setHasMore(true);
      setTimeout(() => {
        loadVideos();
      }, 0);
    }
  }, [seeLaterIds]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loadingMore || loading) return;
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        hasMore && !loadingMore
      ) {
        loadVideos();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, loading, loadVideos]);

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
        <h2 className="text-2xl font-bold mb-6 text-primary">Ver más tarde</h2>
        {loading && <p className="text-tertiary">Cargando videos...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!loading && !error && seeLaterIds.length === 0 && (
          <p className="text-tertiary">No tienes videos guardados para ver más tarde.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, idx) => {
            // Adaptar la estructura para VideoCard
            let videoId = undefined;
            let videoForCard = video;
            if (typeof video.id === 'string') {
              videoId = video.id;
              videoForCard = {
                ...video,
                id: {
                  videoId: video.id,
                  channelId: video.snippet?.channelId
                }
              };
            } else {
              videoId = video?.id?.videoId;
            }
            if (!videoId) return null;
            return <VideoCard key={videoId || idx} video={videoForCard} formatDate={formatDate} />;
          })}
        </div>
        {loadingMore && (
          <div className="text-center py-4">
            <p className="text-tertiary text-sm">Cargando más videos...</p>
          </div>
        )}
        {!hasMore && videos.length > 0 && (
          <div className="text-center py-4">
            <p className="text-tertiary text-sm">No hay más videos.</p>
          </div>
        )}
      </main>
    </div>
  );
} 