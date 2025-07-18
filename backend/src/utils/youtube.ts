const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export const searchYouTube = async (query: string) => {
  const apiKey = process.env.YT_API_KEY;
  const maxResults = 18;

  if (!apiKey) {
    throw new Error('YouTube API key no configurada');
  }

  const url = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=${maxResults}&type=video`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items;
};
