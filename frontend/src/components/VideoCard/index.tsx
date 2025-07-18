import { Video } from '@/types/Video';
import Link from 'next/link';

interface VideoCardProps {
  video: Video;
  formatDate: (dateString: string) => string;
}

export default function VideoCard({ video, formatDate }: VideoCardProps) {
  const isChannel = video.id.channelId;
  const isVideo = video.id.videoId;
  const channelId = video.id.channelId || video.snippet.channelId;
  
  // Si es un canal, usar thumbnail default, si es video usar medium
  const thumbnailUrl = isChannel 
    ? video.snippet.thumbnails.default?.url 
    : video.snippet.thumbnails.medium?.url;

  if (isChannel) {
    // Para canales, mantener el diseño original sin enlace
    return (
      <div
        className="bg-surface-secondary border border-theme rounded-lg overflow-hidden shadow-theme-md hover:shadow-theme-lg transition-shadow h-full flex flex-col"
      >
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={thumbnailUrl}
            alt={video.snippet.title}
            className="w-full h-48 object-cover"
          />
        </div>

        {/* Información del canal */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-primary mb-2 line-clamp-2">
            {video.snippet.title}
          </h3>
          
          <p className="text-tertiary text-sm mb-2">
            <Link href={channelId ? `/channel/${channelId}` : '#'} className="hover:underline">
              {video.snippet.channelTitle}
            </Link>
          </p>
          
          <p className="text-tertiary text-xs mb-3">
            {formatDate(video.snippet.publishedAt)}
          </p>
          
          <p className="text-secondary text-sm line-clamp-3 flex-1">
            {video.snippet.description}
          </p>
        </div>
      </div>
    );
  }

  // Para videos, hacer toda la card clickeable
  return (
    <Link href={`/video/${video.id.videoId}`} className="block h-full">
      <div
        className="bg-surface-secondary border border-theme rounded-lg overflow-hidden shadow-theme-md hover:shadow-theme-lg transition-shadow cursor-pointer h-full flex flex-col"
      >
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={thumbnailUrl}
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
          <h3 className="font-semibold text-primary mb-2 line-clamp-2">
            {video.snippet.title}
          </h3>
          
          <p className="text-tertiary text-sm mb-2">
            <Link href={channelId ? `/channel/${channelId}` : '#'} className="hover:underline" onClick={(e) => e.stopPropagation()}>
              {video.snippet.channelTitle}
            </Link>
          </p>
          
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
