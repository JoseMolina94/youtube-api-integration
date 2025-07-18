export interface Video {
  id: {
    videoId?: string;
    channelId?: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium?: {
        url: string;
      };
      default?: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
    channelId?: string;
  };
}