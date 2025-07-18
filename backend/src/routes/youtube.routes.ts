import { Router, Request, Response } from 'express';
import { searchYouTube, getChannelDetails } from '../utils/youtube';

const router = Router();

router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const type = (req.query.type as string) || 'video';
  const pageToken = req.query.pageToken as string | undefined;
  const channelId = req.query.channelId as string | undefined;
  if (!query && !channelId) return res.status(400).json({ error: 'Parámetro "q" o "channelId" requerido' });

  try {
    const results = await searchYouTube(query, type, pageToken, channelId);
    res.json(results);
  } catch (err: any) {
    console.error('Error buscando en YouTube:', err);
    res.status(500).json({ error: 'Error al consultar YouTube' });
  }
});

router.get('/channel', async (req: Request, res: Response) => {
  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Parámetro "id" requerido' });
  try {
    const details = await getChannelDetails(id);
    if (!details) return res.status(404).json({ error: 'Canal no encontrado' });
    res.json(details);
  } catch (err: any) {
    console.error('Error obteniendo detalles del canal:', err);
    res.status(500).json({ error: 'Error al consultar YouTube' });
  }
});

export default router;