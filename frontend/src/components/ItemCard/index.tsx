import { Video } from '@/types/Video';
import Link from 'next/link';

interface ItemCardProps {
  video: Video;
  formatDate: (dateString: string) => string;
}

export default function ItemCard({ video, formatDate }: ItemCardProps) {
  const isChannel = video.id.channelId;
  const isVideo = video.id.videoId;
  const channelId = video.id.channelId || video.snippet.channelId;
  
  // Si es un canal, usar thumbnail default, si es video usar medium
  const thumbnailUrl = isChannel 
    ? video.snippet.thumbnails.default?.url 
    : video.snippet.thumbnails.medium?.url;

  return (
    <div
      className="bg-surface-secondary border border-theme rounded-lg overflow-hidden shadow-theme-md hover:shadow-theme-lg transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={thumbnailUrl}
          alt={video.snippet.title}
          className="w-full h-48 object-cover"
        />
        {isVideo && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
            <svg className="w-16 h-16 text-white opacity-0 hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Información del video/canal */}
      <div className="p-4">
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
        
        <p className="text-secondary text-sm line-clamp-3">
          {video.snippet.description}
        </p>

        {/* Botón para ver video o canal */}
        <a
          href={isChannel 
            ? `https://www.youtube.com/channel/${channelId}`
            : `https://www.youtube.com/watch?v=${video.id.videoId}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          {isChannel ? 'Ver canal' : 'Ver en YouTube'}
        </a>
      </div>
    </div>
  );
}
