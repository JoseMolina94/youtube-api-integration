import { Video } from '@/types/Video';
import { useState } from 'react';
import Link from 'next/link';

interface ChannelMiniCardProps {
  channel: Video;
}

const PLACEHOLDER = "/favicon.ico";

export default function ChannelMiniCard({ channel }: ChannelMiniCardProps) {
  const [imgSrc, setImgSrc] = useState(channel.snippet.thumbnails.default?.url || PLACEHOLDER);

  return (
    <Link href={`/channel/${channel.id.channelId}`} className="block">
      <div className="flex items-center space-x-3 p-3 hover:bg-surface-primary rounded-lg transition-colors cursor-pointer">
        <img
          src={imgSrc}
          alt={channel.snippet.channelTitle}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          loading="lazy"
          onError={() => setImgSrc(PLACEHOLDER)}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-primary text-sm line-clamp-1">
            {channel.snippet.channelTitle}
          </h4>
          <p className="text-tertiary text-xs mt-1 line-clamp-2">
            {channel.snippet.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
