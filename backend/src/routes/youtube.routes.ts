import { Router, Request, Response } from 'express';
import { searchYouTube } from '../utils/youtube';

const router = Router();

router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query) return res.status(400).json({ error: 'Parámetro "q" requerido' });

  try {
    const results = await searchYouTube(query);
    res.json(results);
  } catch (err: any) {
    console.error('Error buscando en YouTube:', err);
    res.status(500).json({ error: 'Error al consultar YouTube' });
  }
});

export default router;