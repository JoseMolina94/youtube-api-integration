const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export const searchYouTube = async (query: string, type: string = 'video', pageToken?: string, channelId?: string) => {
  const apiKey = process.env.YT_API_KEY;
  const maxResults = 18;

  if (!apiKey) {
    throw new Error('YouTube API key no configurada');
  }

  let url = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=${maxResults}&type=${type}&order=date`;
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }
  if (channelId) {
    url += `&channelId=${channelId}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.statusText}`);
  }

  const data = await response.json();
  return { items: data.items, nextPageToken: data.nextPageToken };
};

export const getChannelDetails = async (id: string) => {
  const apiKey = process.env.YT_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key no configurada');
  }
  // Obtener detalles básicos y brandingSettings
  const url = `${YOUTUBE_API_BASE}/channels?part=snippet,brandingSettings&id=${id}&key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.items || !data.items[0]) return null;
  const item = data.items[0];
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    avatar: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    banner: item.brandingSettings?.image?.bannerExternalUrl || null,
  };
};
