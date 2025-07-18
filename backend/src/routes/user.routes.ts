import { Router, Request, Response } from "express";
import User from "../models/User";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Añadir a favoritos
router.post("/favorites/:videoId", authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { videoId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    if (!user.favorites.includes(videoId)) {
      user.favorites.push(videoId);
      await user.save();
    }
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Error al agregar a favoritos" });
  }
});

// Quitar de favoritos
router.delete("/favorites/:videoId", authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { videoId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    user.favorites = user.favorites.filter((id: string) => id !== videoId);
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Error al quitar de favoritos" });
  }
});

// Listar favoritos
router.get("/favorites", authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener favoritos" });
  }
});

// Añadir a ver más tarde
router.post("/see-later/:videoId", authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { videoId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    if (!user.see_later.includes(videoId)) {
      user.see_later.push(videoId);
      await user.save();
    }
    res.json({ see_later: user.see_later });
  } catch (err) {
    res.status(500).json({ message: "Error al agregar a ver más tarde" });
  }
});

// Quitar de ver más tarde
router.delete("/see-later/:videoId", authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { videoId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    user.see_later = user.see_later.filter((id: string) => id !== videoId);
    await user.save();
    res.json({ see_later: user.see_later });
  } catch (err) {
    res.status(500).json({ message: "Error al quitar de ver más tarde" });
  }
});

// Listar ver más tarde
router.get("/see-later", authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ see_later: user.see_later });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener ver más tarde" });
  }
});

export default router; 