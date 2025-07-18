import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User";
import { authenticateToken } from "../middleware/auth";
import { loginUser, getCurrentUser } from "../controllers/authController";

dotenv.config();

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "El email ya está registrado" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/me
router.get("/me", authenticateToken, getCurrentUser);

export default router;
